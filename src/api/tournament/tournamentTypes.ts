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
