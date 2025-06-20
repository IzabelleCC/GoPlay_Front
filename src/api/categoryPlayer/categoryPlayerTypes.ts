export interface RegisterCategoryPlayerPayload {
  categoryId: number;
  firstUserId: string;
  secondUserId: string;
}

export interface UpdateCategoryPlayerPayload {
  id: number;
  firstUserId: string;
  secondUserId: string;
  firstUserPaymentConfirmed: boolean;
  secondUserPaymentConfirmed: boolean;
}

export interface GeneratePaymentParams {
  registrationId: number;
  userId: string;
}

export interface GeneratePaymentResponse {
  message: string;
  responseBody: string;
}

export interface ParsedPixResponse {
  calendario: {
    criacao: string;
    expiracao: number;
  };
  txid: string;
  revisao: number;
  status: string;
  valor: {
    original: string;
  };
  chave: string;
  devedor: {
    cpf: string;
    nome: string;
  };
  solicitacaoPagador: string;
  loc: {
    id: number;
    location: string;
    tipoCob: string;
    criacao: string;
  };
  location: string;
  pixCopiaECola: string;
}

export interface CategoryPlayerResponse {
  id: number;
  categoryId: number;
  firstUserId: string;
  secondUserId: string | null;
  registerStatus: number;
  firstUserPaymentConfirmed: boolean;
  secondUserPaymentConfirmed: boolean;
  firstUserTxId: string | null;
  secondUserTxId: string | null;
  matchGroups: any[];
}

export interface CategoryPlayerFullInfoResponse {
  categoryPlayer: {
    id: number;
    categoryId: number;
    registerStatus: number;
  };
  firstUserName: string;
  secondUserName: string;
  category: {
    id: number;
    categoryType: string;
    isDoubles: boolean;
  };
  registerCount: number;
  tournament: {
    id: number;
    name: string;
    profilePictureUrl: string | null;
    gamesStartDate: string;
    gamesEndDate: string;
    registrationDeadline: string;
    status: number;
  };
}

export interface TournamentMatchesResultDto {
  tournamentId: number;
  tournamentName: string;
  tournamentPictureUrl: string | null;
  groups: CategoryGroupsDto[];
}

export interface CategoryGroupsDto {
  categoryId: number;
  categoryName: string;
  groups: GroupDto[];
}

export interface GroupDto {
  groupNumber: number;
  courtNumber: number | null;
  players: GroupPlayerDto[];
}

export interface GroupPlayerDto {
  id: number;
  firstUserId: string;
  firstUserName: string;
  firstUserPictureUrl: string | null;
  secondUserId: string;
  secondUserName: string;
  secondUserPictureUrl: string | null;
}

export interface GroupResultDto {
  categoryId: number;
  groupNumber: number;
  registrationCategoryId: number;
  scheduledAt: string | null;
  attendanceConfirmed: boolean;
  position: number;
  wins: number;
  losses: number;
  setsBalance: number;
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
  sumOfGamesWon: number;
  sumOfGamesLost: number;
  gamesBalance: number;
  tiebreaks: number;
  matchStage: number;
}

export interface RegistrationDetailsDto {
  id: number;
  tournamentId: number;
  tournamentName: string;
  registrationFee: number;
  paymentDeadline: string; 
  categoryId: number;
  categoryName: string;
  firstUserId: string;
  secondUserId: string;
  firstUserName: string;
  secondUserName: string;
  firstUserPaymentConfirmed: boolean;
  secondUserPaymentConfirmed: boolean;
  registerStatus: number;
  attendanceConfirmed: boolean;
  attendanceTime: string;
  attendanceConfirmedUserId: string;
}




