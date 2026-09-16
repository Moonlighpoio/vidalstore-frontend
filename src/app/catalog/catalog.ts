import { Component, inject, signal } from '@angular/core';
import { CatalogService } from '../services/catalog.service';
import { Game } from '../models/game.model';

@Component({
selector: 'app-catalog',
templateUrl: './catalog.html',
})
export class Catalog {
private readonly catalogService = inject(CatalogService);

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
    console.log('Selected game to purchase:', game);
    }
}