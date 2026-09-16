# VidalStore Frontend

Aplicación frontend de VidalStore construida con Angular. La aplicación implementa autenticación con AWS Cognito mediante AWS Amplify, protege las rutas privadas, agrega el token de acceso únicamente a las peticiones del API Gateway y consume los endpoints de catálogo, compras y biblioteca.

> VidalStore vende licencias de uso de videojuegos. El botón visible para el usuario puede decir “Comprar”, pero técnicamente el backend crea una licencia asociada al usuario autenticado.

## Arquitectura

El frontend participa en el siguiente flujo:

```text
Navegador Angular
      |
      | Authorization: Bearer <access token>
      v
API Gateway - http://localhost:8080
      |
      v
BFF y microservicios backend
```

El navegador conoce solamente la URL del API Gateway. No llama directamente al BFF ni a los microservicios.

## Tecnologías

- Angular.
- TypeScript.
- AWS Amplify.
- Amazon Cognito.
- RxJS.
- Vitest mediante el builder de pruebas de Angular.

## Requisitos

- Node.js compatible con la versión declarada por el proyecto.
- npm.
- Angular CLI disponible mediante los scripts del proyecto.
- Un User Pool de Amazon Cognito configurado para la aplicación.
- El repositorio backend ejecutándose en `http://localhost:8080`.

## Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/wsk4/vidalstore-frontend.git
cd vidalstore-frontend
npm install
```

No subas archivos `.env` con valores reales ni credenciales de AWS.

## Configuración

La aplicación obtiene su configuración de Cognito y del API Gateway desde variables de entorno. El script del proyecto genera la configuración que usa Angular.

Crea un archivo `.env` local a partir del ejemplo disponible en el proyecto, sin agregarlo a Git:

```env
API_URL=http://localhost:8080
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_USER_POOL_CLIENT_ID=your-public-app-client-id
COGNITO_DOMAIN=your-cognito-domain
```

Los nombres exactos de las variables deben coincidir con el script de generación de entorno y con la configuración existente del proyecto. Nunca incluyas contraseñas, client secrets, credenciales de AWS ni tokens reales.

Genera la configuración:

```bash
npm run generate:environment
```

La URL base del frontend debe ser la única URL del API Gateway:

```text
http://localhost:8080
```

Los callbacks locales de Cognito utilizan la aplicación Angular:

```text
http://localhost:4200/callback
http://localhost:4200
```

## Autenticación

La aplicación usa Amazon Cognito y AWS Amplify con Authorization Code Flow con PKCE.

El flujo general es:

```text
Usuario
  -> Angular
  -> Cognito Hosted UI
  -> Authorization Code + PKCE
  -> Angular callback
  -> Tokens de Cognito
  -> API Gateway
