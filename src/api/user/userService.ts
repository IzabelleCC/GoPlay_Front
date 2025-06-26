import axios from "axios";
import { Endpoints } from "../endpoints";
import {
    CreateUserPayload,
    UpdateUserPayload
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

    async searchUsersByName(name: string) {
        try {
            const response = await axios.get(`${Endpoints.UserManager.GetByName}/${encodeURIComponent(name)}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar usuários por nome:", error);
            throw error;
        }
    },

    async uploadProfilePicture(userId: string, formData: FormData): Promise<string> {
        try {
            const response = await axios.post(
                `${Endpoints.UserManager.Base}/uploadProfilePicture/${userId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            return response.data.imageUrl;
        } catch (error: any) {
            console.error("Erro ao fazer upload da imagem de perfil:", error);
            throw error;
        }
    }
    
    
    
};