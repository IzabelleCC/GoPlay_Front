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
  } from "native-base";
  import { MaterialIcons } from "@expo/vector-icons";
  import { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { TournamentService } from "../api/tournament/tournamentService";
  import { EliminationGameDto } from "../api/tournament/tournamentTypes";
  
  export default function QuarterFinal() {
    const { colors, fontSizes } = useTheme();
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState<EliminationGameDto[]>([]);
    const [tournamentName, setTournamentName] = useState("");
    const [categoryName, setCategoryName] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const categoryId = await AsyncStorage.getItem("categoryId");
          const categoryName = await AsyncStorage.getItem("categoryName");
          const tournamentName = await AsyncStorage.getItem("tournamentName");
  
          setCategoryName(categoryName || "Categoria");
          setTournamentName(tournamentName || "Nome do Torneio");
  
          if (categoryId) {
            const data = await TournamentService.getEliminationGamesByCategory(Number(categoryId), 4);
            setGames(data.sort((a, b) => a.numberGame - b.numberGame));
          }
        } catch (err) {
          console.error("Erro ao buscar dados:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const renderPlayer = (
      competitor: EliminationGameDto["competitor1"],
      isWinner: boolean,
      isBye: boolean
    ) => {
      return (
        <HStack alignItems="center" space={2} mb={1}>
          <Image
            source={{
              uri: isBye
                ? "https://upload.wikimedia.org/wikipedia/commons/5/55/X_symbol.svg"
                : "https://i.pravatar.cc/100?u=" + competitor.firstUserId,
            }}
            alt="avatar"
            width={8}
            height={8}
            borderRadius={50}
          />
          <VStack flex={1}>
            <Text
              fontWeight="bold"
              color={isBye ? colors.gray[500] : isWinner ? "green.700" : "red.600"}
            >
              {competitor.firstUserName || "BYE"}
            </Text>
            <Text
              fontWeight="bold"
              color={isBye ? colors.gray[500] : isWinner ? "green.700" : "red.600"}
            >
              {competitor.secondUserName || ""}
            </Text>
          </VStack>
          {!isBye && (
            <Icon
              as={MaterialIcons}
              name={isWinner ? "check-circle" : "cancel"}
              size={5}
              color={isWinner ? "green.600" : "red.600"}
            />
          )}
        </HStack>
      );
    };
  
    if (loading) {
      return (
        <Center flex={1}>
          <Spinner size="lg" color={colors.blue[800]} />
        </Center>
      );
    }
  
    return (
      <ScrollView px={4} py={4}>
        {/* Cabeçalho com logo, nome do torneio e categoria */}
        <HStack alignItems="center" mb={4}>
          <Image
            source={{
              uri: "https://img.favpng.com/4/19/3/beach-tennis-tennis-t-shirt-serve-png-favpng-dsZSu0xit617YDdkPWYfyUuxR.jpg",
            }}
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
  
        {/* Título da fase e seta para SF */}
        <Box position="relative" mb={4}>
          <Text fontSize={fontSizes.lg} fontWeight="bold" textAlign="center">
            Quartas de Finais
          </Text>
          <VStack position="absolute" right={0} top={0} alignItems="center">
            <Icon as={MaterialIcons} name="arrow-forward" size={6} color="black" />
            <Text fontSize="xs" fontWeight="bold">
              SF
            </Text>
          </VStack>
        </Box>
  
        {/* Lista dos jogos */}
        <VStack space={4}>
          {games.map((game) => {
            const isCompetitor1Bye = !game.competitor1?.firstUserName;
            const isCompetitor2Bye = !game.competitor2?.firstUserName;
            const isCompetitor1Winner = game.result === game.competitor1Id;
            const isCompetitor2Winner = game.result === game.competitor2Id;
  
            return (
              <Box
                key={game.numberGame}
                p={4}
                borderWidth={1}
                borderColor={colors.gray[300]}
                borderRadius={10}
                bg="white"
              >
                <Text fontSize="xs" fontWeight="bold" mb={2}>
                  #{game.numberGame} • QF
                </Text>
  
                {renderPlayer(game.competitor1, isCompetitor1Winner, isCompetitor1Bye)}
                <Text fontSize="xs" ml={10} mb={2}>
                  {game.qtdGames1 ?? "-"}
                </Text>
  
                {renderPlayer(game.competitor2, isCompetitor2Winner, isCompetitor2Bye)}
                <Text fontSize="xs" ml={10}>
                  {game.qtdGames2 ?? "-"}
                </Text>
  
                {game.matchTime && (
                  <Text mt={2} fontSize="xs" color="gray.600">
                    {new Date(game.matchTime).toLocaleString("pt-BR")}
                  </Text>
                )}
              </Box>
            );
          })}
        </VStack>
      </ScrollView>
    );
  }
  