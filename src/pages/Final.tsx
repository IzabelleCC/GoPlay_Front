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
  Pressable,
  ZStack
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TournamentService } from "../api/tournament/tournamentService";
import { EliminationGameDto, InsertEliminationResultsPayload, CompetitorInfo } from "../api/tournament/tournamentTypes";
import GenericModal from "../components/modals/GenericModal";

export default function Final() {
  const { colors, fontSizes } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<EliminationGameDto[]>([]);
  const [tournamentName, setTournamentName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [modal, setModal] = useState({ isOpen: false, title: "", body: "", type: "info" });
  const [scoreInputs, setScoreInputs] = useState<Record<number, { game1: string; game2: string }>>({});
  const [submittedGames, setSubmittedGames] = useState<number[]>([]);

  const fetchGames = async (categoryId: number) => {
    const data = await TournamentService.getEliminationGamesByCategory(categoryId, 4);
    setGames(data.sort((a, b) => a.numberGame - b.numberGame));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryIdStr = await AsyncStorage.getItem("categoryId");
        const categoryName = await AsyncStorage.getItem("categoryName");
        const tournamentName = await AsyncStorage.getItem("tournamentName");

        setCategoryName(categoryName || "Categoria");
        setTournamentName(tournamentName || "Nome do Torneio");

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

    fetchData();
  }, []);

  const renderDoubleAvatar = () => (
    <ZStack width={10} height={10} mr={3}>
      <Image
        source={{ uri: "https://www.hhcc.co.in/wp-content/plugins/business_reviews/photos/5dd3d47d719e11574163581.png" }}
        alt="Avatar 1"
        borderRadius={50}
        width={10}
        height={10}
        position="absolute"
        left={0}
        zIndex={1}
      />
      <Image
        source={{ uri: "https://www.hhcc.co.in/wp-content/plugins/business_reviews/photos/5dd3d47d719e11574163581.png" }}
        alt="Avatar 2"
        borderRadius={50}
        width={10}
        height={10}
        position="absolute"
        left={8}
        zIndex={0}
      />
    </ZStack>
  );

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
        {renderDoubleAvatar()}
        <VStack ml={3}>
          <Text
            fontWeight="bold"
            color={isBye ? colors.gray[500] : isWinner ? "green.700" : "red.600"}
          >
            {competitor?.firstUserName || "BYE"}
          </Text>
          <Text
            fontWeight="bold"
            color={isBye ? colors.gray[500] : isWinner ? "green.700" : "red.600"}
          >
            {competitor?.secondUserName || ""}
          </Text>
        </VStack>
      </HStack>

      {!isBye && !opponentIsBye && (
        isSubmitted ? (
          <Text
            fontWeight={isWinner ? "bold" : "normal"}
            fontSize="md"
            color={isWinner ? "green.700" : "red.600"}
          >
            {score}
          </Text>
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
    <ScrollView px={4} py={4} mb={8}>
      <GenericModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        body={<Text>{modal.body}</Text>}
        type={modal.type as any}
      />

      <HStack alignItems="center" mb={4}>
        <Image
          source={{ uri: "https://img.favpng.com/4/19/3/beach-tennis-tennis-t-shirt-serve-png-favpng-dsZSu0xit617YDdkPWYfyUuxR.jpg" }}
          alt="Logo"
          borderRadius={6}
          width={75}
          height={75}
          mr={3}
        />
        <VStack maxW="80%">
          <Text fontSize={fontSizes.xl} fontWeight="bold" color={colors.blue[800]}>
            {tournamentName}
          </Text>
          <Text fontSize={fontSizes.md} color={colors.gray[800]} fontWeight="bold">
            {categoryName.toUpperCase()}
          </Text>
        </VStack>
      </HStack>

      <Box position="relative" mb={4}>
        <Pressable position="absolute" left={0} top={0} alignItems="center" onPress={() => navigation.goBack()}>
          <Icon as={MaterialIcons} name="arrow-back" size={6} color="black" />
          <Text fontSize="xs" fontWeight="bold">Voltar</Text>
        </Pressable>
        <Text fontSize={fontSizes.lg} fontWeight="bold" textAlign="center">
          Quartas de Finais
        </Text>
        <VStack position="absolute" right={0} top={0} alignItems="center">
          <Icon as={MaterialIcons} name="arrow-forward" size={6} color="black" />
          <Text fontSize="xs" fontWeight="bold">SF</Text>
        </VStack>
      </Box>

      <VStack space={4}>
        {games.map((game) => {
          const score1 = game.qtdGames1 ?? 0;
          const score2 = game.qtdGames2 ?? 0;

          const isBye1 = !game.competitor1?.firstUserName;
          const isBye2 = !game.competitor2?.firstUserName;
          const isSubmitted = score1 > 0 || score2 > 0;
          const isWinner1 = isBye2 || (isSubmitted && score1 > score2);
          const isWinner2 = isBye1 || (isSubmitted && score2 > score1);
          const bothNull = !game.competitor1 && !game.competitor2;


          return (
            <Box
              key={game.numberGame}
              p={4}
              borderWidth={1}
              borderColor={colors.gray[300]}
              borderRadius={10}
              bg="white"
            >
              <Text fontSize="xs" fontWeight="bold" mb={2}>#{game.numberGame} • QF</Text>

              {bothNull ? (
                <Text color={colors.gray[500]} italic>Aguardando resultados da fase anterior.</Text>
              ) : (
                <>
                  {renderPlayer(
                    game.competitor1 ?? null,
                    isWinner1,
                    isBye1,
                    scoreInputs[game.numberGame]?.game1 || game.qtdGames1?.toString() || "",
                    isSubmitted,
                    isBye2,
                    game.numberGame,
                    game.competitor1Id!
                  )}

                  {renderPlayer(
                    game.competitor2 ?? null,
                    isWinner2,
                    isBye2,
                    scoreInputs[game.numberGame]?.game2 || game.qtdGames2?.toString() || "",
                    isSubmitted,
                    isBye1,
                    game.numberGame,
                    game.competitor1Id!
                  )}


                  {!isBye1 && !isBye2 && !isSubmitted && game.competitor1 && game.competitor2 && (
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
        })}
      </VStack>

      <Center mt={8} mb={4}>
        <Button
          bg={colors.blue[500]}
          borderRadius={20}
          px={6}
          py={3}
          onPress={() => navigation.goBack()}
          _pressed={{ opacity: 0.9 }}
        >
          <Text color="white" fontWeight="bold">Voltar</Text>
        </Button>
      </Center>
    </ScrollView>
  );
}