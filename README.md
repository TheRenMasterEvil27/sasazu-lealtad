# Sasazu – Tarjetas de Lealtad

Sistema de tarjetas de lealtad digitales para **Sasazu Burger & Beer**: registro de clientes, historial de consumos y sellos acumulados hacia una hamburguesa gratis.

Proyecto de residencia profesional.

## Estructura

| Carpeta | Qué es | Tecnología |
|---|---|---|
| `tarjetas-lealtad-api/` | API REST y base de datos | Node.js, Express 5, MySQL |
| `tarjetas-lealtad-web/` | Aplicación web (PWA instalable) | React 19, Vite, Bootstrap 5 |

## Requisitos

- Node.js 20 o superior
- MySQL 8 (o MariaDB equivalente)

## Puesta en marcha

### 1. Base de datos

Desde la carpeta `tarjetas-lealtad-api`, ejecuta en MySQL:

```sql
SOURCE db/schema.sql;
SOURCE db/seed.sql;   -- datos de ejemplo (opcional)
```

### 2. API

```bash
cd tarjetas-lealtad-api
cp .env.example .env      # en Windows: copy .env.example .env
# edita .env y pon tu contraseña de MySQL
npm install
npm run dev
```

La API queda en `http://localhost:3000`. Para comprobarla: `http://localhost:3000/api/salud`.

Variables de `.env`: `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, y las reglas de la tarjeta `META_PREMIO` (monto por sello) y `SELLOS_META` (sellos para el premio).

### 3. Web

En otra terminal:

```bash
cd tarjetas-lealtad-web
npm install
npm run dev
```

Por defecto la web usa `http://localhost:3000/api`. Para apuntar a otra API, crea `tarjetas-lealtad-web/.env` con:

```
VITE_API_URL=https://tu-servidor/api
```

Para generar la versión de producción: `npm run build` (queda en `dist/`).

## Endpoints principales

- `GET /api/clientes` – lista de clientes
- `POST /api/clientes` – crear cliente
- `GET /api/clientes/:id` – detalle con historial
- `PUT /api/clientes/:id` – editar cliente
- `POST /api/clientes/:id/consumos` – registrar consumo
- `PUT` / `DELETE /api/clientes/:id/consumos/:consumoId` – corregir o eliminar un consumo

## Notas

- El inicio de sesión de la web aún no valida credenciales; está pendiente de implementarse con el backend.
- `npm audit` reporta 4 advertencias moderadas en herramientas de compilación (`vite-plugin-pwa` → `workbox-build` → `glob`/`minimatch`). No afectan al código que corre en producción.
