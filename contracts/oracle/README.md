# Oracle

El contrato que determina el resultado final de los mercados de prediccion.

## Que hace

Cuando un mercado cierra ("Ganara Brasil el Mundial?"), alguien tiene que decir cual fue el resultado real. El Oracle maneja ese proceso con un sistema de **submit + dispute** para evitar fraudes.

## Flujo completo

```
  1. SUBMIT                2. ESPERA               3. FINALIZE
  ──────────               ────────                ───────────
  Oracle autorizado        Periodo de disputa      Si nadie disputo,
  propone un               (2 horas por default)   el resultado se
  resultado                                        acepta como final
        │                        │                        │
        ▼                        ▼                        ▼
  "YES gano"          ┌─ Nadie disputa ──────► Resultado FINAL
                      │
                      └─ Alguien disputa ──► DISPUTE FLOW
                               │
                               ▼
                      ┌──────────────────┐
                      │  Admin resuelve  │
                      │                  │
                      ├─ Disputer gana:  │
                      │  Bond devuelto   │
                      │  Resultado       │
                      │  corregido       │
                      │                  │
                      ├─ Oracle gana:    │
                      │  Bond va al      │
                      │  treasury        │
                      └──────────────────┘
```

## El sistema de disputes (disputas)

Para disputar un resultado, el disputer debe depositar un **bond** (fianza) en USDC:

```
  Disputer cree que el oracle se equivoco
        │
        ├──► Deposita 1 USDC como bond
        │    (se transfiere al contrato)
        │
        └──► Admin investiga y decide:
             │
             ├─ Disputer tenia razon:
             │  ✓ Bond devuelto al disputer
             │  ✓ Resultado corregido
             │
             └─ Oracle tenia razon:
                ✗ Bond enviado al treasury
                ✗ Resultado original se mantiene
```

Este mecanismo desincentiva disputas frivolos (pierdes tu bond) pero protege contra oracles maliciosos.

## Funciones

| Funcion | Quien | Que hace |
|---------|-------|----------|
| `add_oracle` | Admin | Autoriza una direccion como oracle |
| `remove_oracle` | Admin | Revoca autorizacion de oracle |
| `submit_result` | Oracle autorizado | Propone el resultado de un mercado |
| `dispute` | Cualquier usuario | Disputa un resultado (paga bond en USDC) |
| `resolve_dispute` | Admin | Decide quien gana la disputa |
| `finalize` | Cualquiera | Finaliza resultado despues del periodo de disputa |
| `admin_resolve` | Admin | Atajo: resuelve directamente sin disputa |

## Datos tecnicos

- **11 tests**
- Periodo de disputa: 7200 segundos (2 horas), configurable
- Dispute bond: 1 USDC (10,000,000 stroops con 7 decimales)
- USDC real: bonds se transfieren on-chain
- `admin_resolve` existe como atajo para el hackathon
