/// Fixed-point arithmetic with 18 decimal places.
/// 1.0 is represented as 10^18.
///
/// Overflow-safe: mul_fixed splits operands to avoid i128 overflow.

pub const SCALE: i128 = 1_000_000_000_000_000_000; // 10^18
const UNIT: i128 = 1_000_000_000; // 10^9 = sqrt(SCALE)

/// Fixed-point multiplication: (a * b) / SCALE
/// Uses UNIT = sqrt(SCALE) splitting to avoid i128 overflow.
/// Max safe input: ~10^28 per operand.
pub fn mul_fixed(a: i128, b: i128) -> i128 {
    // a * b / SCALE = a * b / (UNIT * UNIT)
    // Split both: a = a_hi * UNIT + a_lo, b = b_hi * UNIT + b_lo
    let a_hi = a / UNIT;
    let a_lo = a % UNIT;
    let b_hi = b / UNIT;
    let b_lo = b % UNIT;
    // (a_hi*UNIT + a_lo) * (b_hi*UNIT + b_lo) / (UNIT*UNIT)
    // = a_hi*b_hi + (a_hi*b_lo + a_lo*b_hi)/UNIT + a_lo*b_lo/(UNIT*UNIT)
    a_hi * b_hi
        + (a_hi * b_lo + a_lo * b_hi) / UNIT
        + a_lo * b_lo / (UNIT * UNIT)
}

/// Fixed-point division: (a * SCALE) / b
/// Uses two-step multiplication to avoid overflow.
pub fn div_fixed(a: i128, b: i128) -> i128 {
    if b == 0 {
        panic!("division by zero");
    }
    // a * SCALE / b = a * UNIT * UNIT / b
    // Step 1: intermediate = a * UNIT (safe if a < ~10^29)
    // Step 2: result = (intermediate / b) * UNIT + (intermediate % b) * UNIT / b
    let intermediate = a * UNIT;
    let quot = intermediate / b;
    let rem = intermediate % b;
    quot * UNIT + rem * UNIT / b
}

/// Exponential function: e^x using Taylor series with range reduction.
/// x is in fixed-point (18 decimals).
pub fn exp_fixed(x: i128) -> i128 {
    if x < 0 {
        let pos_exp = exp_fixed(-x);
        if pos_exp == 0 {
            return SCALE * 100; // cap
        }
        return div_fixed(SCALE, pos_exp);
    }

    // Cap to avoid overflow: exp(43) ≈ 4.7e18 which is near SCALE range
    let max_x = 43 * SCALE;
    let capped_x = if x > max_x { max_x } else { x };

    // Range reduction: split x into integer and fractional parts
    let int_part = capped_x / SCALE;
    let frac_part = capped_x % SCALE;

    // exp(frac_part) via Taylor series (0 <= frac_part < 1.0)
    let exp_frac = exp_taylor(frac_part);

    // exp(int_part) via repeated squaring with precomputed e
    let e: i128 = 2_718_281_828_459_045_235; // e * 10^18

    let mut exp_int = SCALE;
    for _ in 0..int_part {
        exp_int = mul_fixed(exp_int, e);
    }

    mul_fixed(exp_int, exp_frac)
}

/// Taylor series for exp(x) where 0 <= x < SCALE (i.e. 0 <= x < 1.0)
fn exp_taylor(x: i128) -> i128 {
    let mut result = SCALE; // 1.0
    let mut term = x;       // x/1!
    result += term;

    for i in 2..=20i128 {
        term = mul_fixed(term, x) / i;
        result += term;
        if term.abs() < 100 {
            break;
        }
    }

    result
}

/// Natural logarithm: ln(x) where x > 0, in fixed-point.
/// Uses range reduction + atanh series.
pub fn ln_fixed(x: i128) -> i128 {
    if x <= 0 {
        panic!("ln of non-positive number");
    }
    if x == SCALE {
        return 0;
    }

    let ln2: i128 = 693_147_180_559_945_309; // ln(2) * 10^18

    // Normalize x to [0.5, 2.0] by dividing/multiplying by 2
    let half_scale = SCALE / 2;
    let two_scale = 2 * SCALE;

    let mut normalized = x;
    let mut k: i128 = 0;

    while normalized > two_scale {
        normalized /= 2;
        k += 1;
    }
    while normalized < half_scale {
        normalized *= 2;
        k -= 1;
    }

    // ln(normalized) = 2 * atanh((normalized-1)/(normalized+1))
    let num = normalized - SCALE;
    let den = normalized + SCALE;
    let z = div_fixed(num, den);
    let z2 = mul_fixed(z, z);

    let mut result = z;
    let mut power = z;

    let mut i: i128 = 3;
    while i <= 31 {
        power = mul_fixed(power, z2);
        result += power / i;
        if power.abs() < 100 {
            break;
        }
        i += 2;
    }

    result = result * 2;
    result + k * ln2
}

