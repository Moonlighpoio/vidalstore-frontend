import { Component, inject, signal } from '@angular/core';

import { Purchase } from '../models/purchase.model';
import { LibraryService } from '../services/library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.html',
})
export class Library {
  private readonly libraryService = inject(LibraryService);

  protected readonly items = signal<Purchase[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadLibrary();
  }

  private loadLibrary(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.libraryService.getUserLibrary().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.items.set([]);
        this.loading.set(false);
        this.errorMessage.set('No fue posible cargar tu biblioteca.');
      },
    });
  }

  launchGame(item: Purchase): void {
    alert(`Starting game executable for: ${item.gameTitle}`);
  }
}
