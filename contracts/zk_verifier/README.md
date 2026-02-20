# ZK Verifier

El contrato que verifica pruebas de conocimiento cero (ZKP) directamente on-chain.

## Que hace

Permite que un usuario demuestre algo **sin revelar la informacion**. Por ejemplo: "Tengo mas de $10,000 en mi cuenta" sin revelar cuanto exactamente, o "Hice una apuesta valida" sin revelar cual fue.

## Como funcionan las ZK proofs (simplificado)

```
  OFF-CHAIN (en tu computadora)         ON-CHAIN (en Stellar)
  ──────────────────────────────         ──────────────────────

  Tu tienes un secreto                  El contrato solo ve
  (ej: tu balance real)                 la prueba matematica
        │                                      │
        ▼                                      ▼
  Circuito ZK genera                    Verifica la prueba
  una "prueba" (proof)                  usando pairing check
        │                               en curva BN254
        ▼                                      │
  La prueba demuestra                          ▼
  que tu claim es valido              ✓ Valida: acepta
  SIN revelar el secreto              ✗ Invalida: rechaza
```

## Groth16 + BN254

Este contrato usa **Groth16**, uno de los sistemas ZK mas eficientes:

- **Proof size**: Solo 3 elementos (A, B, C) = ~256 bytes
- **Verificacion**: Una sola operacion de pairing check
- **Curva**: BN254 (aka alt_bn128), la misma que usa Ethereum

```
  Ecuacion de verificacion:

  e(-A, B) * e(alpha, beta) * e(vk_x, gamma) * e(C, delta) = 1

  Donde:
  - A, B, C = la prueba (la genera el prover off-chain)
  - alpha, beta, gamma, delta = verification key (publica)
  - vk_x = combinacion de inputs publicos con la VK
  - e() = funcion de pairing en curva eliptica BN254
```

## Circuitos soportados

Cada tipo de prueba ZK se registra como un "circuito" con su propia verification key:

| ID | Circuito | Uso |
|----|----------|-----|
| 1 | `private_bet` | Apostar sin revelar el monto o resultado |
| 2 | `private_redemption` | Cobrar ganancias sin revelar cuanto |
| 3 | `compliance_proof` | Demostrar cumplimiento regulatorio |

## Proteccion anti-replay: Nullifiers

Cada prueba incluye un **nullifier** unico. Una vez usado, no se puede reutilizar:

```
  Prueba #1 con nullifier 0xabc ──► Aceptada, nullifier marcado
  Prueba #2 con nullifier 0xabc ──► RECHAZADA (ya se uso)
  Prueba #3 con nullifier 0xdef ──► Aceptada, nullifier marcado
```

## Funciones

| Funcion | Quien | Que hace |
|---------|-------|----------|
| `register_circuit` | Admin | Registra una verification key para un tipo de circuito |
| `deactivate_circuit` | Admin | Desactiva un circuito |
| `verify` | Cualquiera | Verifica una prueba Groth16 + marca nullifier |
| `private_bet` | Usuario | Verifica prueba + registra apuesta privada |
| `is_nullifier_used` | Cualquiera | Consulta si un nullifier ya fue usado |

## Flujo de una apuesta privada

```
  1. Admin registra circuito "private_bet" con su verification key

  2. Usuario genera proof off-chain:
     - Input privado: monto=500, outcome=YES, salt=random
     - Input publico: commitment_hash (el contrato lo ve)
     - Output: proof (A, B, C) + nullifier

  3. Usuario llama private_bet(proof, public_inputs, nullifier)

  4. Contrato:
     ├── Verifica que el circuito existe y esta activo
     ├── Verifica que el nullifier no se ha usado
     ├── Ejecuta pairing check BN254
     ├── Si valido: marca nullifier como usado
     └── Emite evento "pvt_bet"
```

## Datos tecnicos

- **12 tests** con puntos reales de la curva BN254
- Verificacion via `env.crypto().bn254().pairing_check()` (Soroban Protocol 25)
- G1 points: 64 bytes (x || y, big-endian)
- G2 points: 128 bytes (X_c1 || X_c0 || Y_c1 || Y_c0, big-endian, Ethereum-compatible)
- Pairing check usa ~40M instrucciones (~40% del budget maximo de Soroban)
