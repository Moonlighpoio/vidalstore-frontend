import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div style="text-align: center;">
        <h2>Procesando inicio de sesión...</h2>
        <p>Redirigiendo a Cognito</p>
      </div>
    </div>
  `,
})
export class CallbackComponent implements OnInit {
  constructor(private router: Router) {}

  async ngOnInit() {
    try {
      console.log('[Callback] Iniciando verificación de sesión...');
      
      // Verifica si hay tokens después del redirect
      const session = await fetchAuthSession();
      
      if (session.tokens) {
        console.log('[Callback] Tokens encontrados, redirigiendo al catálogo...');
        // Login exitoso, redirige al home
        this.router.navigate(['/catalogo']);
      } else {
        console.log('[Callback] No hay tokens, iniciando signInWithRedirect...');
        // No hay tokens, intenta iniciar el flujo OAuth
        await signInWithRedirect();
      }
    } catch (error) {
      console.error('[Callback] Error en callback:', error);
      this.router.navigate(['/login']);
    }
  }
}