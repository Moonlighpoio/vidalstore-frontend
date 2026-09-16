import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async ngOnInit(): Promise<void> {
    // Evita que un usuario con sesión activa vuelva a ver el login
    const authenticated = await this.authService.isAuthenticated();
    if (authenticated) {
      this.router.navigate(['/catalogo']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.loading = true;
    const { email, password } = this.loginForm.value;

    try {
      const response = await this.authService.login(email, password);

      if (response.isSignedIn) {
        // Verificar que fetchAuthSession() obtenga una sesión válida
        const session = await this.authService.getSession();
        console.log('Sesión activa verificada:', !!session.tokens);
        this.router.navigate(['/catalogo']);
      } else {
        this.errorMessage = 'Se requiere un paso adicional para completar el inicio de sesión.';
      }
    } catch (err: any) {
      this.handleCognitoError(err);
    } finally {
      this.loading = false;
    }
  }

  private handleCognitoError(err: any): void {
    switch (err.name) {
      case 'NotAuthorizedException':
        this.errorMessage = 'Correo o contraseña incorrectos.';
        break;
      case 'UserNotFoundException':
        this.errorMessage = 'No existe una cuenta registrada con este correo.';
        break;
      case 'UserNotConfirmedException':
        this.errorMessage = 'Tu cuenta aún no ha sido confirmada. Revisa tu correo.';
        break;
      default:
        this.errorMessage = err.message || 'Error al iniciar sesión.';
        break;
    }
  }
}