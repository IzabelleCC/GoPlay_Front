import axios from "axios";
import { Endpoints } from "../endpoints";
import {
  RegisterCategoryPlayerPayload,
  UpdateCategoryPlayerPayload,
  GeneratePaymentParams,
  GeneratePaymentResponse,
  CategoryPlayerFullInfoResponse,
  TournamentMatchesResultDto,
  GroupResultDto,
} from "./categoryPlayerTypes";

export const CategoryPlayerService = {
  async registerCategoryPlayer(payload: RegisterCategoryPlayerPayload) {
    try {
      const response = await axios.post(Endpoints.CategoryPlayer.Register, payload);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao registrar jogador na categoria:", error);
      throw error;
    }
  },

  async updateCategoryPlayer(payload: UpdateCategoryPlayerPayload) {
    try {
      const response = await axios.put(Endpoints.CategoryPlayer.Update, payload);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar jogador da categoria:", error);
      throw error;
    }
  },

  async getAllCategoryPlayers() {
    try {
      const response = await axios.get(Endpoints.CategoryPlayer.GetAll);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar jogadores das categorias:", error);
      throw error;
    }
  },

  async getCategoryPlayerById(id: number) {
    try {
      const response = await axios.get(`${Endpoints.CategoryPlayer.GetById}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar jogador da categoria por ID:", error);
      throw error;
    }
  },

  async deleteCategoryPlayer(id: number) {
    try {
      const response = await axios.delete(`${Endpoints.CategoryPlayer.Delete}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao deletar jogador da categoria:", error);
      throw error;
    }
  },

  async getCategoryPlayersByCategory(categoryId: number) {
    try {
      const response = await axios.get(`${Endpoints.CategoryPlayer.GetByCategory}/${categoryId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar jogadores por categoria:", error);
      throw error;
    }
  },

  async getCategoryPlayersByUser(userId: string) {
    try {
      const response = await axios.get(`${Endpoints.CategoryPlayer.GetByUser}/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar inscrições do usuário:", error);
      throw error;
    }
  },

  async generatePayment(params: GeneratePaymentParams): Promise<GeneratePaymentResponse> {
    try {
      const response = await axios.post(Endpoints.CategoryPlayer.GeneratePayment, null, {
        params: {
          registrationId: params.registrationId,
          userId: params.userId,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Erro ao gerar pagamento:", error);
      throw error;
    }
  },

  async getCategoryPlayersFullInfoByUser(userId: string): Promise<CategoryPlayerFullInfoResponse[]> {
    try {
      const response = await axios.get(`${Endpoints.CategoryPlayer.ByUserIdReturnsFullInfo}/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar inscrições completas do usuário:", error);
      throw error;
    }
  },

  async getMatchGroupsByCategoryId(categoryId: number): Promise<TournamentMatchesResultDto> {
    try {
      const response = await axios.get(`${Endpoints.CategoryPlayer.GetMatchGroupByCategoryId}/${categoryId}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar grupos da categoria:", error);
      throw error;
    }
  },

  async getGroupResultByCategoryIdAndGroupNumber(
    categoryId: number,
    groupNumber: number
  ): Promise<GroupResultDto[]> {
    try {
      const response = await axios.get(
        `${Endpoints.CategoryPlayer.GetGroupResultByCategoryIdAndGroupNumber}/${categoryId}/${groupNumber}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar resultado do grupo:", error);
      throw error;
    }
  },
};
