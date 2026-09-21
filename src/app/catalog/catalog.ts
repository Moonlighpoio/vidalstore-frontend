import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../services/catalog.service';
import { PurchaseService } from '../services/purchase.service';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.html',
})
export class Catalog implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly purchaseService = inject(PurchaseService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  games: any[] = [];
  loading = true;
  errorMessage = '';
  purchasingGameId: string | null = null;

  isEditor = false;

  formOpen = false;
  editingGameId: string | null = null;
  formNombre = '';
  formDescripcion = '';
  formImagen = '';
  saving = false;
  formError = '';

  ngOnInit(): void {
    this.cargarCatalogo();
    void this.cargarRol();
  }

  private async cargarRol(): Promise<void> {
    const groups = await this.authService.getUserGroups();
    this.isEditor =
      groups.includes('editores') || groups.includes('administradores');
    this.cdr.detectChanges();
  }

  cargarCatalogo(): void {
    this.loading = true;
    this.errorMessage = '';

    this.catalogService.getCatalog().subscribe({
      next: (data: any) => {
        const rawGames = Array.isArray(data) ? data : data?.data || [];
        const preciosLista = [19.99, 29.99, 39.99, 49.99, 59.99];

        this.games = rawGames.map((g: any, index: number) => {
          const precioCalculado = preciosLista[index % preciosLista.length];

          return {
            id: g.id,
            title: g.nombre || g.title || g.titulo || 'Juego VidalStore',
            description: g.descripcion || g.description || 'Sin descripción disponible.',
            imageUrl: g.imagen || g.imageUrl || g.portadaUrl || g.thumbnail || 'https://placehold.co/300x200?text=VidalStore',
            price: (g.price && g.price > 0) ? g.price : ((g.precio && g.precio > 0) ? g.precio : precioCalculado),
            category: g.category || g.genero || 'Licencia Digital',
          };
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error cargando catálogo:', err);
        this.errorMessage = 'No fue posible cargar el catálogo.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  comprar(game: any): void {
    if (this.purchasingGameId) return;

    this.purchasingGameId = game.id;
    const service = this.purchaseService as any;

    const req$ = service.purchaseGame
      ? service.purchaseGame(game.id)
      : service.createPurchase(game.id, game.title, game.price);

    req$.subscribe({
      next: (res: any) => {
        this.purchasingGameId = null;
        alert(`¡Licencia adquirida con éxito!\nJuego: ${game.title}\nID Licencia: ${res?.id || 'Generada'}`);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.purchasingGameId = null;
        const errorMsg = err?.error?.message || err?.message || 'Error desconocido';
        alert('Error al procesar la compra: ' + errorMsg);
        this.cdr.detectChanges();
      },
    });
  }

  openCreate(): void {
    this.editingGameId = null;
    this.formNombre = '';
    this.formDescripcion = '';
    this.formImagen = '';
    this.formError = '';
    this.formOpen = true;
    this.cdr.detectChanges();
  }

  openEdit(game: any): void {
    this.editingGameId = game.id;
    this.formNombre = game.title || '';
    this.formDescripcion = game.description === 'Sin descripción disponible.' ? '' : (game.description || '');
    this.formImagen = game.imageUrl?.startsWith('https://placehold.co') ? '' : (game.imageUrl || '');
    this.formError = '';
    this.formOpen = true;
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.formOpen = false;
    this.editingGameId = null;
    this.cdr.detectChanges();
  }

  guardarJuego(): void {
    if (this.saving) return;

    if (!this.formNombre.trim()) {
      this.formError = 'El nombre del juego es obligatorio.';
      this.cdr.detectChanges();
      return;
    }

    this.saving = true;
    this.formError = '';

    const payload = {
      nombre: this.formNombre.trim(),
      descripcion: this.formDescripcion.trim(),
      imagen: this.formImagen.trim() || null,
    };

    const isEditing = this.editingGameId !== null;
    const request$ = isEditing
      ? this.catalogService.updateGame(this.editingGameId as string, payload)
      : this.catalogService.createGame(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.formOpen = false;
        this.editingGameId = null;
        alert(isEditing ? 'Juego actualizado correctamente.' : 'Juego publicado correctamente.');
        this.cargarCatalogo();
      },
      error: (err: any) => {
        this.saving = false;
        this.formError = err?.error?.message || 'No fue posible guardar el juego.';
        this.cdr.detectChanges();
      },
    });
  }
}