# Hyphe Backend

El backend de Hyphe es el puente entre los smart contracts en Stellar/Soroban y el frontend.
Se encarga de todo lo que NO puede vivir on-chain: consultar APIs deportivas, indexar eventos,
cachear precios, y servir datos al frontend via API REST y WebSocket.

## Que hace el backend?

```
                           football-data.org
                                  |
                          (cada 5 minutos)
                                  |
                                  v
                       +--------------------+
                       |  Oracle Ingester   |--- resultado ---> Oracle Contract
                       +--------------------+                   (on-chain)
                                                                    |
  Stellar Testnet                                                   |
  +------------------------------------------------------------------+
  |  Factory  |  AMM  |  Vault  |  Oracle  |  OutcomeToken  |       |
  +------------------------------------------------------------------+
        |          |        |                                        |
        |    (cada 5s)      |                                        |
        v          v        v                                        |
  +-------------------+  +-------------------+                       |
  |     Indexer       |  |   Yield Cron      |--- accrue_yield() ----+
  | (eventos on-chain)|  |   (cada hora)     |
  +-------------------+  +-------------------+
        |                       |
        v                       v
  +---------------------------------------------+
  |              PostgreSQL                      |
  |  markets | trades | prices | vault | signals |
  +---------------------------------------------+
        |                       |
        v                       v
  +-------------------+  +-------------------+
  |   API REST        |  |   WebSocket       |
  |   /api/markets    |  |   /ws/odds        |
  |   /api/vault      |  |   (tiempo real)   |
  |   /api/infofi     |  |                   |
  +-------------------+  +-------------------+
        |                       |
        +----------+------------+
                   |
                   v
              Frontend (Next.js)
```

En resumen, el backend hace 3 cosas:

1. **Lee datos del mundo real** (resultados deportivos) y los manda a la blockchain
2. **Lee datos de la blockchain** (trades, precios, yield) y los guarda en una base de datos
3. **Sirve esos datos al frontend** de forma rapida via API y WebSocket

---

## Estructura de archivos

```
backend/
├── src/
│   ├── server.ts                 # Punto de entrada — arranca todo
│   │
│   ├── config/
│   │   └── index.ts              # Variables de entorno tipadas
│   │
│   ├── routes/                   # Endpoints de la API
│   │   ├── markets.ts            # /api/markets — mercados y precios
│   │   ├── vault.ts              # /api/vault — TVL, APY, yield
│   │   ├── infofi.ts             # /api/infofi — senales InfoFi
│   │   └── ws.ts                 # /ws/odds — WebSocket tiempo real
│   │
│   ├── services/                 # Procesos que corren en segundo plano
│   │   ├── oracle-ingester.ts    # Consulta APIs deportivas
│   │   ├── indexer.ts            # Escucha eventos de contratos
│   │   ├── price-tracker.ts      # Snapshots de precios cada minuto
│   │   ├── yield-cron.ts         # Llama accrue_yield() cada hora
│   │   ├── infofi-engine.ts      # Calcula senales de segundo orden
│   │   └── market-syncer.ts      # Sincroniza contratos con DB
│   │
│   ├── stellar/                  # Comunicacion con Stellar/Soroban
│   │   ├── client.ts             # Conexion al nodo RPC
│   │   ├── contracts.ts          # Llamadas tipadas a los 7 contratos
│   │   ├── signer.ts             # Firma transacciones (oracle)
│   │   └── events.ts             # Parsea eventos on-chain
│   │
│   ├── db/
│   │   └── client.ts             # Cliente Prisma (PostgreSQL)
│   │
│   ├── cache/
│   │   └── redis.ts              # Cliente Redis con fallback graceful
│   │
│   └── utils/
│       ├── logger.ts             # Logging estructurado (Pino)
│       └── errors.ts             # Tipos de error custom
│
├── prisma/
│   ├── schema.prisma             # Esquema de la base de datos
│   └── migrations/               # Migraciones SQL generadas
│
├── .env                          # Variables de entorno (NO commitear)
├── prisma.config.ts              # Configuracion de Prisma v7
├── tsconfig.json                 # Configuracion TypeScript
└── package.json
```

---

## Servicios de fondo

Cuando el server arranca, inicia 6 servicios automaticos:

