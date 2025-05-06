import axios from "axios";
import { Endpoints } from "../endpoints";
import { LoginPayload } from "./accessTypes";

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
    }
};
