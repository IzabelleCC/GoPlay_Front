import axios from "axios";
import { Endpoints } from "../endpoints";
import {
    CreateUserPayload,
    UpdateUserPayload,
    ResetPasswordPayload,
    PasswordResetLinkPayload,
} from "./userTypes";

export const UserService = {
    async createUser(payload: CreateUserPayload) {
        try {
            await axios.post(Endpoints.UserManager.Base, payload);
            return { success: true };
        } catch (error: any) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    },

    async updateUser(payload: UpdateUserPayload) {
        try {
            const response = await axios.put(Endpoints.UserManager.Base, payload);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao atualizar usuário:", error);
            throw error;
        }
    },

    async getUserByUserName(userName: string) {
        try {
            const response = await axios.get(`${Endpoints.UserManager.GetByUserName}/${userName}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar usuário:", error);
            throw error;
        }
    },

    async deleteUser(userName: string) {
        try {
            const response = await axios.delete(`${Endpoints.UserManager.Delete}/${userName}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao deletar usuário:", error);
            throw error;
        }
    },

    async confirmEmail(email: string) {
        try {
            const response = await axios.get(`${Endpoints.UserManager.EmailConfirmation}?email=${encodeURIComponent(email)}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao confirmar e-mail:", error);
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