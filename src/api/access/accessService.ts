import axios from "axios";
import { Endpoints } from "../endpoints";
import { LoginPayload, PasswordResetLinkPayload, ResetPasswordPayload } from "./accessTypes";

export const AccessService = {
    async login(payload: LoginPayload) {
        try {
            const response = await axios.post(Endpoints.AccessManager.Login, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            return response.data;
        } catch (error: any) {
            console.error("Erro ao logar:", error?.response?.data || error.message);
            throw error;
        }
    },

    async logout() {
        try {
            const response = await axios.post(Endpoints.AccessManager.Logout, {}, {
                headers: { 'Content-Type': 'application/json' },
            });

            return response.data;
        } catch (error: any) {
            console.error("Erro ao deslogar:", error?.response?.data || error.message);
            throw error;
        }
    },

        async passwordResetLink(payload: PasswordResetLinkPayload) {
            try {
                const response = await axios.post(Endpoints.AccessManager.PasswordResetLink, payload);
                return response.data;
            } catch (error: any) {
                console.error("Erro ao enviar link de redefinição de senha:", error);
                throw error;
            }
        },
        

    async resetPassword(token: string, payload: ResetPasswordPayload) {
        try {
            const response = await axios.post(
                `${Endpoints.AccessManager.ResetPassword}?token=${encodeURIComponent(token)}`,
                payload
            );
            return response.data;
        } catch (error: any) {
            console.error("Erro ao redefinir senha:", error);
            throw error;
        }
    },
};
