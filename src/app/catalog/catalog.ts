import { Component, inject, signal } from '@angular/core';

import { Game } from '../models/game.model';
import { CatalogService } from '../services/catalog.service';
import { PurchaseService } from '../services/purchase.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.html',
})
export class Catalog {
  private readonly catalogService = inject(CatalogService);
  private readonly purchaseService = inject(PurchaseService);

  protected readonly games = signal<Game[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly purchasingGameId = signal<string | null>(null);
  protected readonly purchaseError = signal('');

  constructor() {
    this.loadCatalog();
  }

  private loadCatalog(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.catalogService.getCatalog().subscribe({
      next: (data) => {
        this.games.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.games.set([]);
        this.loading.set(false);
        this.errorMessage.set('No fue posible cargar el catálogo.');
      },
    });
  }

  onBuy(game: Game): void {
    if (this.purchasingGameId()) {
      return;
    }

    this.purchasingGameId.set(game.id);
    this.purchaseError.set('');

    this.purchaseService.createPurchase(game.id, game.title, game.price).subscribe({
      next: (order) => {
        this.purchasingGameId.set(null);
        alert(`Order Completed!\nGame: ${order.gameTitle}\nLicense: ${order.licenseKey}`);
      },
      error: () => {
        this.purchasingGameId.set(null);
        this.purchaseError.set('No fue posible completar la compra. Inténtalo nuevamente.');
      },
    });
  }
}
