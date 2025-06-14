import {
    VStack,
    Image,
    Text,
    useTheme,
    ScrollView,
    Center,
    Box,
    HStack,
    Divider,
    Button,
    Spinner,
    ZStack,
    Icon,
    Input,
} from "native-base";
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CategoryPlayerService } from "../api/categoryPlayer/categoryPlayerService";
import { TournamentMatchesResultDto } from "../api/categoryPlayer/categoryPlayerTypes";
import { MaterialIcons } from "@expo/vector-icons";
import { TournamentService } from "../api/tournament/tournamentService";
import GenericModal from "../components/modals/GenericModal";

type GameFields = {
    game1: string;
    game2: string;
    game3: string;
    game4: string;
    game5: string;
    [key: string]: string;
};

type GameFieldKey = "game1" | "game2" | "game3" | "game4" | "game5";

export default function MatchGroup() {
    const { colors, fontSizes } = useTheme();
    const navigation: any = useNavigation();
    const route = useRoute<any>();
    const { categoryId } = route.params;

    const [matchGroupData, setMatchGroupData] = useState<TournamentMatchesResultDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [quadras, setQuadras] = useState<{ [key: number]: number }>({});
    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    const [groupMatchScores, setGroupMatchScores] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState<React.ReactNode>(null);
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [submittedGroups, setSubmittedGroups] = useState<number[]>([]);


    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const data = await CategoryPlayerService.getMatchGroupsByCategoryId(categoryId);
            setMatchGroupData(data);
            const initialScores: any = {};
            data.groups.forEach((groupItem) => {
                groupItem.groups.forEach((groupDto) => {
                    initialScores[groupDto.groupNumber] = [];
                    const matches = generateMatches(groupDto.players);
                    for (let i = 0; i < matches.length; i++) {
                        initialScores[groupDto.groupNumber].push({ team1Score: "", team2Score: "" });
                    }
                });
            });
            setGroupMatchScores(initialScores);
        } catch (error) {
            console.error("Erro ao carregar grupos", error);
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

    const handleScoreChange = (groupNumber: number, matchIndex: number, teamKey: "team1Score" | "team2Score", value: string) => {
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
                    game1: null,
                    game2: null,
                    game3: null,
                    game4: null,
                    game5: null,
                };
                matches.forEach((match: any, index: number) => {
                    const field = `game${index + 1}`;
                    if (match[0].id === player.id && scores[index].team1Score !== "") item[field] = Number(scores[index].team1Score);
                    if (match[1].id === player.id && scores[index].team2Score !== "") item[field] = Number(scores[index].team2Score);
                });
                return item;
            });
            await TournamentService.insertGroupResults(payload);
            setModalTitle("Sucesso");
            setModalBody(<Text>Resultados enviados com sucesso!</Text>);
            setModalType("success");
            setIsModalOpen(true);
        } catch (err) {
            setModalTitle("Erro");
            setModalBody(<Text>Erro ao enviar resultados.</Text>);
            setModalType("error");
            setIsModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
        setSubmittedGroups((prev) => [...prev, groupDto.groupNumber]);
    };

    return (
        <ScrollView p={4} bg={colors.white} flex={1}>
            {loading ? (
                <Center flex={1}>
                    <Spinner color={colors.blue[500]} />
                    <Text mt={2}>Carregando...</Text>
                </Center>
            ) : (
                <>
                    <HStack alignItems="center" mb={4}>
                        <Image
                            source={{ uri: "https://img.favpng.com/4/19/3/beach-tennis-tennis-t-shirt-serve-png-favpng-dsZSu0xit617YDdkPWYfyUuxR.jpg" }}
                            alt="Logo"
                            borderRadius={6}
                            width={60}
                            height={60}
                            mr={3}
                        />
                        <VStack>
                            <Text fontSize={fontSizes.xl} fontWeight="bold" color={colors.blue[800]}>
                                {matchGroupData?.tournamentName || "Nome do Torneio"}
                            </Text>
                            <Text fontSize={fontSizes.lg} color={colors.gray[800]} fontWeight="bold">
                                {matchGroupData?.groups[0]?.categoryName?.toUpperCase() || "Categoria"}
                            </Text>
                        </VStack>
                    </HStack>

                    <HStack justifyContent="space-between" alignItems="center" mb={4}>
                        <Text fontSize={fontSizes.lg} fontWeight="bold">Fase de Grupos</Text>
                        <VStack alignItems="center">
                            <Icon as={MaterialIcons} name="arrow-forward" size={6} color="black" />
                            <Text fontSize="xs" fontWeight="bold">QF</Text>
                        </VStack>
                    </HStack>

                    {matchGroupData?.groups.map((groupItem) =>
                        groupItem.groups.map((groupDto) => (
                            <Box key={groupDto.groupNumber} mb={6} p={4} borderRadius={10} bg="white" shadow={1}>
                                <HStack justifyContent="space-between" alignItems="center" mb={2}>
                                    <Text fontWeight="bold" color={colors.blue[800]}>GRUPO {groupDto.groupNumber}</Text>
                                    <HStack alignItems="center" space={2} backgroundColor={colors.gray[100]} p={2} borderRadius={8}>
                                        <Text fontSize="xs" color={colors.black}>
                                            N° Quadra
                                        </Text>
                                        <Icon as={MaterialIcons} name="arrow-forward" size={5} color="black" />
                                    </HStack>
                                </HStack>

                                {groupDto.players.map((player: any, index: number) => {
                                    const isOpen = expandedIds.includes(player.id);
                                    return (
                                        <Box key={player.id} mb={2}>
                                            <HStack justifyContent="space-between" alignItems="center">
                                                <HStack space={8} alignItems="center" flex={1}>
                                                    {renderDoubleAvatar()}
                                                    <VStack>
                                                        <Text>{player.firstUserName}</Text>
                                                        <Text>{player.secondUserName}</Text>
                                                    </VStack>
                                                </HStack>
                                                <VStack alignItems="flex-end">
                                                    <Text fontWeight="bold">{index + 1}º</Text>
                                                    <Text fontSize="xs" underline color={isOpen ? "red.500" : "blue.600"} onPress={() => {
                                                        setExpandedIds((prev) =>
                                                            prev.includes(player.id)
                                                                ? prev.filter((id) => id !== player.id)
                                                                : [...prev, player.id]
                                                        );
                                                    }}>
                                                        {isOpen ? "fechar" : "ver infos"}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                            {isOpen && (
                                                <Box bg={colors.gray[100]} mt={2} p={3} borderRadius={8}>
                                                    <HStack justifyContent="space-between" mb={2}>
                                                        <VStack alignItems="center">
                                                            <Text bold>0</Text>
                                                            <Text fontSize="xs">Jogos</Text>
                                                        </VStack>
                                                        <VStack alignItems="center">
                                                            <Text bold>0</Text>
                                                            <Text fontSize="xs">Vitórias</Text>
                                                        </VStack>
                                                        <VStack alignItems="center">
                                                            <Text bold>0</Text>
                                                            <Text fontSize="xs">Derrotas</Text>
                                                        </VStack>
                                                    </HStack>
                                                    <HStack justifyContent="space-between">
                                                        <VStack alignItems="center">
                                                            <Text bold>0 / 0</Text>
                                                            <Text fontSize="xs">Sets</Text>
                                                        </VStack>
                                                        <VStack alignItems="center">
                                                            <Text bold>0 / 0</Text>
                                                            <Text fontSize="xs">Games</Text>
                                                        </VStack>
                                                        <VStack alignItems="center">
                                                            <Text bold>0 / 0</Text>
                                                            <Text fontSize="xs">Tiebreaks</Text>
                                                        </VStack>
                                                    </HStack>
                                                </Box>
                                            )}
                                        </Box>
                                    );
                                })}

                                <Divider bg={colors.gray[300]} my={3} />

                                {generateMatches(groupDto.players).map((match, matchIndex) => (
                                    <Box key={matchIndex} mb={3}>
                                        <Text fontWeight="bold">Jogo #{matchIndex + 1}</Text>
                                        <Text fontSize="xs" color={colors.gray[500]}>Fase de grupos - G{groupDto.groupNumber}</Text>
                                        <Text mt={1} color="red.500" fontWeight="bold">Placar Pendente</Text>
                                        <HStack justifyContent="space-between" mt={2}>
                                            <HStack space={8} flex={1} alignItems="center">
                                                {renderDoubleAvatar()}
                                                <VStack>
                                                    <Text>{match[0].firstUserName}</Text>
                                                    <Text>{match[0].secondUserName}</Text>
                                                </VStack>
                                            </HStack>
                                            {submittedGroups.includes(groupDto.groupNumber) ? (
                                                <Text fontWeight="bold" fontSize="md" color={colors.black}>
                                                    {groupMatchScores[groupDto.groupNumber]?.[matchIndex]?.team1Score || "-"}
                                                </Text>
                                            ) : (
                                                <Input
                                                    placeholder=""
                                                    width="15%"
                                                    keyboardType="numeric"
                                                    backgroundColor={colors.gray[50]}
                                                    value={groupMatchScores[groupDto.groupNumber]?.[matchIndex]?.team1Score || ""}
                                                    onChangeText={(value) =>
                                                        handleScoreChange(groupDto.groupNumber, matchIndex, "team1Score", value)
                                                    }
                                                />
                                            )}

                                        </HStack>

                                        <HStack justifyContent="space-between" mt={2}>
                                            <HStack space={8} flex={1} alignItems="center">
                                                {renderDoubleAvatar()}
                                                <VStack>
                                                    <Text>{match[1].firstUserName}</Text>
                                                    <Text>{match[1].secondUserName}</Text>
                                                </VStack>
                                            </HStack>
                                            {submittedGroups.includes(groupDto.groupNumber) ? (
                                                <Text fontWeight="bold" fontSize="md" color={colors.black}>
                                                    {groupMatchScores[groupDto.groupNumber]?.[matchIndex]?.team2Score || "-"}
                                                </Text>
                                            ) : (
                                                <Input
                                                    placeholder=""
                                                    width="15%"
                                                    keyboardType="numeric"
                                                    backgroundColor={colors.gray[50]}
                                                    value={groupMatchScores[groupDto.groupNumber]?.[matchIndex]?.team2Score || ""}
                                                    onChangeText={(value) =>
                                                        handleScoreChange(groupDto.groupNumber, matchIndex, "team2Score", value)
                                                    }
                                                />
                                            )}

                                        </HStack>


                                    </Box>
                                ))}

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
                            </Box>
                        ))
                    )}

                    <Center mt={6} mb={8}>
                        <Button bg={colors.blue[500]} borderRadius={20} px={6} py={3} onPress={() => navigation.goBack()} _pressed={{ opacity: 0.9 }}>
                            <Text color="white" fontWeight="bold">Voltar</Text>
                        </Button>
                    </Center>
                </>
            )}

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                body={modalBody}
                type={modalType}
            />
        </ScrollView>
    );
}
