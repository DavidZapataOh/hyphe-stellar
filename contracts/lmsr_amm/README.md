# LMSR AMM

El market maker automatizado que determina los precios de los outcome tokens.

## Que hace

LMSR (Logarithmic Market Scoring Rule) es un algoritmo matematico que:
1. Calcula el **precio** de cada resultado en tiempo real
2. Permite **comprar y vender** outcome tokens a un precio justo
3. Garantiza que los precios **siempre sumen 1** (100%)

## Como funcionan los precios

```
  Inicio (nadie ha apostado):

  YES: 50%  ████████████████████░░░░░░░░░░░░░░░░░░░░
  NO:  50%  ████████████████████░░░░░░░░░░░░░░░░░░░░

  Despues de que varios compran YES:

  YES: 73%  █████████████████████████████░░░░░░░░░░░
  NO:  27%  ███████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

  Los precios siempre suman 100%.
```

Cuando alguien compra tokens YES, el precio de YES sube y el de NO baja. El mercado refleja lo que la gente cree que va a pasar.

## El parametro B (liquidez)

El parametro `b` controla que tan rapido cambian los precios:

```
  b grande (100,000) = Precios se mueven poco
  ──────────────────────────────────────────────
  Ideal para mercados con mucho volumen.
  Una compra de $100 apenas mueve el precio.

  b pequeno (10) = Precios se mueven mucho
  ──────────────────────────────────────────────
  Ideal para mercados nuevos con poca actividad.
  Una compra de $100 mueve el precio significativamente.
```

## Flujo de compra/venta

```
  COMPRAR (buy)                          VENDER (sell)
  ─────────────                          ──────────────
  Usuario                                Usuario
    │                                      │
    ├─ Paga USDC al AMM                    ├─ Devuelve outcome tokens
    │                                      │
    └─ Recibe outcome tokens               └─ Recibe USDC del AMM
       (minteados al momento)                 (tokens quemados)
```

## Funciones

| Funcion | Quien | Que hace |
|---------|-------|----------|
| `init_market` | Admin | Configura LMSR para un mercado (# outcomes, b) |
| `buy` | Usuario | Compra outcome tokens pagando USDC |
| `sell` | Usuario | Vende outcome tokens recibiendo USDC |
| `get_price` | Cualquiera | Precio actual de un outcome (0 a 1) |
| `get_prices` | Cualquiera | Precios de todos los outcomes |
| `quote_buy` | Cualquiera | Cuanto costaria comprar N shares (sin ejecutar) |
| `fund` | Cualquiera | Deposita USDC como liquidez al AMM |

## Matematica (simplificada)

```
  Precio de outcome i = exp(q_i / b) / sum(exp(q_j / b))

  Costo de comprar = b * ln(sum_after) - b * ln(sum_before)
```

Donde `q_i` es la cantidad de shares vendidos del outcome i.

## Datos tecnicos

- **26 tests**
- Aritmetica de punto fijo con 18 decimales de precision
- USDC con 7 decimales (Stellar standard)
- Redondeo: al comprar redondea arriba (el AMM nunca pierde), al vender redondea abajo
- Cross-contract: mint/burn outcome tokens via OutcomeToken
- Soporta mercados con 2, 3 o mas outcomes
