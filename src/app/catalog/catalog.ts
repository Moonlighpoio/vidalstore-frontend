import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../services/catalog.service';
import { PurchaseService } from '../services/purchase.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.html',
})
export class Catalog implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly purchaseService = inject(PurchaseService);
  private readonly cdr = inject(ChangeDetectorRef);

  games: any[] = [];
  loading = true;
  errorMessage = '';
  purchasingGameId: string | null = null;

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.loading = true;
    this.errorMessage = '';

    this.catalogService.getCatalog().subscribe({
      next: (data: any) => {
        const rawGames = Array.isArray(data) ? data : data?.data || [];
        const preciosLista = [19.99, 29.99, 39.99, 49.99, 59.99];

        // Mapeo con precios comerciales deterministas
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

    // Se envía { gameId } como espera el microservicio
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
}