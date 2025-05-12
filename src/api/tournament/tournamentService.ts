import axios from "axios";
import { Endpoints } from "../endpoints";
import {
    CreateTournamentPayload,
    UpdateTournamentPayload,
} from "./tournamentTypes";

export const TournamentService = {
    async createTournament(payload: CreateTournamentPayload) {
        try {
            await axios.post(Endpoints.TournamentManager.Create, payload);
            return { success: true };
        } catch (error: any) {
            console.error("Erro ao criar torneio:", error);
            throw error;
        }
    },

    async updateTournament(payload: UpdateTournamentPayload) {
        try {
            const response = await axios.put(Endpoints.TournamentManager.Update, payload);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao atualizar torneio:", error);
            throw error;
        }
    },

    async getAllTournaments() {
        try {
            const response = await axios.get(Endpoints.TournamentManager.GetAll);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar torneios:", error);
            throw error;
        }
    },

    async getTournamentByName(name: string) {
        try {
            const response = await axios.get(`${Endpoints.TournamentManager.GeByName}/${encodeURIComponent(name)}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar torneio por nome:", error);
            throw error;
        }
    },

    async getTournamentById(id: number) {
        try {
            const response = await axios.get(`${Endpoints.TournamentManager.GetById}/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar torneio por ID:", error);
            throw error;
        }
    },

    async deleteTournament(id: number) {
        try {
            const response = await axios.delete(`${Endpoints.TournamentManager.Delete}/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao deletar torneio:", error);
            throw error;
        }
    },
};
