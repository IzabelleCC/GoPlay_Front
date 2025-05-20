import axios from "axios";
import { Endpoints } from "../endpoints";
import {
  CreateTournamentPayload,
  UpdateTournamentPayload,
} from "./tournamentTypes";

export const TournamentService = {
  async createTournament(payload: CreateTournamentPayload) {
    try {
      await axios.post(Endpoints.TournamentManager.Base, payload);
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao criar torneio:", error);
      throw error;
    }
  },

  async updateTournament(payload: UpdateTournamentPayload) {
    try {
      const response = await axios.put(Endpoints.TournamentManager.Base, payload);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar torneio:", error);
      throw error;
    }
  },

  async getAllTournaments() {
    try {
      const response = await axios.get(Endpoints.TournamentManager.Base);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar torneios:", error);
      throw error;
    }
  },

  async getTournamentByName(name: string) {
    try {
      const response = await axios.get(`${Endpoints.TournamentManager.GetByName}/${encodeURIComponent(name)}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar torneio por nome:", error);
      throw error;
    }
  },

  async getTournamentsByAdmUserId(admUserId: string) {
    try {
      const response = await axios.get(`${Endpoints.TournamentManager.GetByAdmUserId}/${admUserId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar torneios por ID de administrador:", error);
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
      const response = await axios.delete(`${Endpoints.TournamentManager.Base}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao deletar torneio:", error);
      throw error;
    }
  },
};