```

### Almacenamiento del token

Los tokens se almacenan explícitamente en `sessionStorage` mediante un adaptador compatible con Amplify.

Esto reduce la persistencia del token al ciclo de vida de la pestaña. No elimina el riesgo de un script malicioso que se ejecute dentro del mismo origen; por eso no deben incorporarse scripts de terceros sin revisión.

Para comprobarlo en el navegador:

1. Inicia sesión.
2. Abre DevTools.
3. Ve a `Application`.
4. Revisa `Session Storage`.
5. Confirma que no existan tokens de autenticación en `Local Storage`.

### Interceptor

`authInterceptor` realiza estas tareas:

- Comprueba si la petición apunta a `environment.apiUrl`.
- Obtiene la sesión de Amplify.
- Agrega `Authorization: Bearer <accessToken>` únicamente al API Gateway.
- No envía tokens a APIs externas, assets ni URLs arbitrarias.
- Limpia la sesión y redirige al login ante un `401`.
- Redirige a `/forbidden` ante un `403`.
- Propaga el error para que los servicios y componentes puedan manejarlo.

### Guards

Las rutas privadas están protegidas por `authGuard`:

- `/catalogo`.
- `/biblioteca`.
- `/admin`.

La ruta `/admin` utiliza además `roleGuard` y requiere el grupo Cognito `administradores`.

Los guards frontend controlan navegación y experiencia de usuario. La autorización real debe permanecer en el backend, BFF y microservicios.

### Grupos Cognito

Los grupos se leen desde el claim `cognito:groups` del token para controlar la interfaz:

- `jugadores`.
- `editores`.
- `administradores`.

Ocultar una vista o botón no reemplaza la autorización del servidor.

## Endpoints consumidos

Todos los endpoints se consumen a través de `environment.apiUrl`.

| Método | Ruta | Uso |
|---|---|---|
| GET | `/v1/catalogo` | Obtener el catálogo autenticado |
| POST | `/v1/compras` | Crear una licencia para el usuario autenticado |
| GET | `/v1/compras` | Consultar compras |
| GET | `/v1/biblioteca` | Obtener la biblioteca del usuario autenticado |

La biblioteca no recibe un `userId` desde el frontend. El backend debe resolver al usuario usando el claim `sub` del token.

## Estructura principal

```text
src/
├── app/
│   ├── catalog/
│   ├── library/
│   ├── admin/
│   ├── core/
│   │   ├── auth/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── models/
│   └── services/
├── environments/
├── main.ts
└── styles.css
```

## Ejecución local

Genera el entorno y levanta Angular:

```bash
npm run generate:environment
npm start
```

La aplicación estará disponible normalmente en:

```text
http://localhost:4200
```

El backend debe estar disponible en:

```text
http://localhost:8080
```

## Scripts

```bash
npm install
npm run generate:environment
npm start
npm run build
npm test
```

`npm test` inicia las pruebas en modo watch. Presiona `q` para salir.

## Pruebas

Las pruebas cubren:

- Catálogo y búsqueda de juegos.
- Biblioteca del usuario.
- Creación y consulta de compras.
- Interceptor de autenticación.
- Redirección ante `401`.
- Redirección ante `403`.
- Restricción del header `Authorization` al API Gateway.
- Rutas y aplicación principal.

Ejecuta:

```bash
npm test
```

Antes de abrir un Pull Request ejecuta:

```bash
git diff --check
npm run generate:environment
npm run build
npm test
```

## Seguridad

- No se versionan `.env` con valores reales.
- No se versionan credenciales de AWS.
- No se versionan contraseñas de usuarios.
- No se guardan tokens en el código fuente.
- Los tokens se guardan en `sessionStorage`.
- El interceptor no envía tokens a APIs externas.
- La autorización definitiva pertenece al backend.
- El frontend no debe llamar directamente a microservicios.

Revisa el repositorio antes de entregarlo:

```bash
git grep -iE 'password|secret|token|cookie'
```

Las coincidencias esperadas pueden corresponder a nombres de formularios, documentación, tests o APIs; revisa manualmente que no contengan valores reales.

## Flujo de ramas

Usa el siguiente flujo:

```text
main <- dev <- feature/<nombre-descriptivo>
```

Crea las ramas desde `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/nombre-descriptivo
```

Usa commits descriptivos, por ejemplo:

```text
feat(api-client): integrate catalog endpoint through API Gateway
feat(auth): handle unauthorized API responses
docs(security): update frontend authentication checklist
```

No trabajes directamente sobre `main` ni `dev`.

## Evidencia para la defensa

La demo frontend debe mostrar:

1. Registro e inicio de sesión con Cognito.
2. Flujo Authorization Code con PKCE en el navegador.
3. Token almacenado en `sessionStorage`.
4. Acceso permitido a `/catalogo` y `/biblioteca` con sesión válida.
5. Redirección al login al intentar acceder sin sesión.
6. Acceso administrativo restringido por grupo.
7. Header `Authorization` enviado solamente al Gateway.
8. Catálogo, compra y biblioteca funcionando.
9. Actualización de biblioteca después de una compra.
10. Diferencia entre `401` y `403`.

La validación criptográfica del JWT, la autorización del BFF, las rutas administrativas, CORS, los microservicios, los seeds y las pruebas directas del backend deben documentarse y demostrarse en el repositorio backend.

## Licencia

Proyecto académico para la asignatura DSY1107 Desarrollo Cloud Native I.
