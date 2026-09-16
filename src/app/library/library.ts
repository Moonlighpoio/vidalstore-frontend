import { Component, inject, signal } from '@angular/core';
import { LibraryService } from '../services/library.service';
import { Purchase } from '../models/purchase.model';

@Component({
    selector: 'app-library',
    templateUrl: './library.html',
})
export class Library {
    private readonly libraryService = inject(LibraryService);

    protected readonly items = signal<Purchase[]>([]);
    protected readonly loading = signal(true);

    constructor() {
    this.libraryService.getUserLibrary().subscribe({
    next: (data) => {
        this.items.set(data);
        this.loading.set(false);
    },
    error: () => {
        this.loading.set(false);
    },
    });
}

    launchGame(item: Purchase): void {
    alert(`Starting game executable for: ${item.gameTitle}`);
    }
}