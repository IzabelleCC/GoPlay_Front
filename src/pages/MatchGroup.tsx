// IMPORTS
import {
    VStack, Image, Text, useTheme, ScrollView, Center, Box,
    HStack, Divider, Button, Spinner, ZStack, Icon, Input
} from "native-base";
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CategoryPlayerService } from "../api/categoryPlayer/categoryPlayerService";
import { TournamentMatchesResultDto, GroupResultDto } from "../api/categoryPlayer/categoryPlayerTypes";
import { MaterialIcons } from "@expo/vector-icons";
import { TournamentService } from "../api/tournament/tournamentService";
import GenericModal from "../components/modals/GenericModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MatchGroup() {
    const { colors, fontSizes } = useTheme();
    const navigation: any = useNavigation();
    const route = useRoute<any>();
    const { categoryId } = route.params;
    const [matchGroupData, setMatchGroupData] = useState<TournamentMatchesResultDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [groupMatchScores, setGroupMatchScores] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState<React.ReactNode>(null);
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [submittedGroups, setSubmittedGroups] = useState<number[]>([]);
    const [groupResults, setGroupResults] = useState<{ [key: number]: GroupResultDto[] }>({});
    const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
    const [userType, setUserType] = useState<number | null>(null);

    useEffect(() => {
        fetchGroups();
        fetchUserType();
    }, []);

    const fetchUserType = async () => {
        const storedType = await AsyncStorage.getItem("userType");
        if (storedType) {
            setUserType(Number(storedType));
        }
    };

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const data = await CategoryPlayerService.getMatchGroupsByCategoryId(categoryId);
            setMatchGroupData(data);

            const initialScores: any = {};
            const allGroupResults: { [key: number]: GroupResultDto[] } = {};
            const groupsWithResult: number[] = [];

            for (const groupItem of data.groups) {
                for (const groupDto of groupItem.groups.sort((a, b) => a.groupNumber - b.groupNumber)) {
                    const groupNumber = groupDto.groupNumber;
                    const matches = generateMatches(groupDto.players);
                    initialScores[groupNumber] = [];

                    for (let i = 0; i < matches.length; i++) {
                        initialScores[groupNumber].push({ team1Score: "", team2Score: "" });
                    }

                    const results = await CategoryPlayerService.getGroupResultByCategoryIdAndGroupNumber(
                        groupItem.categoryId, groupNumber
                    );

                    allGroupResults[groupNumber] = results;

                    let hasAnyResult = false;
                    for (let i = 0; i < matches.length; i++) {
                        const [player1, player2] = matches[i];
                        const player1Result = results.find(r => r.registrationCategoryId === player1.id);
                        const player2Result = results.find(r => r.registrationCategoryId === player2.id);

                        const key = `game${i + 1}` as keyof GroupResultDto;
                        const score1 = player1Result?.[key];
                        const score2 = player2Result?.[key];

                        if (score1 != null || score2 != null) hasAnyResult = true;

                        initialScores[groupNumber][i] = {
                            team1Score: score1 != null ? String(score1) : "",
                            team2Score: score2 != null ? String(score2) : ""
                        };
                    }

                    if (hasAnyResult) groupsWithResult.push(groupNumber);
                }
            }

            setGroupMatchScores(initialScores);
            setGroupResults(allGroupResults);
            setSubmittedGroups(groupsWithResult);
        } catch (error) {
            console.error("Erro ao carregar grupos e resultados", error);
        } finally {
            setLoading(false);
        }
    };

    const generateMatches = (players: any[]) => {
        const matches = [];
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                matches.push([players[i], players[j]]);
            }
        }
        return matches;
    };

    const renderDoubleAvatar = () => (
        <ZStack width={10} height={10} mr={3}>
            <Image
                source={{ uri: "https://www.hhcc.co.in/wp-content/plugins/business_reviews/photos/5dd3d47d719e11574163581.png" }}
                alt="Avatar 1" borderRadius={50} width={10} height={10} position="absolute" left={0} zIndex={1}
            />
            <Image
                source={{ uri: "https://www.hhcc.co.in/wp-content/plugins/business_reviews/photos/5dd3d47d719e11574163581.png" }}
                alt="Avatar 2" borderRadius={50} width={10} height={10} position="absolute" left={8} zIndex={0}
            />
        </ZStack>
    );

    const handleScoreChange = (
        groupNumber: number,
        matchIndex: number,
        teamKey: "team1Score" | "team2Score",
        value: string
    ) => {
        const newScores = { ...groupMatchScores };
        newScores[groupNumber][matchIndex][teamKey] = value;
        setGroupMatchScores(newScores);
    };

    const handleSubmitGroupResults = async (groupDto: any) => {
        try {
            setIsSubmitting(true);
            const matches = generateMatches(groupDto.players);
            const scores = groupMatchScores[groupDto.groupNumber];
            const payload = groupDto.players.map((player: any) => {
                const item: any = {
                    registrationCategoryId: player.id,
                    game1: null, game2: null, game3: null, game4: null, game5: null,
                };
                matches.forEach((match: any, index: number) => {
                    const field = `game${index + 1}`;
                    if (match[0].id === player.id && scores[index].team1Score !== "")
                        item[field] = Number(scores[index].team1Score);
                    if (match[1].id === player.id && scores[index].team2Score !== "")
                        item[field] = Number(scores[index].team2Score);
                });
                return item;
            });
            await TournamentService.insertGroupResults(payload);
            setModalTitle("Sucesso");
            setModalBody(<Text>Resultados enviados com sucesso!</Text>);
            setModalType("success");
            setIsModalOpen(true);
        } catch {
            setModalTitle("Erro");
            setModalBody(<Text>Erro ao enviar resultados.</Text>);
            setModalType("error");
            setIsModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }

        const results = await CategoryPlayerService.getGroupResultByCategoryIdAndGroupNumber(
            groupDto.categoryId, groupDto.groupNumber
        );
        setGroupResults((prev) => ({
            ...prev,
            [groupDto.groupNumber]: results.sort((a, b) => a.position - b.position),
        }));
        setSubmittedGroups((prev) => [...prev, groupDto.groupNumber]);
    };

    const toggleGroupExpand = (groupNumber: number) => {
        setExpandedGroups((prev) =>
            prev.includes(groupNumber)
                ? prev.filter((g) => g !== groupNumber)
                : [...prev, groupNumber]
        );
    };

    return (
        <Box flex={1} bg={colors.white}>
            <ScrollView p={4} bg={colors.white} flex={1}>
                {loading ? (
                    <Center flex={1}>
                        <Spinner color={colors.blue[500]} />
                        <Text mt={2}>Carregando...</Text>
                    </Center>
                ) : (
                    <>
                        <HStack alignItems="center" mb={4}>
                            <Image source={{ uri: "https://img.favpng.com/4/19/3/beach-tennis-tennis-t-shirt-serve-png-favpng-dsZSu0xit617YDdkPWYfyUuxR.jpg" }}
                                alt="Logo" borderRadius={6} width={75} height={75} mr={3}
                            />
                            <VStack maxW="80%">
                                <Text fontSize={fontSizes.xl} fontWeight="bold" color={colors.blue[800]}>
                                    {matchGroupData?.tournamentName || "Nome do Torneio"}
                                </Text>
                                <Text fontSize={fontSizes.md} color={colors.gray[800]} fontWeight="bold">
                                    {matchGroupData?.groups[0]?.categoryName?.toUpperCase() || "Categoria"}
                                </Text>
                            </VStack>
                        </HStack>

                        <Box position="relative" mb={4}>
                            <Text fontSize={fontSizes.lg} fontWeight="bold" textAlign="center">
                                Fase de Grupos
                            </Text>
                            <VStack position="absolute" right={0} top={0} alignItems="center">
                                <Button
                                    variant="ghost"
                                    p={0}
                                    onPress={async () => {
                                        if (matchGroupData?.groups?.[0]) {
                                            await AsyncStorage.setItem("categoryId", String(matchGroupData.groups[0].categoryId));
                                            await AsyncStorage.setItem("categoryName", matchGroupData.groups[0].categoryName);
                                            await AsyncStorage.setItem("tournamentName", matchGroupData.tournamentName);

                                            const totalGroups = matchGroupData.groups[0].groups.length;
                                            let nextPage = "QuarterFinal";

                                            if (totalGroups === 1) nextPage = "Final";
                                            else if (totalGroups === 2) nextPage = "SemiFinal";
                                            else if (totalGroups > 2 && totalGroups <= 4) nextPage = "QuarterFinal";
                                            else if (totalGroups > 4 && totalGroups <= 8) nextPage = "RoundOf16";
                                            else if (totalGroups > 8 && totalGroups <= 16) nextPage = "RoundOf32";

                                            navigation.navigate(nextPage);
                                        }
                                    }}
                                >
                                    <VStack alignItems="center">
                                        <Icon as={MaterialIcons} name="arrow-forward" size={6} color="black" />
                                        <Text fontSize="xs" fontWeight="bold">
                                            {(() => {
                                                const groupCount = matchGroupData?.groups?.[0]?.groups?.length ?? 0;
                                                if (groupCount === 1) return "Final";
                                                if (groupCount === 2) return "SF";
                                                if (groupCount <= 4) return "QF";
                                                if (groupCount <= 8) return "R16";
                                                return "R32";
                                            })()}
                                        </Text>
                                    </VStack>
                                </Button>
                            </VStack>
                        </Box>

                        {matchGroupData?.groups.flatMap(groupItem =>
                            groupItem.groups.sort((a, b) => a.groupNumber - b.groupNumber).map((groupDto) => {
                                const isExpanded = expandedGroups.includes(groupDto.groupNumber);
                                const isFinished = submittedGroups.includes(groupDto.groupNumber);

                                return (
                                    <Box key={groupDto.groupNumber} mb={6} p={4} borderRadius={10} bg="white" shadow={1}>
                                        <HStack justifyContent="space-between" alignItems="center" mb={2}>
                                            <Text fontWeight="bold" color={colors.blue[800]}>
                                                GRUPO {groupDto.groupNumber}
                                            </Text>
                                            <HStack alignItems="center" space={2} backgroundColor={colors.gray[100]} p={2} borderRadius={8}>
                                                <Text fontSize="xs" color={colors.black}>N° Quadra</Text>
                                                <Icon as={MaterialIcons} name="arrow-forward" size={5} color="black" />
                                            </HStack>
                                        </HStack>

                                        {[...groupDto.players]
                                            .sort((a, b) => {
                                                const results = groupResults[groupDto.groupNumber] || [];
                                                const posA = results.find(r => r.registrationCategoryId === a.id)?.position ?? Infinity;
                                                const posB = results.find(r => r.registrationCategoryId === b.id)?.position ?? Infinity;
                                                return posA - posB;
                                            })
                                            .map((player: any, index: number) => (
                                                <HStack key={player.id} justifyContent="space-between" mb={2}>
                                                    <HStack space={8} alignItems="center" flex={1}>
                                                        {renderDoubleAvatar()}
                                                        <VStack>
                                                            <Text>{player.firstUserName}</Text>
                                                            <Text>{player.secondUserName}</Text>
                                                        </VStack>
                                                    </HStack>
                                                    <Text fontWeight="bold">{index + 1}º</Text>
                                                </HStack>
                                            ))}

                                        <Divider bg={colors.gray[300]} my={3} />

                                        <Text
                                            fontSize="xs"
                                            color="blue.700"
                                            underline
                                            mb={2}
                                            onPress={() => toggleGroupExpand(groupDto.groupNumber)}
                                        >
                                            {isFinished
                                                ? `Os jogos do Grupo ${groupDto.groupNumber} estão concluídos.`
                                                : `Os jogos do Grupo ${groupDto.groupNumber} ainda não foram finalizados.`}{" "}
                                            {isExpanded ? "Ocultar" : "Visualizar"}
                                        </Text>

                                        {isExpanded && (
                                            <>
                                                {generateMatches(groupDto.players).map((match, matchIndex) => {
                                                    const team1Score = groupMatchScores[groupDto.groupNumber]?.[matchIndex]?.team1Score;
                                                    const team2Score = groupMatchScores[groupDto.groupNumber]?.[matchIndex]?.team2Score;

                                                    return (
                                                        <Box key={matchIndex} mb={3}>
                                                            <Text fontWeight="bold">Jogo #{matchIndex + 1}</Text>
                                                            <Text fontSize="xs" color={colors.gray[500]}>
                                                                Fase de grupos - G{groupDto.groupNumber}
                                                            </Text>

                                                            {/* Equipe 1 */}
                                                            <HStack justifyContent="space-between" mt={2}>
                                                                <HStack space={8} flex={1} alignItems="center">
                                                                    {renderDoubleAvatar()}
                                                                    <VStack>
                                                                        <Text>{match[0].firstUserName}</Text>
                                                                        <Text>{match[0].secondUserName}</Text>
                                                                    </VStack>
                                                                </HStack>

                                                                {submittedGroups.includes(groupDto.groupNumber) ? (
                                                                    <Text fontWeight="bold" fontSize="md">{team1Score || "-"}</Text>
                                                                ) : (
                                                                    <Input
                                                                        placeholder=""
                                                                        width="15%"
                                                                        keyboardType="numeric"
                                                                        backgroundColor={colors.gray[50]}
                                                                        value={team1Score}
                                                                        onChangeText={(value) =>
                                                                            handleScoreChange(groupDto.groupNumber, matchIndex, "team1Score", value)
                                                                        }
                                                                    />
                                                                )}
                                                            </HStack>

                                                            {/* Equipe 2 */}
                                                            <HStack justifyContent="space-between" mt={2}>
                                                                <HStack space={8} flex={1} alignItems="center">
                                                                    {renderDoubleAvatar()}
                                                                    <VStack>
                                                                        <Text>{match[1].firstUserName}</Text>
                                                                        <Text>{match[1].secondUserName}</Text>
                                                                    </VStack>
                                                                </HStack>

                                                                {submittedGroups.includes(groupDto.groupNumber) ? (
                                                                    <Text fontWeight="bold" fontSize="md">{team2Score || "-"}</Text>
                                                                ) : (
                                                                    <Input
                                                                        placeholder=""
                                                                        width="15%"
                                                                        keyboardType="numeric"
                                                                        backgroundColor={colors.gray[50]}
                                                                        value={team2Score}
                                                                        onChangeText={(value) =>
                                                                            handleScoreChange(groupDto.groupNumber, matchIndex, "team2Score", value)
                                                                        }
                                                                    />
                                                                )}
                                                            </HStack>

                                                            <Center mt={2}>
                                                                <Text
                                                                    color={
                                                                        submittedGroups.includes(groupDto.groupNumber)
                                                                            ? parseInt(team1Score) > parseInt(team2Score)
                                                                                ? "green.700"
                                                                                : parseInt(team2Score) > parseInt(team1Score)
                                                                                    ? "green.700"
                                                                                    : "red.500"
                                                                            : "red.500"
                                                                    }
                                                                    fontWeight="bold"
                                                                >
                                                                    {submittedGroups.includes(groupDto.groupNumber)
                                                                        ? parseInt(team1Score) > parseInt(team2Score)
                                                                            ? `Venc.: ${match[0].firstUserName}`
                                                                            : parseInt(team2Score) > parseInt(team1Score)
                                                                                ? `Venc.: ${match[1].firstUserName}`
                                                                                : "Empate"
                                                                        : "Placar Pendente"}
                                                                </Text>
                                                            </Center>
                                                        </Box>
                                                    );
                                                })}

                                                {!submittedGroups.includes(groupDto.groupNumber) && (
                                                    <Button
                                                        mt={2}
                                                        bg="green.500"
                                                        borderRadius={20}
                                                        onPress={() => handleSubmitGroupResults(groupDto)}
                                                        isLoading={isSubmitting}
                                                    >
                                                        <Text color="white" fontWeight="bold">Enviar Resultado do Grupo</Text>
                                                    </Button>
                                                )}
                                            </>
                                        )}


                                    </Box>
                                );
                            })
                        )}
                    </>
                )}

                <GenericModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        fetchGroups();
                    }}
                    title={modalTitle}
                    body={modalBody}
                    type={modalType}
                />
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
                        onPress={() => navigation.goBack()}
                        p={3}
                    >
                        <MaterialIcons name="home" size={28} color="white" />
                    </Button>

                    {/* Botão Criar Torneio */}
                    <Button
                        borderRadius="full"
                        bg={colors.blue[500]}
                        onPress={() => navigation.navigate("CreateTournament")}
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
