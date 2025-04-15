export interface CreateUserPayload {
    data: {
        name: string;
        userName: string;
        email: string;
        password: string;
        confirmPassword: string;
        userType: number;
        instagramPage: string;
        cpfCnpj: string;
        gender: string;
        birthDate: string; // ISO string
        tShirtSize: string;
    };
}

export interface UpdateUserPayload {
    data: {
        id: string;
        userName: string;
        name: string;
        instagramPage: string;
        gender: string;
        birthDate: string;
        tShirtSize: string;
    };
}

export interface ResetPasswordPayload {
    data: {
        password: string;
    };
}

export interface EmailConfirmationPayload {
    email: string;
}

export interface PasswordResetLinkPayload {
    data: {
        email: string
    };
}

