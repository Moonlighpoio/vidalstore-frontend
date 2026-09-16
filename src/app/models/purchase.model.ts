export interface Purchase {
    id: string;
    gameId: string;
    gameTitle: string;
    userId: string;
    timestamp: Date;
    amount: number;
    licenseKey: string;
}