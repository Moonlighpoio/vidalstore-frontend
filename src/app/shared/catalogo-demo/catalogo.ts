import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-catalogo-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; font-family: sans-serif;">
      <h2>Catálogo de Juegos</h2>
      <p>Bienvenido: <strong>{{ userEmail }}</strong></p>
      <button (click)="onLogout()" style="padding: 0.5rem 1rem; background: #c81e1e; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Cerrar Sesión
      </button>
    </div>
  `
})
export class CatalogoDemoComponent implements OnInit {
  userEmail: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const session = await this.authService.getSession();
    this.userEmail = (session.tokens?.idToken?.payload['email'] as string) || 'Usuario Autenticado';
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}