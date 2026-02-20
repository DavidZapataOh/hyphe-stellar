# Market Factory

El contrato que crea y administra los mercados de prediccion.

## Que hace

Es la "fabrica" de mercados. Permite crear preguntas como "Ganara Brasil el Mundial?" y manejar todo el ciclo de vida: desde que se abre la apuesta hasta que se paga al ganador.

## Ciclo de vida de un mercado

```
  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
  │   OPEN   │────►│  CLOSED  │────►│ RESOLVED │────►│  REDEEM  │
  │          │     │          │     │          │     │          │
  │ usuarios │     │ expiro   │     │ el oracle│     │ ganadores│
  │ apuestan │     │ el plazo │     │ da el    │     │ cobran   │
  │          │     │          │     │ resultado│     │ USDC     │
  └──────────┘     └──────────┘     └──────────┘     └──────────┘
```

## Operaciones principales

### Split: USDC a tokens
El usuario deposita USDC y recibe cantidades iguales de TODOS los outcome tokens.

```
  Usuario deposita 100 USDC
        │
        ▼
  ┌──────────────────┐
  │  MARKET FACTORY  │
  │                  │
  │  100 USDC entra  │
  │                  │
  │  Sale:           │
  │  100 Token YES   │
  │  100 Token NO    │
  └──────────────────┘
```

### Merge: tokens a USDC
Operacion inversa: el usuario devuelve cantidades iguales de todos los tokens y recupera sus USDC.

### Redeem: cobrar ganancias
Cuando el mercado se resuelve, los holders del token ganador queman sus tokens y reciben 1 USDC por cada uno.

```
  Mercado resuelto: YES gana

  Alice tiene 100 YES + 50 NO
        │
        ▼
  Quema 100 YES ──► Recibe 100 USDC
  Quema 50 NO  ──► Recibe 0 USDC (vale 0)
```

### Sweep to Vault
El admin puede mover USDC del factory al vault para que genere yield en Blend Protocol.

## Funciones

| Funcion | Quien | Que hace |
|---------|-------|----------|
| `create_market` | Admin | Crea un nuevo mercado con pregunta, # outcomes, deadline, oracle |
| `split` | Usuario | Deposita USDC, recibe outcome tokens |
| `merge` | Usuario | Devuelve tokens, recibe USDC |
| `resolve` | Oracle | Declara el resultado ganador |
| `redeem` | Usuario | Quema tokens ganadores, cobra USDC |
| `sweep_to_vault` | Admin | Mueve USDC al vault para yield |
| `get_market` | Cualquiera | Consulta info de un mercado |

## Datos tecnicos

- **10 tests**
- Usa USDC real (Stellar Asset Contract)
- Cross-contract: llama a OutcomeToken para mint/burn via `env.invoke_contract()`
- Los mercados se identifican con un ID secuencial (1, 2, 3...)
