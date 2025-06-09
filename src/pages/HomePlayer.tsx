import { useEffect, useState } from "react";
import {
  VStack,
  Text,
  useTheme,
  ScrollView,
  Box,
  Spinner,
  Center,
} from "native-base";
import { CategoryPlayerService } from "../api/categoryPlayer/categoryPlayerService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CategoryPlayerResponse } from "../api/categoryPlayer/categoryPlayerTypes";
import { RegisterStatusEnum } from "../@types/enums";

export default function HomePlayer({ navigation }: any) {
  const { colors, fontSizes } = useTheme();
  const [loading, setLoading] = useState(true);
  const [inscricoes, setInscricoes] = useState<CategoryPlayerResponse[]>([]);

  useEffect(() => {
    async function loadInscricoes() {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) throw new Error("Usuário não encontrado.");

        const response = await CategoryPlayerService.getCategoryPlayersByUser(userId);

        setInscricoes(response);
      } catch (error) {
        console.error("Erro ao carregar inscrições:", error);
      } finally {
        setLoading(false);
      }
    }

    loadInscricoes();
  }, []);

  const getStatusDescricao = (status: number) => {
    switch (status) {
      case RegisterStatusEnum.InscricaoRealizada:
        return "Inscrição Realizada";
      case RegisterStatusEnum.AguardandoConfirmacaoPagamento:
        return "Aguardando Confirmação de Pagamento";
      case RegisterStatusEnum.InscricaoConfirmada:
        return "Inscrição Confirmada";
      default:
        return "Status Desconhecido";
    }
  };

  return (
    <ScrollView flex={1} bg={colors.white} p={4}>
      <VStack alignItems="center" mb={6}>
        <Text fontSize={fontSizes.lg} fontWeight="bold" mt={2}>
          Minhas Inscrições
        </Text>
      </VStack>

      {loading ? (
        <Center flex={1}>
          <Spinner size="lg" color={colors.blue[500]} />
          <Text mt={4}>Carregando inscrições...</Text>
        </Center>
      ) : inscricoes.length === 0 ? (
        <Text textAlign="center" color={colors.gray[500]}>
          Nenhuma inscrição encontrada.
        </Text>
      ) : (
        <VStack space={4}>
          {inscricoes.map((inscricao) => (
            <Box
              key={inscricao.id}
              p={4}
              bg={colors.gray[100]}
              borderRadius={10}
            >
              <Text fontWeight="bold" mb={1}>
                ID da Inscrição: {inscricao.id}
              </Text>
              <Text mb={1}>Categoria ID: {inscricao.categoryId}</Text>
              <Text mb={1}>Status: {getStatusDescricao(inscricao.registerStatus)}</Text>
              <Text mb={1}>
                Pagamento 1:{" "}
                {inscricao.firstUserPaymentConfirmed ? "Confirmado" : "Pendente"}
              </Text>
              <Text>
                Pagamento 2:{" "}
                {inscricao.secondUserPaymentConfirmed ? "Confirmado" : "Pendente"}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </ScrollView>
  );
}
