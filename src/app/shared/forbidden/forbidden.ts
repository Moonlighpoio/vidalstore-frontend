import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="max-width: 480px; margin: 4rem auto; text-align: center; font-family: sans-serif;">
      <h1 style="color: #c81e1e; font-size: 3rem; margin-bottom: 0.5rem;">403</h1>
      <h2>Acceso Denegado</h2>
      <p style="color: #555; margin-bottom: 1.5rem;">
        No tienes los permisos o grupos suficientes para acceder a este recurso.
      </p>
      <a routerLink="/catalogo" style="display: inline-block; padding: 0.6rem 1.2rem; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Volver al Catálogo
      </a>
    </div>
  `
})
export class ForbiddenComponent {}