// ============================================================
// USDC CONVERSION (7 decimals)
// ============================================================

pub const USDC_DECIMALS: i128 = 10_000_000; // 10^7
const FIXED_TO_USDC: i128 = 100_000_000_000; // 10^11 = SCALE / USDC_DECIMALS

/// Convert fixed-point (18 decimals) to USDC (7 decimals), rounding up.
/// Used for buy costs — user always pays at least enough.
pub fn to_usdc_ceil(fixed: i128) -> i128 {
    if fixed <= 0 {
        return 0;
    }
    (fixed + FIXED_TO_USDC - 1) / FIXED_TO_USDC
}

/// Convert fixed-point (18 decimals) to USDC (7 decimals), rounding down.
/// Used for sell refunds — AMM never overpays.
pub fn to_usdc_floor(fixed: i128) -> i128 {
    if fixed <= 0 {
        return 0;
    }
    fixed / FIXED_TO_USDC
}

// ============================================================
// TESTS
// ============================================================

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_mul_fixed() {
        assert_eq!(mul_fixed(2 * SCALE, 3 * SCALE), 6 * SCALE);
        assert_eq!(mul_fixed(SCALE / 2, SCALE / 2), SCALE / 4);
    }

    #[test]
    fn test_mul_fixed_large() {
        // 1000 * 2.718... should not overflow
        let result = mul_fixed(1000 * SCALE, 2_718_281_828_459_045_235);
        let expected = 2718 * SCALE; // roughly
        let tolerance = 2 * SCALE;
        assert!((result - expected).abs() < tolerance, "large mul: {}", result);
    }

    #[test]
    fn test_div_fixed() {
        assert_eq!(div_fixed(6 * SCALE, 3 * SCALE), 2 * SCALE);
        assert_eq!(div_fixed(SCALE, 2 * SCALE), SCALE / 2);
    }

    #[test]
    fn test_div_fixed_large() {
        // 100_000 * SCALE / (50_000 * SCALE) = 2
        let result = div_fixed(100_000 * SCALE, 50_000 * SCALE);
        assert_eq!(result, 2 * SCALE);
    }

    #[test]
    fn test_exp_zero() {
        assert_eq!(exp_fixed(0), SCALE);
    }

    #[test]
    fn test_exp_one() {
        let result = exp_fixed(SCALE);
        let expected = 2_718_281_828_459_045_235i128;
        let tolerance = SCALE / 1000;
        assert!((result - expected).abs() < tolerance, "exp(1)={} expected ~{}", result, expected);
    }

    #[test]
    fn test_ln_one() {
        assert_eq!(ln_fixed(SCALE), 0);
    }

    #[test]
    fn test_ln_e() {
        let e = 2_718_281_828_459_045_235i128;
        let result = ln_fixed(e);
        let tolerance = SCALE / 1000;
        assert!((result - SCALE).abs() < tolerance, "ln(e)={} expected ~{}", result, SCALE);
    }

    #[test]
    fn test_exp_ln_roundtrip() {
        for x_mult in [1i128, 2, 5, 10].iter() {
            let x = *x_mult * SCALE;
            let result = exp_fixed(ln_fixed(x));
            let tolerance = x / 50; // 2%
            assert!(
                (result - x).abs() < tolerance,
                "exp(ln({})) = {} expected ~{}", x_mult, result, x
            );
        }
    }

    #[test]
    fn test_exp_negative() {
        let result = exp_fixed(-SCALE);
        let expected = 367_879_441_171_442_321i128;
        let tolerance = SCALE / 100;
        assert!((result - expected).abs() < tolerance, "exp(-1)={}", result);
    }

    #[test]
    fn test_ln_two() {
        let result = ln_fixed(2 * SCALE);
        let expected = 693_147_180_559_945_309i128;
        let tolerance = SCALE / 1000;
        assert!((result - expected).abs() < tolerance, "ln(2)={}", result);
    }

    #[test]
    fn test_to_usdc_ceil() {
        // 50 units in fixed-point → 50 USDC = 500_000_000 stroops
        assert_eq!(to_usdc_ceil(50 * SCALE), 500_000_000);
        // 0.5 units → 5_000_000 stroops
        assert_eq!(to_usdc_ceil(SCALE / 2), 5_000_000);
        // Tiny amount rounds up to 1
        assert_eq!(to_usdc_ceil(1), 1);
        // Zero
        assert_eq!(to_usdc_ceil(0), 0);
    }

    #[test]
    fn test_to_usdc_floor() {
        assert_eq!(to_usdc_floor(50 * SCALE), 500_000_000);
        assert_eq!(to_usdc_floor(SCALE / 2), 5_000_000);
        // Tiny amount rounds down to 0
        assert_eq!(to_usdc_floor(1), 0);
    }
}
