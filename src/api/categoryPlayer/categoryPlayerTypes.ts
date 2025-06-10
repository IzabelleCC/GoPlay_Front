// Payload para POST /api/CategoryPlayer/Register
export interface RegisterCategoryPlayerPayload {
  categoryId: number;
  firstUserId: string;
  secondUserId: string;
}

// Payload para PUT /api/CategoryPlayer
export interface UpdateCategoryPlayerPayload {
  id: number;
  firstUserId: string;
  secondUserId: string;
  firstUserPaymentConfirmed: boolean;
  secondUserPaymentConfirmed: boolean;
}

// Parâmetros de query para POST /api/CategoryPlayer/GeneratePayment
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
    gamesStartDate: string;
    gamesEndDate: string;
    registrationDeadline: string;
    status: number;
  };
}

