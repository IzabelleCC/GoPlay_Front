export interface LoginPayload {
    data: {
        userName: string;
        password: string;
    };
}

export interface PasswordResetLinkPayload {
    data: {
        email: string
    };
}

export interface ResetPasswordPayload {
    data: {
        password: string;
    };
}