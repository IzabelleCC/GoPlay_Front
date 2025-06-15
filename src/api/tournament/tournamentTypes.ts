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
    matchGroups: any[]; // tipável depois
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

export interface Tournament {
    id: number;
    name: string;
    description: string;
    createdAt: string; // ISO date
    gamesStartDate: string; // ISO date
    gamesEndDate: string;   // ISO date
    registrationDeadline: string; // ISO date
    paymentDeadline: string;      // ISO date
    location: string;
    registrationFee: number;
    isActive: boolean;
    courtQuantity: number;
    admUserId: string;
    latitude: number;
    longitude: number;
    admUser: any;
    categories: TournamentCategory[];
}

export interface UpdateTournamentPayload {
    data: {
        id: number;
        name: string;
        description: string;
        gamesStartDate: string; // ISO date
        gamesEndDate: string;   // ISO date
        registrationDeadline: string; // ISO date
        paymentDeadline: string;      // ISO date
        location: string;
        registrationFee: number;
        courtQuantity: number;
        admUserId: string;
        categories: TournamentCategory[];
    };
}

export interface ConfirmAttendancePayload {
    registrationCategoryId: number;
    latitude: number;
    longitude: number;
}

export interface InsertGroupResultsItem {
    registrationCategoryId: number;
    game1: number | null;
    game2: number | null;
    game3: number | null;
    game4: number | null;
    game5: number | null;
    game6: number | null;
    game7: number | null;
    game8: number | null;
    game9: number | null;
    game10: number | null;
}

export type InsertGroupResultsPayload = InsertGroupResultsItem[];

export interface InsertEliminationResultsPayload {
    gameEliminationId: number;
    competitorId1: number;
    competitorId2: number;
    game1: number;
    game2: number;
}

export interface CreateTournamentPayload {
    data: {
        name: string;
        description: string;
        gamesStartDate: string; // ISO date
        gamesEndDate: string;   // ISO date
        registrationDeadline: string; // ISO date
        paymentDeadline: string;      // ISO date
        location: string;
        latitude: number;
        longitude: number;
        registrationFee: number;
        courtQuantity: number;
        admUserId: string;
        categories: {
            categoryType: string;
            playerLimit: number;
        }[];
    };
}

export interface CompetitorInfo {
    id: number;
    firstUserId: string;
    firstUserName: string;
    secondUserId: string | null;
    secondUserName: string;
}

export interface EliminationGameDto {
    gameEliminationId: number | null;
    competitor1Id: number | null;
    competitor2Id: number | null;
    matchStage: number;
    matchTime: string | null;
    courtNumber: number | null;
    qtdGames1: number | null;
    qtdGames2: number | null;
    result: number;
    numberGame: number;
    categoryId: number;
    competitor1: CompetitorInfo;
    competitor2: CompetitorInfo;
}