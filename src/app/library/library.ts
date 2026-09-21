import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { Purchase } from '../models/purchase.model';
import { LibraryService } from '../services/library.service';
import { LibraryRefreshService } from '../services/library-refresh.service';

@Component({
  selector: 'app-library',
  standalone: true,
  templateUrl: './library.html',
})
export class Library implements OnDestroy {
  private readonly libraryService = inject(LibraryService);
  private readonly libraryRefreshService = inject(LibraryRefreshService);
  private readonly destroy$ = new Subject<void>();

  protected readonly items = signal<Purchase[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadLibrary();

    this.libraryRefreshService.refresh$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadLibrary();
    });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
