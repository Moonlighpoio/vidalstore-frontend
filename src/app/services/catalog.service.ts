import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({
providedIn: 'root',
})
export class CatalogService {
private readonly mockGames: Game[] = [
    {
    id: '1',
    title: 'Super Adventure',
    description: 'An epic open-world exploration adventure.',
    price: 29.99,
    category: 'Adventure',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    },
    {
    id: '2',
    title: 'Racing Pro',
    description: 'High-speed competitive track racing.',
    price: 39.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
    },
    {
    id: '3',
    title: 'Puzzle Master',
    description: 'Challenging spatial and logic puzzles.',
    price: 14.99,
    category: 'Puzzle',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    },
    {
    id: '4',
    title: 'Space Warrior',
    description: 'Fast-paced interstellar tactical combat.',
    price: 49.99,
    category: 'Action',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80',
    },
];

    getCatalog(): Observable<Game[]> {
    return of(this.mockGames);
    }

    getGameById(id: string): Observable<Game | undefined> {
    const game = this.mockGames.find((g) => g.id === id);
    return of(game);
    }
}