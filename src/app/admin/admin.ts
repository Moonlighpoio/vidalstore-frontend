import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
})
export class Admin {
  private readonly adminService = inject(AdminService);

  protected readonly licenses = signal<any[]>([]);
  protected readonly audit = signal<any[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.adminService.getLicenses().subscribe({
      next: (licenses) => {
        this.licenses.set(licenses);
        this.loading.set(false);
      },
      error: () => {
        this.licenses.set([]);
        this.loading.set(false);
        this.errorMessage.set('No fue posible cargar las licencias.');
      },
    });

    this.adminService.getAudit().subscribe({
      next: (audit) => {
        this.audit.set(audit);
      },
      error: () => {
        this.audit.set([]);
      },
    });
  }

  revoke(license: any): void {
    if (license.revoked) return;

    this.adminService.revokeLicense(license.id).subscribe({
      next: () => {
        alert(
          `Licencia revocada correctamente.\nJuego: ${license.gameId || 'N/D'}\nUsuario: ${license.userId || 'N/D'}`,
        );
        this.loadData();
      },
      error: (err: any) => {
        alert('Error al revocar la licencia: ' + (err?.error?.message || err?.message || 'Error desconocido'));
      },
    });
  }
}