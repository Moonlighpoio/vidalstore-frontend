# VidalStore Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.8 and implements client-side authentication and authorization integrated with Amazon Cognito via AWS Amplify v6.

---

## 1. Módulo de Autenticación y Seguridad

### Flujo OAuth con PKCE
* **Implementación:** Se utiliza el flujo **Authorization Code Grant con PKCE** (`responseType: 'code'`).
* **Seguridad:** Diseñado para aplicaciones de página única (SPA/clientes públicos), evitando exponer tokens directamente en la URL (como ocurría en el flujo implícito) y mitigando ataques de interceptación mediante el intercambio de un verificador criptográfico (`code_verifier` y `code_challenge`).

### Almacenamiento en `sessionStorage`
* **Implementación:** Se configuró un adaptador asíncrono con `KeyValueStorageInterface` inyectado a través de `cognitoUserPoolsTokenProvider.setKeyValueStorage(...)` inmediatamente después de `Amplify.configure()`.
* **Aislamiento:** Los tokens de acceso, identidad y refresco se guardan en la sesión de la pestaña activa, desapareciendo al cerrarla o al reiniciar el navegador (a diferencia de `localStorage`).
* **Consideración de Seguridad:** El uso de `sessionStorage` reduce la persistencia de datos en discos de equipos compartidos, pero **no mitiga ataques XSS (Cross-Site Scripting)** en ejecución: cualquier script arbitrario inyectado en el DOM tiene acceso al objeto global de almacenamiento.

### Interceptor HTTP con Lista Blanca (Whitelist)
* **Implementación:** El interceptor funcional `authInterceptor` inspecciona cada petición HTTP saliente e inyecta el encabezado `Authorization: Bearer <accessToken>` únicamente si la URL destino coincide estrictamente con la URL base del Gateway (`environment.apiUrl`).
* **Protección:** Evita la filtración involuntaria de credenciales hacia APIs de terceros, fuentes externas o CDNs. Si el backend responde con un error `401 Unauthorized` por sesión caducada, limpia el almacenamiento y redirige a la vista de login.

### Guards y Autorización
* **`authGuard`:** Comprueba si existe una sesión activa y válida; si no, redirige al `/login` conservando el parámetro de retorno.
* **`roleGuard`:** Inspecciona el claim `cognito:groups` del payload del token para validar si el usuario pertenece a los grupos autorizados (`jugadores`, `editores`, `administradores`).
* **Principio de Seguridad:** Los guards en Angular operan como una capa de navegación y experiencia de usuario (UX). **La autorización estricta recae en el backend / API Gateway / BFF**, el cual valida criptográficamente la firma y los claims del token en cada solicitud.

---

## 2. Checklist de Evidencias para la Defensa

Lista de verificación técnica para comprobar durante la evaluación y defensa:

- [ ] Registro de usuario
- [ ] Confirmación de usuario
- [ ] Login exitoso
- [ ] Logout
- [ ] Token en sessionStorage
- [ ] Sin token en localStorage
- [ ] Authorization enviado al gateway
- [ ] Token no enviado a API externa
- [ ] Usuario no autenticado bloqueado por guard
- [ ] Usuario con rol insuficiente bloqueado
- [ ] README actualizado

---

## 3. Development server

To start a local development server, run:

```bash
ng serve