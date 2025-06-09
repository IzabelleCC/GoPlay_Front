export interface CategoryPlayer {
    id: number;
    categoryId: number;
    firstUserId: string;
    secondUserId: string;
    registerStatus: number;
    firstUserPaymentConfirmed: boolean;
    secondUserPaymentConfirmed: boolean;
    firstUserTxId: string | null;
    secondUserTxId: string | null;
    matchGroups: any[];
}

export interface TournamentCategory {
    id: number;
    categoryType: string;
    playerLimit: number;
    tournamentId: number;
    isDoubles: boolean;
    categoryPlayers: CategoryPlayer[];
    matchGroups: any[];
    gameMatches: any[];
}
