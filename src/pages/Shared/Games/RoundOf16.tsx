import {
  VStack,
  HStack,
  Image,
  Text,
  useTheme,
  ScrollView,
  Icon,
  Spinner,
  Box,
  Center,
  Input,
  Button,
  ZStack
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TournamentService } from "../../../api/tournament/tournamentService";
import { EliminationGameDto, InsertEliminationResultsPayload, CompetitorInfo } from "../../../api/tournament/tournamentTypes";
import GenericModal from "../../../components/modals/GenericModal";
import EmptyStateCard from "../../../components/EmptyStateCard";
import { CategoryPlayerService } from "../../../api/categoryPlayer/categoryPlayerService";

export default function Round16() {
  const { colors, fontSizes } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<EliminationGameDto[]>([]);
  const [tournamentName, setTournamentName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [tournamentPictureUrl, setTournamentPictureUrl] = useState<string | null>(null);
  const [modal, setModal] = useState({ isOpen: false, title: "", body: "", type: "info" });
  const [scoreInputs, setScoreInputs] = useState<Record<number, { game1: string; game2: string }>>({});
  const [submittedGames, setSubmittedGames] = useState<number[]>([]);
  const [userType, setUserType] = useState<number | null>(null);
  const [courtInputs, setCourtInputs] = useState<{ [key: number]: string }>({});


  useEffect(() => {
    fetchData();
    fetchUserType();
  }, []);

  const fetchUserType = async () => {
    const storedType = await AsyncStorage.getItem("userType");
    if (storedType) {
      setUserType(Number(storedType));
    }
  };

  const fetchGames = async (categoryId: number) => {
    const data = await TournamentService.getEliminationGamesByCategory(categoryId, 3);
    const initialCourts: { [key: number]: string } = {};
    data.forEach(game => {
      if (game.courtNumber != null) {
        initialCourts[game.numberGame] = game.courtNumber.toString();
      }
    });
    setCourtInputs(initialCourts);
    setGames(data.sort((a, b) => b.numberGame - a.numberGame));
  };

  const handleSubmitCourtNumber = async (categoryId: number, numberGame: number) => {
    try {
      const courtNumber = Number(courtInputs[numberGame]);
      if (isNaN(courtNumber)) throw new Error("Número inválido");

      await CategoryPlayerService.insertCourtNumberElimination(categoryId, numberGame, courtNumber);
      setModal({
        isOpen: true,
        title: "Sucesso",
        body: "Número da quadra atualizado com sucesso!",
        type: "success",
      });
      await fetchGames(categoryId);
    } catch (err) {
      setModal({
        isOpen: true,
        title: "Erro",
        body: "Erro ao atualizar número da quadra.",
        type: "error",
      });
    }
  };


  const fetchData = async () => {
    setLoading(true);
    try {
      const categoryIdStr = await AsyncStorage.getItem("categoryId");
      const categoryName = await AsyncStorage.getItem("categoryName");
      const tournamentName = await AsyncStorage.getItem("tournamentName");
      const tournamentPictureUrl = await AsyncStorage.getItem("tournamentPictureUrl");

      setCategoryName(categoryName || "Categoria");
      setTournamentName(tournamentName || "Nome do Torneio");
      setTournamentPictureUrl(tournamentPictureUrl || null);

      if (categoryIdStr) {
        const categoryId = Number(categoryIdStr);
        await fetchGames(categoryId);
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

const renderDoubleAvatar = (
        firstUrl: string | null,
        secondUrl: string | null,
        firstName1: string,
        firstName2: string
    ) => {
        const getInitials = (name: string) => {
            return name
                .split(" ")
                .map(n => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
        };

        return (
            <ZStack width={10} height={10} mr={3}>
                {firstUrl ? (
                    <Image
                        source={{ uri: firstUrl }}
                        alt="Avatar 1"
                        borderRadius={50}
                        width={10}
                        height={10}
                        position="absolute"
                        left={0}
                        zIndex={1}
                    />
                ) : (
                    <Center
                        position="absolute"
                        left={0}
                        zIndex={1}
                        bg="blue.500"
                        borderRadius={50}
                        width={10}
                        height={10}
                    >
                        <Text color="white" fontSize="xs" fontWeight="bold">
                            {getInitials(firstName1)}
                        </Text>
                    </Center>
                )}

                {secondUrl ? (
                    <Image
                        source={{ uri: secondUrl }}
                        alt="Avatar 2"
                        borderRadius={50}
                        width={10}
                        height={10}
                        position="absolute"
                        left={8}
                        zIndex={0}
                    />
                ) : (
                    <Center
                        position="absolute"
                        left={8}
                        zIndex={0}
                        bg="gray.500"
                        borderRadius={50}
                        width={10}
                        height={10}
                    >
                        <Text color="white" fontSize="xs" fontWeight="bold">
                            {getInitials(firstName2)}
                        </Text>
                    </Center>
                )}
            </ZStack>
        );
    };


  const renderPlayer = (
    competitor: CompetitorInfo | null,
    isWinner: boolean,
    isBye: boolean,
    score: string,
    isSubmitted: boolean,
    opponentIsBye: boolean,
    numberGame: number,
    competitor1Id: number
  ) => (
    <HStack alignItems="center" space={2} mb={2} justifyContent="space-between">
      <HStack alignItems="center" space={3} flex={1}>
        {renderDoubleAvatar(competitor?.firstUserPictureUrl || "", competitor?.secondUserPictureUrl || "", competitor?.firstUserName || "", competitor?.secondUserName || "")}
        <VStack ml={3}>
          <Text fontWeight="bold" color={isBye ? colors.gray[500] : isWinner ? "green.700" : "red.600"}>{competitor?.firstUserName || "BYE"}</Text>
          <Text fontWeight="bold" color={isBye ? colors.gray[500] : isWinner ? "green.700" : "red.600"}>{competitor?.secondUserName || ""}</Text>
        </VStack>
      </HStack>

      {!isBye && !opponentIsBye && (
        isSubmitted || userType === 1 ? (
          <Text fontWeight={isWinner ? "bold" : "normal"} fontSize="md" color={isWinner ? "green.700" : "red.600"}>{score}</Text>
        ) : (
          <Input
            placeholder=""
            width="20%"
            keyboardType="numeric"
            backgroundColor={colors.gray[50]}
            value={score}
            onChangeText={(value) =>
              setScoreInputs((prev) => ({
                ...prev,
                [numberGame]: {
                  ...prev[numberGame],
                  [competitor?.id === competitor1Id ? "game1" : "game2"]: value,
                },
              }))
            }
          />
        )
      )}
    </HStack>
  );

  const handleSendResults = async (game: EliminationGameDto) => {
    try {
      const { game1, game2 } = scoreInputs[game.numberGame] || {};
      const payload: InsertEliminationResultsPayload = {
        categoryId: game.categoryId!,
        competitorId1: game.competitor1Id!,
        competitorId2: game.competitor2Id!,
        game1: Number(game1),
        game2: Number(game2),
      };

      await TournamentService.insertEliminationResults(payload);
      await fetchGames(game.categoryId!);

      setSubmittedGames((prev) => [...prev, game.numberGame]);
      setModal({ isOpen: true, title: "Sucesso", body: "Resultado enviado com sucesso!", type: "success" });
    } catch (err) {
      setModal({ isOpen: true, title: "Erro", body: "Não foi possível enviar o resultado.", type: "error" });
    }
  };

  if (loading) {
    return (
      <Center flex={1}>
        <Spinner size="lg" color={colors.blue[800]} />
      </Center>
    );
  }

  return (
    <Box flex={1} bg={colors.white}>
      <ScrollView px={4} py={4} mb={8}>
        <GenericModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          title={modal.title}
          body={<Text>{modal.body}</Text>}
          type={modal.type as any}
        />

        <HStack alignItems="center" mb={4}>
          <Image source={{ uri: tournamentPictureUrl || "https://res.cloudinary.com/dqj6qbp0s/image/upload/v1750301894/goplay/users/zuxqmczwestyzzn0t6xp.png" }}
            alt="Logo" borderRadius={75} width={75} height={75} mr={3} />
          <VStack maxW="80%">
            <Text fontSize={18} fontWeight="bold" color={colors.blue[800]}>{tournamentName}</Text>
            <Text fontSize={fontSizes.sm} color={colors.gray[800]} fontWeight="bold">{categoryName.toUpperCase()}</Text>
          </VStack>
        </HStack>

        <HStack alignItems="center" justifyContent="space-between" mb={4}>
          {/* Botão de voltar (seta para a esquerda) */}
          <Button variant="ghost" p={0} onPress={() => navigation.goBack()}>
            <VStack alignItems="center">
              <Icon as={MaterialIcons} name="arrow-back" size={5} color="black" />
              <Text fontSize="8" fontWeight="bold">Voltar</Text>
            </VStack>
          </Button>

          {/* Título centralizado */}
          <Text fontSize={fontSizes.xs} fontWeight="bold" textAlign="center">
            R16
          </Text>

          {/* Botão para a semifinal (seta para a direita) */}
          <Button variant="ghost" p={0} onPress={() => navigation.navigate("QuarterFinal" as never)}>
            <VStack alignItems="center">
              <Icon as={MaterialIcons} name="arrow-forward" size={5} color="black" />
              <Text fontSize="8" fontWeight="bold">QF</Text>
            </VStack>
          </Button>
        </HStack>


        <VStack space={4}>
          {games.length === 0 ? (
            <EmptyStateCard
              title="R16"
              message="Aguardando resultados da fase anterior."
              count={4}
            />
          ) : (
            games.map((game) => {
              const score1 = game.qtdGames1 ?? 0;
              const score2 = game.qtdGames2 ?? 0;

              const isBye1 = !game.competitor1?.firstUserName;
              const isBye2 = !game.competitor2?.firstUserName;
              const isSubmitted = score1 > 0 || score2 > 0;
              const isWinner1 = isBye2 || (isSubmitted && score1 > score2);
              const isWinner2 = isBye1 || (isSubmitted && score2 > score1);
              const bothNull = !game.competitor1 && !game.competitor2;

              return (
                <Box key={game.numberGame} p={4} borderWidth={1} borderColor={colors.gray[300]} borderRadius={10} bg="white">
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="xs" fontWeight="bold">#{game.numberGame} • QF</Text>
                    {!isBye1 && !isBye2 ? (
                      game.courtNumber ? (
                        <HStack alignItems="center" space={2} backgroundColor={colors.gray[100]} p={1} px={2} borderRadius={15}>
                          <Text fontSize="xs" color={colors.black}>Quadra: {game.courtNumber}</Text>
                        </HStack>
                      ) : userType === 2 ? (
                        <HStack space={2} alignItems="center">
                          <Input
                            width="60px"
                            value={courtInputs[game.numberGame] || ""}
                            onChangeText={(value) =>
                              setCourtInputs((prev) => ({ ...prev, [game.numberGame]: value }))
                            }
                            keyboardType="numeric"
                            backgroundColor={colors.gray[100]}
                            fontSize="xs"
                          />
                          <Button
                            variant="ghost"
                            p={0}
                            onPress={() =>
                              handleSubmitCourtNumber(game.categoryId!, game.numberGame)
                            }
                          >
                            <Icon as={MaterialIcons} name="arrow-forward" size={6} color="black" />
                          </Button>
                        </HStack>
                      ) : (
                        <HStack alignItems="center" space={2} backgroundColor={colors.gray[100]} p={1} px={2} borderRadius={15}>
                          <Text fontSize="xs" color={colors.black}>Quadra: -</Text>
                        </HStack>
                      )
                    ) : null}
                  </HStack>

                  {bothNull && !game.competitor1Id && !game.competitor2Id ? (
                    <EmptyStateCard
                      title="R16"
                      message="Aguardando resultados da fase anterior."
                      count={4}
                    />
                  ) : (
                    <>
                      {renderPlayer(game.competitor1 ?? null, isWinner1, isBye1, scoreInputs[game.numberGame]?.game1 || game.qtdGames1?.toString() || "", isSubmitted, isBye2, game.numberGame, game.competitor1Id!)}

                      {renderPlayer(game.competitor2 ?? null, isWinner2, isBye2, scoreInputs[game.numberGame]?.game2 || game.qtdGames2?.toString() || "", isSubmitted, isBye1, game.numberGame, game.competitor1Id!)}

                      {!isBye1 && !isBye2 && !isSubmitted && game.competitor1 && game.competitor2 && userType !== 1 && (
                        <Button
                          mt={3}
                          bg={colors.green[500]}
                          borderRadius={20}
                          px={6}
                          py={3}
                          onPress={() => handleSendResults(game)}
                          _pressed={{ opacity: 0.9 }}
                        >
                          <Text color="white" fontWeight="bold">Enviar Resultado</Text>
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              );
            })
          )}
        </VStack>
      </ScrollView>
      <Box
        marginBottom={3}
        marginTop={3}
        px={4}
        alignItems="center">
        {/* Floating buttons */}
        <HStack space={4} justifyContent="center">
          {/* Botão Voltar */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.goBack()}
            p={3}
          >
            <MaterialIcons name="chevron-left" size={28} color="white" />
          </Button>
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
            onPress={() => navigation.navigate("CreateTournament" as never)}
            p={3}
          >
            <MaterialIcons name="emoji-events" size={28} color="white" />
          </Button>

          {/* Botão Meu Perfil */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.navigate("MyProfile" as never)}
            p={3}
          >
            <MaterialIcons name="person" size={28} color="white" />
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}