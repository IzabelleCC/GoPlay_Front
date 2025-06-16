import { useEffect, useState, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  VStack,
  Text,
  useTheme,
  ScrollView,
  Box,
  Spinner,
  Center,
  HStack,
  Image,
  Button,
  Divider,
} from "native-base";
import Logo from "../assets/logo.png";
import { CategoryPlayerService } from "../api/categoryPlayer/categoryPlayerService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useFocusEffect } from "@react-navigation/native";
import BadgeStatus from "../components/BadgeStatus";

interface CategoryPlayerFullInfoResponse {
  categoryPlayer: {
    id: number;
    categoryId: number;
    registerStatus: number;
  };
  firstUserName: string;
  secondUserName: string;
  category: {
    id: number;
    categoryType: string;
    isDoubles: boolean;
  };
  registerCount: number;
  tournament: {
    id: number;
    name: string;
    gamesStartDate: string;
    gamesEndDate: string;
    registrationDeadline: string;
    status: number;
  };
}

export default function HomePlayer({ navigation }: any) {
  const { colors, fontSizes } = useTheme();
  const [loading, setLoading] = useState(true);
  const [inscricoes, setInscricoes] = useState<CategoryPlayerFullInfoResponse[]>([]);
  const [userType, setUserType] = useState<number | null>(null);

  const fetchUserType = async () => {
    const storedType = await AsyncStorage.getItem("userType");
    if (storedType) {
      setUserType(Number(storedType));
    }
  };

  useEffect(() => {
    fetchUserType();
  }, []);

  const loadInscricoes = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("Usuário não encontrado.");

      const response = await CategoryPlayerService.getCategoryPlayersFullInfoByUser(userId);

      setInscricoes(response);
    } catch (error) {
      console.error("Erro ao carregar inscrições:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInscricoes();
    }, [loadInscricoes])
  );

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format("DD/MM/YYYY");
  };

  const getTournamentBadgeLabel = (status: number) => {
    switch (status) {
      case 0:
      case 1:
        return "Inscrições Abertas";
      case 2:
        return "Inscrições Encerradas";
      case 3:
        return "Em Andamento";
      case 4:
        return "Concluído";
      case 5:
        return "Chaves Geradas";
      default:
        return "Status Desconhecido";
    }
  };

  const getTournamentBadgeColor = (status: number) => {
    switch (status) {
      case 4:
        return colors.gray[200];
      case 0:
      case 1:
      case 3:
      case 5:
        return "green.500";
      case 2:
        return "red.500";
      default:
        return colors.gray[300];
    }
  };

  return (
    <Box flex={1} bg={colors.white}>
      <ScrollView flex={1} bg={colors.white} p={4}>
        <VStack alignItems="center" mb={6}>
          <Image source={Logo} alt="Logo" width={90} height={90} resizeMode="contain" />
          <Text fontSize={fontSizes.lg} fontWeight="bold" mt={2}>
            Minhas Inscrições
          </Text>
        </VStack>

        {loading ? (
          <Center flex={1}>
            <Spinner size="lg" color={colors.blue[500]} />
            <Text mt={4} color={colors.black}>
              Carregando inscrições...
            </Text>
          </Center>
        ) : inscricoes.length === 0 ? (
          <Text textAlign="center" color={colors.black}>
            Nenhuma inscrição encontrada.
          </Text>
        ) : (
          <VStack space={4}>
            {inscricoes.map((inscricao) => (
              <Box
                key={inscricao.categoryPlayer.id}
                p={4}
                bg={colors.white}
                borderRadius={10}
                shadow={1}
                borderWidth={1}
                borderColor={colors.gray[200]}
              >
                {/* Imagem pequena e espaço abaixo */}
                <Center mb={3}>
                  <Image
                    source={{
                      uri: "https://via.placeholder.com/80.png?text=Torneio",
                    }}
                    alt="Imagem do Torneio"
                    borderRadius={50}
                    width={50}
                    height={50}
                  />
                </Center>

                {/* Nome do Torneio */}
                <Text fontWeight="bold" fontSize={fontSizes.md} mb={1} color={colors.blue[800]}>
                  {inscricao.tournament.name}
                </Text>

                {/* Nome da Categoria */}
                <Text fontWeight="bold" fontSize={fontSizes.sm} mb={1} color={colors.blue[800]}>
                  {inscricao.category.categoryType}
                </Text>

                {/* Data do fim do torneio */}
                <Text color={colors.black} fontSize={fontSizes.sm} mb={2}>
                  Termina em {formatDate(inscricao.tournament.gamesEndDate)}
                </Text>

                {/* Badge do status do torneio + parceiro */}
                <HStack space={2} mb={2} flexWrap="wrap" alignItems="center">
                  <BadgeStatus
                    label={getTournamentBadgeLabel(inscricao.tournament.status)}
                    bgColor={getTournamentBadgeColor(inscricao.tournament.status)}
                    textColor={colors.black}
                    fontWeight="bold" // para deixar negrito igual seu exemplo
                  />

                  {/* Parceiro se existir */}
                  {inscricao.category.isDoubles && inscricao.secondUserName && (
                    <HStack alignItems="center" space={1}>
                      <MaterialIcons name="person" size={20} color={colors.black} />
                      <Text fontWeight="bold" fontSize="14" color={colors.black}>
                        {inscricao.secondUserName}
                      </Text>
                    </HStack>
                  )}
                </HStack>

                <Divider bg={colors.gray[200]} my={2} />

                {/* Quantidade de duplas/inscritos, jogos e botão Ver Inscrição */}
                <HStack justifyContent="space-between" alignItems="center" mt={2}>
                  <HStack space={8} alignItems="center">
                    {/* Quantidade de duplas ou inscritos */}
                    <VStack alignItems="center">
                      <Text fontSize="lg" fontWeight="bold" color={colors.black}>
                        {inscricao.registerCount}
                      </Text>
                      <Text fontSize="xs" color={colors.black}>
                        {inscricao.category.isDoubles ? "Duplas" : "Inscritos"}
                      </Text>
                    </VStack>

                    {/* Quantidade de jogos */}
                    <VStack alignItems="center">
                      <Text fontSize="lg" fontWeight="bold" color={colors.black}>
                        0
                      </Text>
                      <Text fontSize="xs" color={colors.black}>
                        Jogos
                      </Text>
                    </VStack>
                  </HStack>

                  {/* Botão Ver Inscrição */}
                  <Button
                    variant="outline"
                    borderColor={colors.blue[500]}
                    _text={{ color: colors.blue[500], fontWeight: "bold" }}
                    onPress={() =>
                      navigation.navigate("RegistrationDetails", {
                        registrationId: inscricao.categoryPlayer.id,
                      })
                    }
                  >
                    Ver Inscrição
                  </Button>
                  {[5].includes(inscricao.tournament.status) && (
                    <VStack alignItems="center">
                      <Button
                        variant="ghost"
                        p={2}
                        onPress={() =>
                          navigation.navigate("MatchGroup", {
                            categoryId: inscricao.category.id,
                            tournamentId: inscricao.tournament.id,
                            categoryName: inscricao.category.categoryType,
                          })
                        }
                      >
                        <MaterialIcons name="emoji-events" size={30} color="black" />
                      </Button>
                      <Text fontSize="xs" color={colors.black}>
                        Chaves
                      </Text>
                    </VStack>
                  )}

                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </ScrollView>
      <Box
        marginBottom={3}
        marginTop={3}
        px={4}
        alignItems="center">
        {/* Floating buttons */}
        <HStack space={4} justifyContent="center">
          {/* Botão Home (casinha) */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => {
              if (userType === 1) navigation.navigate("HomePlayer" as never);
              if (userType === 2) navigation.navigate("HomeAdm" as never);
            }}
            p={3}
          >
            <MaterialIcons name="home" size={28} color="white" />
          </Button>

          {/* Botão Criar Torneio */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.navigate("PlayerTournaments")}
            p={3}
          >
            <MaterialIcons name="emoji-events" size={28} color="white" />
          </Button>

          {/* Botão Meu Perfil */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.navigate("MyProfile")}
            p={3}
          >
            <MaterialIcons name="person" size={28} color="white" />
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
