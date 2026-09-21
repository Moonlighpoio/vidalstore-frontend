import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  title = 'VidalStore';

  private readonly authService = inject(AuthService);

  protected readonly isEditor = signal(false);
  protected readonly isAdmin = signal(false);
  protected readonly isAuthenticated = signal(false);

  constructor() {
    void this.loadUserRoles();
  }

  private async loadUserRoles(): Promise<void> {
    try {
      const authenticated = await this.authService.isAuthenticated();
      this.isAuthenticated.set(authenticated);

      const groups = await this.authService.getUserGroups();
      this.isEditor.set(groups.includes('editores'));
      this.isAdmin.set(groups.includes('administradores'));
    } catch {
      this.isAuthenticated.set(false);
      this.isEditor.set(false);
      this.isAdmin.set(false);
    }
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
  }
}