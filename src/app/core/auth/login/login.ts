import { Component, OnInit } from '@angular/core';
import { signInWithRedirect } from 'aws-amplify/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('[Login] No fue posible redirigir a Cognito:', error);

      this.errorMessage =
        'No fue posible abrir el inicio de sesión de Cognito. Revisa la configuración del dominio, App Client y callback URL.';
    }
  }
}