# Outcome Token

El contrato que representa las apuestas de los usuarios como tokens digitales.

## Que hace

Cuando apuestas en un mercado de prediccion, recibes **outcome tokens** — tokens que representan tu posicion. Si el mercado tiene dos opciones (SI / NO), existen dos tipos de tokens. El token ganador vale 1 USDC al final; el perdedor vale 0.

```
Mercado: "Ganara Brasil el Mundial?"

  Token YES ──► Vale 1 USDC si Brasil gana
  Token NO  ──► Vale 1 USDC si Brasil pierde
```

## Como funciona

Este contrato es como un libro de contabilidad. Registra cuantos tokens tiene cada usuario para cada mercado y cada resultado posible.

```
┌─────────────────────────────────────────────┐
│           OUTCOME TOKEN CONTRACT            │
│                                             │
│  Balances:                                  │
│    Market 1, YES: Alice=500, Bob=300        │
│    Market 1, NO:  Alice=200, Carol=100      │
│    Market 2, YES: Bob=1000                  │
│                                             │
│  Minters autorizados:                       │
│    ✓ MarketFactory (split/merge)            │
│    ✓ LMSR AMM (buy/sell)                    │
└─────────────────────────────────────────────┘
```

## Funciones principales

| Funcion | Quien la llama | Que hace |
|---------|---------------|----------|
| `mint` | MarketFactory, AMM | Crea tokens nuevos para un usuario |
| `burn` | MarketFactory, AMM | Destruye tokens de un usuario |
| `transfer` | Cualquier usuario | Envia tokens a otro usuario |
| `balance` | Cualquiera | Consulta cuantos tokens tiene alguien |
| `add_minter` | Admin | Autoriza un contrato para crear/destruir tokens |

## Seguridad

Solo los contratos autorizados como **minters** pueden crear o destruir tokens. Un usuario normal solo puede transferir los suyos. Esto previene que alguien cree tokens de la nada.

## Datos tecnicos

- **9 tests**
- Cada balance se identifica por la combinacion `(market_id, outcome, user)`
- Los datos persisten ~60 dias en el ledger de Stellar (se renuevan automaticamente)
