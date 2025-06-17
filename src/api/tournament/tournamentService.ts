import axios from "axios";
import { Endpoints } from "../endpoints";
import {
  CreateTournamentPayload,
  UpdateTournamentPayload,
  ConfirmAttendancePayload,
  InsertGroupResultsPayload,
  InsertEliminationResultsPayload,
  EliminationGameDto
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

  async getFullInformationById(id: number) {
    try {
      const response = await axios.get(`${Endpoints.TournamentManager.GetFullInformationById}/${id}`);
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

  // NOVOS MÉTODOS

  async generateGroupMatches(tournamentId: number) {
    try {
      const response = await axios.post(`${Endpoints.TournamentManager.GenerateGroupMatches}/${tournamentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao gerar grupos:", error);
      throw error;
    }
  },

  async confirmAttendance(payload: ConfirmAttendancePayload) {
    try {
      const response = await axios.post(Endpoints.TournamentManager.ConfirmAttendance, payload);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao confirmar presença:", error);
      throw error;
    }
  },

  async insertGroupResults(payload: InsertGroupResultsPayload) {
    try {
      const response = await axios.post(Endpoints.TournamentManager.InsertGroupResults, payload);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao inserir resultados dos grupos:", error);
      throw error;
    }
  },

  async insertEliminationResults(payload: InsertEliminationResultsPayload) {
    try {
      const response = await axios.post(Endpoints.TournamentManager.InsertEliminationResults, payload);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao inserir resultados de eliminatórias:", error);
      throw error;
    }
  },

  async getCategoriesByTournamentId(tournamentId: number) {
    try {
      const response = await axios.get(`${Endpoints.TournamentManager.GetCategoriesByTournamentId}/${tournamentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar categorias do torneio:", error);
      throw error;
    }
  },
  
  async getEliminationGamesByCategory(categoryId: number, matchStage: number) {
    try {
      const response = await axios.get(
        `${Endpoints.TournamentManager.GetEliminationGamesByCategory}/${categoryId}/${matchStage}`
      );
      return response.data as EliminationGameDto[];
    } catch (error: any) {
      console.error("Erro ao buscar jogos de eliminação:", error);
      throw error;
    }
  }
};
