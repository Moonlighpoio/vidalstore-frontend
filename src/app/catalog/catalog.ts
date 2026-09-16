import { Component, inject, signal } from '@angular/core';
import { CatalogService } from '../services/catalog.service';
import { PurchaseService } from '../services/purchase.service';
import { Game } from '../models/game.model';

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.html',
})
export class Catalog {
    private readonly catalogService = inject(CatalogService);
    private readonly purchaseService = inject(PurchaseService);

    protected readonly games = signal<Game[]>([]);
    protected readonly loading = signal(true);

    constructor() {
    this.catalogService.getCatalog().subscribe({
    next: (data) => {
        this.games.set(data);
        this.loading.set(false);
    },
    error: () => {
    this.loading.set(false);
    },
    });
}

    onBuy(game: Game): void {
    this.purchaseService.createPurchase(game.id, game.title, game.price).subscribe({
    next: (order) => {
        alert(`Order Completed!\nGame: ${order.gameTitle}\nLicense: ${order.licenseKey}`);
    },
    });
    }
}