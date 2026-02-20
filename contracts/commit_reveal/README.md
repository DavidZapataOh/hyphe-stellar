# Commit-Reveal

El contrato que permite hacer apuestas privadas en dos fases.

## Que hace

En un mercado de prediccion normal, todos ven tu apuesta al instante. Esto permite que otros copien tu estrategia o manipulen el precio antes de que tu orden se ejecute (front-running).

El esquema **commit-reveal** resuelve esto dividiendo la apuesta en dos pasos:

```
  FASE 1: COMMIT (tu apuesta es secreta)
  ────────────────────────────────────────

  Usuario quiere apostar 500 USDC a YES en mercado #1
        │
        ├──► Calcula hash = SHA256(market_id + outcome + amount + salt)
        │    (el hash no revela la apuesta)
        │
        ├──► Envia el hash + bloquea 1000 USDC como colateral
        │
        └──► Nadie sabe que aposto ni cuanto


  FASE 2: REVEAL (revelas tu apuesta)
  ────────────────────────────────────────

  Dentro del deadline (1 hora):
        │
        ├──► Revela: market=1, outcome=YES, amount=500, salt=xyz
        │
        ├──► Contrato verifica que el hash coincide
        │
        ├──► USDC devuelto al usuario
        │    (usuario luego ejecuta el trade en el AMM)
        │
        └──► Si no revela a tiempo ──► RECLAIM
             (recupera el USDC bloqueado)
```

## Por que dos fases?

```
  SIN commit-reveal:              CON commit-reveal:

  Alice apuesta $1000 a YES       Alice envia un hash (nadie sabe que)
        │                                │
        ▼                                ▼
  Bot ve la transaccion            Bot ve un hash
  Bot compra YES antes             Bot no sabe nada
  Precio sube                      Precio no cambia
  Alice paga mas                   Alice revela despues
                                   y paga precio justo
```

## Funciones

| Funcion | Quien | Que hace |
|---------|-------|----------|
| `commit` | Usuario | Envia hash + bloquea USDC como colateral |
| `reveal` | Usuario | Revela los parametros, recibe USDC de vuelta |
| `reclaim` | Usuario | Recupera USDC si no revelo a tiempo |
| `get_commitment` | Cualquiera | Consulta el estado de un commitment |

## Ejemplo paso a paso

```
  1. Alice quiere apostar 500 USDC a YES en mercado 1

  2. Alice genera un salt aleatorio: 0xabc123...

  3. Alice calcula:
     hash = SHA256(market_id=1 || outcome=0 || amount=500 || salt=0xabc123...)

  4. Alice llama commit(hash, 1000 USDC)
     ──► 1000 USDC se transfieren al contrato

  5. 30 minutos despues, Alice llama reveal(market=1, outcome=0, amount=500, salt=0xabc123...)
     ──► Contrato recalcula el hash y verifica que coincide
     ──► 1000 USDC devueltos a Alice
     ──► Alice puede usar 500 USDC para comprar en el AMM

  6. Si Alice NO revela en 1 hora:
     ──► Alice llama reclaim() y recupera los 1000 USDC
```

## Datos tecnicos

- **9 tests**
- Hash: SHA-256 on-chain (`env.crypto().sha256()`)
- Deadline: 3600 segundos (1 hora), configurable
- USDC real: colateral se transfiere on-chain al commit, se devuelve al reveal
- El trade en el AMM se ejecuta en una transaccion separada despues del reveal
