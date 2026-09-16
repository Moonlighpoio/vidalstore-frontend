import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { fetchAuthSession } from 'aws-amplify/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  title = 'VidalStore';

  protected readonly isEditor = signal(false);
  protected readonly isAdmin = signal(false);

  constructor() {
    void this.loadUserRoles();
  }

  private async loadUserRoles(): Promise<void> {
    try {
      const { tokens } = await fetchAuthSession();
      const groups = (tokens?.accessToken?.payload['cognito:groups'] ?? []) as string[];

      this.isEditor.set(groups.includes('editores'));
      this.isAdmin.set(groups.includes('administradores'));
    } catch {
      this.isEditor.set(true);
      this.isAdmin.set(true);
    }
  }
}