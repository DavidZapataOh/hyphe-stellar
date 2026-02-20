# Hyphe Vault

El contrato que genera yield (rendimiento) sobre el USDC depositado usando Blend Protocol.

## Que hace

El vault es el corazon financiero de Hyphe. Toma el USDC que los usuarios depositan como colateral en los mercados y lo pone a trabajar en **Blend Protocol** (el protocolo de lending de Stellar). El yield generado se reparte en tres partes:

```
  USDC depositado
        │
        ▼
  ┌─────────────────────────────────────────┐
  │              HYPHE VAULT                │
  │                                         │
  │   ┌──────────┐      ┌──────────────┐    │
  │   │  Buffer  │      │  Blend Pool  │    │
  │   │   15%    │      │     85%      │    │
  │   │  (listo  │      │  (generando  │    │
  │   │   para   │      │    yield)    │    │
  │   │  retiros)│      │              │    │
  │   └──────────┘      └──────┬───────┘    │
  │                            │            │
  │                       Yield generado    │
  │                            │            │
  │              ┌─────────────┼──────────┐ │
  │              ▼             ▼          ▼ │
  │          70% AMM      20% Users   10%   │
  │         (subsidia     (ganan por  Proto-│
  │         liquidez)     depositar)  col   │
  └─────────────────────────────────────────┘
```

## El concepto: Yield-Subsidized Liquidity

Esta es la innovacion central de Hyphe. En vez de que la liquidez del AMM venga de inversores que asumen riesgo, viene del **yield que genera el propio colateral de los usuarios**:

1. Usuario deposita 1000 USDC para apostar
2. 850 USDC van a Blend Protocol y generan ~5% APY
3. Ese yield (~42 USDC/ano) se usa para:
   - 70% (29.4 USDC) subsidia la liquidez del AMM
   - 20% (8.4 USDC) se devuelve al usuario como recompensa
   - 10% (4.2 USDC) va al protocolo Hyphe

## Operaciones principales

### Deposit
```
  Usuario deposita 10,000 USDC
        │
        ├──► 1,500 USDC quedan en buffer (15%)
        │
        └──► 8,500 USDC van a Blend Pool (85%)
              └──► Recibe bTokens (recibo del deposito)
```

### Withdraw
```
  Usuario retira 5,000 USDC
        │
        ├──► Buffer tiene 1,500? Usa eso primero
        │
        └──► Faltan 3,500? Los retira de Blend Pool
```

### Accrue Yield
```
  Cualquiera puede llamar esta funcion (es un bien publico)
        │
        ├──► Retira TODO de Blend Pool
        ├──► Calcula: recibido - principal = yield
        ├──► Distribuye yield (70/20/10)
        └──► Re-deposita el principal en Blend
```

### Claim Yield
Los usuarios reclaman su parte del 20% de yield, proporcional a cuanto depositaron.

## Funciones

| Funcion | Quien | Que hace |
|---------|-------|----------|
| `deposit` | Usuario | Deposita USDC (split buffer/Blend) |
| `withdraw` | Usuario | Retira USDC (buffer primero, luego Blend) |
| `accrue_yield` | Cualquiera | Calcula y distribuye yield de Blend |
| `claim_yield` | Usuario | Cobra yield pendiente (su parte del 20%) |
| `rebalance` | Admin | Ajusta la proporcion buffer/Blend al target |
| `get_tvl` | Cualquiera | Total USDC depositado |
| `get_blend_position` | Cualquiera | Principal + bTokens en Blend |
| `get_yield_pools` | Cualquiera | Acumulados por categoria (subsidy/user/protocol) |

## Datos tecnicos

- **15 tests**
- Buffer ratio: 15% (1500 BPS), configurable
- Yield distribution: usa el patron "reward-per-token" (como Synthetix StakingRewards)
- Blend Protocol integration via `env.invoke_contract()` con tipos locales
- bTokens trackean la posicion en Blend (como cTokens en Compound)