| Servicio | Que hace | Cada cuanto |
|---|---|---|
| **Oracle Ingester** | Consulta football-data.org. Si un partido termino y hay un mercado esperando ese resultado, lo envia al contrato oracle on-chain | 5 minutos |
| **Indexer** | Escucha eventos de los contratos (trades, creacion de mercados, resoluciones) y los guarda en PostgreSQL | 5 segundos |
| **Price Tracker** | Lee los precios actuales de cada mercado desde el AMM on-chain y guarda un snapshot en la DB (para graficos historicos) | 1 minuto |
| **Yield Cron** | Llama `accrue_yield()` en el Vault para que calcule cuanto yield genero Blend, y guarda un snapshot de TVL/APY | 1 hora |
| **InfoFi Engine** | Analiza el historial de precios y detecta movimientos significativos (momentum, incertidumbre, cambios bruscos) | 30 minutos |
| **Market Syncer** | Lee el estado de todos los mercados desde el contrato Factory y sincroniza con PostgreSQL | 2 minutos |

```
Arranque del server:
  |
  ├── Registrar plugins (CORS, WebSocket)
  ├── Registrar rutas (markets, vault, infofi, ws, health)
  |
  ├── Iniciar Oracle Ingester     [*/5 * * * *]
  ├── Iniciar Price Tracker       [* * * * *]
  ├── Iniciar Yield Cron          [0 * * * *]
  ├── Iniciar InfoFi Engine       [*/30 * * * *]
  ├── Iniciar Market Syncer       [*/2 * * * *]
  ├── Iniciar Indexer             [polling 5s]
  |
  └── Escuchar en puerto 3001
```

---

## API Endpoints

### Mercados

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/markets` | Lista todos los mercados. Soporta `?status=open&sport=football&sort=volume` |
| GET | `/api/markets/:id` | Detalle de un mercado con precios actuales |
| GET | `/api/markets/:id/history` | Historial de precios (para graficos). Soporta `?from=2026-01-01&to=2026-03-01` |
| GET | `/api/markets/:id/trades` | Ultimos trades del mercado. Soporta `?limit=20` |
| GET | `/api/markets/:id/quote` | Cuanto cuesta comprar N shares. `?outcome=0&shares=1000000` |
| GET | `/api/markets/:id/positions/:address` | Posiciones de un usuario en un mercado (balance de tokens YES/NO) |

### Vault

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/vault/stats` | Estadisticas globales: TVL, APY, yield acumulado, balances Blend/buffer |
| GET | `/api/vault/history` | Historial de snapshots del vault (TVL y yield en el tiempo) |
| GET | `/api/vault/user/:address` | Deposito y yield pendiente de un usuario especifico (lee directo del contrato) |

### InfoFi

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/infofi/signals` | Senales recientes. Soporta `?type=odds_shift&marketId=1&limit=20` |
| GET | `/api/infofi/players` | Top 20 senales de valor de jugadores |
| GET | `/api/infofi/momentum` | Top 10 mercados con mayor momentum |

### WebSocket

| Ruta | Descripcion |
|---|---|
| `ws://localhost:3001/ws/odds?market=1` | Stream de odds en tiempo real para un mercado. Cada vez que hay un trade, recibe `{ yes: 0.65, no: 0.35, timestamp: ... }` |

### Otros

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/health` | Health check. Retorna `{ status: "ok", timestamp: ... }` |

---

## Base de datos

6 tablas en PostgreSQL:

```
┌──────────────────────┐     ┌──────────────────────┐
│       markets        │     │    price_snapshots   │
│──────────────────────│     │──────────────────────│
│ id (PK)              │────>│ market_id (FK)       │
│ question             │     │ yes_price            │
│ num_outcomes         │     │ no_price             │
│ end_time             │     │ timestamp            │
│ status               │     └──────────────────────┘
│ winning_outcome      │
│ total_collateral     │     ┌──────────────────────┐
│ sport_type           │     │       trades         │
│ home_team            │     │──────────────────────│
│ away_team            │────>│ market_id (FK)       │
│ match_date           │     │ user (stellar addr)  │
│ external_match_id    │     │ outcome              │
└──────────────────────┘     │ side (BUY/SELL/...)  │
                             │ shares               │
┌──────────────────────┐     │ cost                 │
│   vault_snapshots    │     │ tx_hash              │
│──────────────────────│     └──────────────────────┘
│ tvl                  │
│ blend_balance        │     ┌──────────────────────┐
│ buffer_balance       │     │  oracle_submissions  │
│ yield_generated      │     │──────────────────────│
│ yield_cumulative     │     │ market_id            │
│ apy_estimate         │     │ outcome              │
│ timestamp            │     │ source               │
└──────────────────────┘     │ raw_data (JSON)      │
                             │ tx_hash              │
┌──────────────────────┐     │ status               │
│   infofi_signals     │     └──────────────────────┘
│──────────────────────│
│ market_id (FK)       │
│ signal_type          │
│ entity               │
│ value                │
│ description          │
│ confidence           │
└──────────────────────┘
```

---

## Flujo de datos: de un partido real a las odds en pantalla

Para entender como funciona todo junto, sigamos el camino de un dato:

```
1. Un partido de futbol termina (ej: Argentina 2 - Francia 1)
   │
   v
