import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  confirmForm: FormGroup;
  isConfirmationStep = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });

    this.confirmForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z]+$/)]]
    });
  }

  async onSubmitRegister(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.loading = true;
    const { email, password } = this.registerForm.value;

    try {
      const { nextStep } = await this.authService.register(email, password);

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        this.isConfirmationStep = true;
        this.successMessage = 'Código de confirmación enviado a tu correo.';
      } else {
        this.router.navigate(['/login']);
      }
    } catch (err: any) {
      this.handleCognitoError(err);
    } finally {
      this.loading = false;
    }
  }

  async onSubmitConfirm(): Promise<void> {
    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.loading = true;
    const email = this.registerForm.get('email')?.value;
    const code = this.confirmForm.get('code')?.value;

    try {
      await this.authService.confirmRegistrationCode(email, code);
      this.successMessage = 'Cuenta verificada con éxito. Redirigiendo al login...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1800);
    } catch (err: any) {
      this.handleCognitoError(err);
    } finally {
      this.loading = false;
    }
  }

  private handleCognitoError(err: any): void {
    switch (err.name) {
      case 'UsernameExistsException':
        this.errorMessage = 'El correo ya se encuentra registrado.';
        break;
      case 'InvalidPasswordException':
        this.errorMessage = 'La contraseña no cumple las políticas requeridas (mínimo 8 caracteres, números y caracteres especiales).';
        break;
      case 'CodeMismatchException':
        this.errorMessage = 'El código de confirmación ingresado es incorrecto.';
        break;
      case 'ExpiredCodeException':
        this.errorMessage = 'El código de confirmación ha expirado. Solicita uno nuevo.';
        break;
      case 'InvalidParameterException':
        this.errorMessage = 'Parámetros inválidos. Revisa el formato de los datos.';
        break;
      default:
        this.errorMessage = err.message || 'Ocurrió un error inesperado durante el proceso.';
        break;
    }
  }
}