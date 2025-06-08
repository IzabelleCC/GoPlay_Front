export interface TournamentCategory {
    categoryType: string;
    playerLimit: number;
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
        registrationFee: number;
        courtQuantity: number;
        admUserId: string;
        categories: TournamentCategory[];
    };
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
    game1: number;
    game2: number;
    game3: number;
    game4: number;
    game5: number;
}

export type InsertGroupResultsPayload = InsertGroupResultsItem[];

export interface InsertEliminationResultsPayload {
    categoryId: number;
    competitorId1: number;
    competitorId2: number;
    game1: number;
    game2: number;
}