2. Oracle Ingester consulta football-data.org, detecta el resultado
   │
   v
3. Crea un registro en oracle_submissions (status: PENDING)
   │
   v
4. Firma una transaccion y llama submit_result() en el contrato Oracle
   │
   v
5. El contrato Oracle registra el resultado on-chain
   │
   v
6. Despues del periodo de disputa, el resultado se finaliza
   │
   v
7. El contrato Market se resuelve con el outcome ganador
   │
   v
8. El Indexer detecta el evento "resolved" on-chain
   │
   v
9. Actualiza el mercado en PostgreSQL (status: RESOLVED, winning_outcome: 0)
   │
   v
10. El frontend muestra el mercado como resuelto y los usuarios reclaman sus ganancias
```

---

## Como correrlo (paso a paso)

### Prerequisitos

- Node.js v20+
- PostgreSQL 16
- Redis 7

### 1. Instalar PostgreSQL y Redis (WSL2)

```bash
sudo apt-get update && sudo apt-get install -y postgresql postgresql-client redis-server
```

### 2. Iniciar los servicios

```bash
sudo service postgresql start
sudo service redis-server start
```

### 3. Crear la base de datos

```bash
sudo -u postgres createuser -s user
sudo -u postgres psql -c "ALTER USER \"user\" PASSWORD 'pass';"
sudo -u postgres createdb -O user hyphe
```

### 4. Instalar dependencias

```bash
cd backend
npm install
```

### 5. Configurar variables de entorno

Copiar `.env` y ajustar los valores si es necesario. Las direcciones de contratos ya
estan configuradas para testnet.

Para que el Oracle Ingester funcione, necesitas:
- `FOOTBALL_DATA_API_KEY` — gratis en [football-data.org](https://www.football-data.org/)
- `ORACLE_SECRET_KEY` — clave secreta de la cuenta oracle autorizada en testnet

### 6. Correr la migracion

```bash
npm run db:migrate
```

Esto crea las 6 tablas en PostgreSQL.

### 7. Arrancar el servidor

```bash
# Desarrollo (con hot reload)
npm run dev

# Produccion
npm run build
npm start
```

### 8. Verificar que funciona

```bash
curl http://localhost:3001/health
# {"status":"ok","timestamp":...}

curl http://localhost:3001/api/markets
# [] (vacio hasta que se creen mercados on-chain)

curl http://localhost:3001/api/vault/stats
# {"tvl":"0","blendBalance":"0",...}
```

---

## Comandos utiles

| Comando | Que hace |
|---|---|
| `npm run dev` | Arranca el server con hot reload (tsx watch) |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Arranca la version compilada |
| `npm run db:migrate` | Crea/aplica migraciones de base de datos |
| `npm run db:generate` | Regenera el cliente Prisma |
| `npm run db:studio` | Abre Prisma Studio (GUI para explorar la DB en el browser) |

---

## Stack tecnico

| Tecnologia | Uso |
|---|---|
| **Fastify** | HTTP server (mas rapido que Express) |
| **Prisma v7** | ORM para PostgreSQL con tipos auto-generados |
| **ioredis** | Cache de precios y pub/sub para WebSocket |
| **@stellar/stellar-sdk v14** | Comunicacion con Soroban RPC (leer contratos, firmar txs) |
| **node-cron** | Tareas programadas (oracle, precios, yield) |
| **Pino** | Logging JSON estructurado |
| **TypeScript** | Tipado estricto en todo el proyecto |
| **tsx** | Ejecutar TypeScript directo sin compilar (desarrollo) |

---

## Notas importantes

- **Redis es opcional.** Si Redis no esta corriendo, el backend funciona igual pero sin cache
  de precios ni WebSocket en tiempo real. Todos los helpers de Redis fallan silenciosamente.

- **El Oracle Ingester necesita API key.** Sin `FOOTBALL_DATA_API_KEY` en `.env`, el ingester
  arranca pero no consulta ningun dato. Los mercados se pueden resolver manualmente via
  el contrato directamente.

- **El Indexer empieza desde el ledger actual.** No intenta replayear todo el historial de
  Stellar. Si necesitas datos historicos, usa el Market Syncer que lee el estado actual de
  los contratos.

- **BigInt en la API.** Los valores monetarios (collateral, shares, cost, TVL) se retornan
  como strings porque JSON no soporta BigInt. El frontend debe parsearlos con `BigInt()`.

- **USDC tiene 7 decimales en Stellar.** Un valor de `10000000` = 1.0 USDC. Los precios
  del AMM tambien usan esta escala (1e7 = 100%).

- **No commitear `.env`.** Contiene claves secretas. Ya esta en `.gitignore`.
