# VidalStore — Frontend

Aplicación web de la plataforma **VidalStore** construida con **Angular**. Es la cara visible del proyecto: autentica al usuario contra **AWS Cognito** (Hosted UI con Authorization Code + PKCE), protege las rutas privadas, adjunta el access token únicamente hacia el **API Gateway** y consume los módulos de catálogo, compras, biblioteca y administración.

VidalStore vende **licencias de uso de videojuegos digitales** (los botones dicen "Comprar", pero el backend crea una licencia asociada al usuario autenticado).

## Arquitectura

```text
Navegador (Angular)  :4200
      │  Authorization: Bearer <access token>
      ▼
API Gateway (NestJS) :8080
      │
      ▼
BFF y microservicios backend (catálogo, biblioteca, licencias, auditoría)
```

El navegador solo conoce la URL del API Gateway. No llama directamente al BFF ni a los microservicios.

## Funcionalidad

- **Autenticación** con AWS Cognito: registro con confirmación por correo, inicio de sesión vía Hosted UI (Authorization Code + PKCE) y cierre de sesión robusto.
- **Rutas protegidas**: `/catalogo`, `/biblioteca` y `/admin` (esta última solo para `administradores`).
- **Interceptor de autenticación**: agrega `Authorization: Bearer <access token>` solo a las peticiones al API Gateway y maneja `401`/`403`.
- **Catálogo**: exploración y búsqueda de juegos disponibles.
- **Biblioteca**: listado de las licencias activas del usuario (se actualiza tras una compra).
- **Admin**: publicar/editar juegos, listar y revocar licencias y consultar auditoría.
- **Rutas de error**: redirección a `/forbidden` ante `403` y al login ante `401`.

## Tecnologías

- Angular (componentes standalone) + TypeScript.
- AWS Amplify + Amazon Cognito (Hosted UI, OAuth con PKCE).
- RxJS.
- Pruebas con el builder de Angular (Vitest) — `ng test`.
- Tailwind (configuración PostCSS).

## Requisitos

- Node.js compatible con la versión declarada por el proyecto y npm.
- Un user pool de Cognito configurado (dominio, app client, scopes y callbacks).
- El API Gateway corriendo en `http://localhost:8080`.

## Instalación

```bash
git clone https://github.com/wsk4/vidalstore-frontend.git
cd vidalstore-frontend
npm install
```

No subas `.env` con valores reales ni credenciales de AWS.

## Configuración

Crea un `.env` local a partir del ejemplo del proyecto:

```env
API_URL=http://localhost:8080

REGION=us-east-1
USER_POOL_ID=your-user-pool-id
USER_POOL_CLIENT_ID=your-app-client-id
COGNITO_DOMAIN=https://tu-dominio.auth.us-east-1.amazoncognito.com

ISSUER=https://cognito-idp.us-east-1.amazonaws.com/your-user-pool-id
JWKS_URI=https://cognito-idp.us-east-1.amazonaws.com/your-user-pool-id/.well-known/jwks.json

RESOURCE_SERVER_ID=vidalstore
SCOPE_CATALOGO_LEER=vidalstore/catalogo.leer
SCOPE_CATALOGO_ESCRIBIR=vidalstore/catalogo.escribir
SCOPE_BIBLIOTECA_LEER=vidalstore/biblioteca.leer

REDIRECT_SIGN_IN=http://localhost:4200/callback
REDIRECT_SIGN_OUT=http://localhost:4200
```

Genera la configuración de entorno que usa Angular:

```bash
npm run generate:environment
```

El script valida que existan todas las variables requeridas y escribe `src/environments/environment.development.ts`. Callbacks de Cognito:

```text
http://localhost:4200/callback
http://localhost:4200
```

## Ejecución

```bash
npm run generate:environment
npm start
```

La aplicación queda disponible en `http://localhost:4200`, con el backend en `http://localhost:8080`.

## Autenticación

### Flujo

```text
Usuario → Angular → Cognito Hosted UI → Authorization Code + PKCE
       → callback → tokens de Cognito → API Gateway
```

- `login` redirige con `signInWithRedirect` a la Hosted UI de Cognito.
- `register` usa `signUp` + `confirmSignUp` (código de confirmación por correo).
- `logout` cierra la sesión SSO y limpia los tokens de Amplify de `sessionStorage` y `localStorage`.

### Almacenamiento de tokens

