import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';  // ← Agrega este import
import { signInWithRedirect } from 'aws-amplify/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],  // ← Agrega FormsModule aquí
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  async onSubmit() {
    console.log('[Login] Iniciando login con redirect a Cognito...');
    
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('[Login] Error en signInWithRedirect:', error);
      alert('Error al iniciar sesión. Por favor intenta nuevamente.');
    }
  }

  async loginConPassword() {
    console.log('[Login] Iniciando login con email/password...');
    
    try {
      const { signIn } = await import('aws-amplify/auth');
      await signIn({
        username: this.email,
        password: this.password,
      });
      console.log('[Login] Login exitoso, redirigiendo al catálogo...');
      this.router.navigate(['/catalogo']);
    } catch (error) {
      console.error('[Login] Error en signIn:', error);
      alert('Credenciales inválidas. Por favor verifica tu email y contraseña.');
    }
  }
}