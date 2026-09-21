export interface Game {
    id: string;
    title?: string;
    name?: string;
    description?: string;
    short_description?: string;
    imageUrl?: string;
    thumbnail?: string;
    coverUrl?: string;
    price?: number;
}

export interface GamePayload {
    nombre: string;
    descripcion?: string;
    imagen?: string | null;
}