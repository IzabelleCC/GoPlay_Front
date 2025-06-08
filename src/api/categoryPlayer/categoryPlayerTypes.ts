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
  