Los tokens se guardan en `sessionStorage` mediante un adaptador compatible con Amplify. Esto limita la persistencia al ciclo de vida de la pestaña.

Para verificarlo: `DevTools → Application → Session Storage` y confirmar que no hay tokens de autenticación en `Local Storage`.

### Interceptor

`authInterceptor`:

- Solo adjunta `Authorization: Bearer <accessToken>` cuando la petición apunta a `environment.apiUrl` (el API Gateway).
- Obtiene la sesión desde Amplify y agrega el token.
- Nunca envía el token a APIs externas, assets ni URLs arbitrarias.
- Ante `401`: limpia la sesión y redirige al login.
- Ante `403`: redirige a `/forbidden`.
- Propaga el error para que servicios y componentes puedan reaccionar.

### Guards

| Ruta | Guard | Requisito |
|---|---|---|
| `/catalogo` | `authGuard` | Sesión válida |
| `/biblioteca` | `authGuard` | Sesión válida |
| `/admin` | `authGuard` + `roleGuard` | Grupo `administradores` |

Los guards controlan navegación y UX; la autorización real siempre vive en el backend.

### Grupos de Cognito

Se leen desde el claim `cognito:groups` del token:

- `jugadores` — navegan catálogo y biblioteca, compran.
- `editores` — publican y editan juegos.
- `administradores` — gestionan catálogo, licencias y auditoría.

Ocultar una vista o botón no reemplaza la autorización del servidor.

## Endpoints consumidos

Todos a través de `environment.apiUrl`:

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/v1/catalogo` | Obtener el catálogo autenticado. |
| `POST` | `/v1/compras` | Crear una licencia para el usuario autenticado (body: `{"gameId": "..."}`). |
| `GET` | `/v1/biblioteca` | Obtener la biblioteca del usuario autenticado (la resuelve el `sub` del token). |
| `GET` | `/v1/licencias` | Listar licencias (admin). |
| `DELETE` | `/v1/licencias/:id` | Revocar una licencia (admin). |
| `GET` | `/v1/auditoria` | Consultar auditoría (admin). |

## Estructura principal

```text
src/
├── app/
│   ├── admin/                    # panel admin (juegos, licencias, auditoría)
│   ├── catalog/                  # catálogo y búsqueda
│   ├── core/
│   │   ├── auth/                 # Amplify, AuthService, login, registrarse, callback
│   │   ├── guards/               # authGuard, roleGuard
│   │   └── interceptors/         # authInterceptor
│   ├── library/                  # biblioteca del usuario
│   ├── models/                   # Game, Purchase, ...
│   ├── services/                 # catalog, library, purchase, admin, refresh
│   ├── shared/                   # catalogo-demo, forbidden
│   ├── app.routes.ts
│   ├── app.ts
├── environments/                 # environment.development.ts (generado)
├── main.ts
└── styles.css

scripts/generate-environment.mjs  # genera el environment desde .env
```

## Pruebas

```bash
npm test
```

Las pruebas cubren catálogo y búsqueda, biblioteca, compras, interceptor de autenticación, redirección ante `401`/`403`, restricción del header `Authorization` al API Gateway y rutas de la aplicación. `ng test` corre en modo watch; presiona `q` para salir.

Antes de abrir un Pull Request:

```bash
git diff --check
npm run generate:environment
npm run build
npm test
```

## Seguridad

- No se versionan `.env` con valores reales ni credenciales de AWS.
- Los tokens se guardan en `sessionStorage`, no en `localStorage`.
- El interceptor no envía tokens a APIs externas.
- La autorización definitiva pertenece al backend (BFF y microservicios).
- El frontend no llama directo a microservicios: siempre a través del Gateway.

Revisa posibles filtraciones antes de entregar:

```bash
git grep -iE 'password|secret|token|cookie'
```

Las coincidencias pueden corresponder a formularios, documentación o tests; verifica manualmente que no haya valores reales.

## Scripts

```bash
npm install
npm run generate:environment   # genera src/environments/environment.development.ts
npm start                      # genera entorno y sirve con ng serve
npm run build                  # genera entorno y compila
npm test                       # pruebas (watch)
```

## Flujo de ramas

```text
main ← dev ← feature/<nombre-descriptivo>
```

Crea las ramas desde `dev` y abre el Pull Request con base `dev`.

## Licencia

Proyecto académico DUOC UC — DSY1107 Desarrollo Cloud Native I.