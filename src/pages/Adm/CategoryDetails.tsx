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
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { TournamentService } from "../../api/tournament/tournamentService";
import dayjs from "dayjs";
import BadgeStatus from "../../components/BadgeStatus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserService } from "../../api/user/userService";
import GenericModal from "../../components/modals/GenericModal";

export default function CategoryDetails() {
    const { colors, fontSizes } = useTheme();
    const navigation: any = useNavigation();
    const route = useRoute<any>();
    const { tournamentId, tournamentName } = route.params;
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [tournamentEndDate, setTournamentEndDate] = useState<string>("");
    const [tournamentStatus, setTournamentStatus] = useState<number>(0);
    const [userType, setUserType] = useState<number | null>(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
    const [tournamentPictureUrl, setTournamentPictureUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState<React.ReactNode>(null);
    const [modalType, setModalType] = useState<"success" | "error">("success");


    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await TournamentService.getTournamentById(tournamentId);

            setCategories(data.categories || []);
            setTournamentEndDate(data.gamesEndDate || "");
            setTournamentStatus(data.status || 0);
            setTournamentPictureUrl(data.tournamentPictureUrl || null);
            console.log("url da imagem do torneio:", data.tournamentPictureUrl);
        } catch (err) {
            console.error("Erro ao buscar categorias do torneio", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return dayjs(dateStr).format("DD/MM/YYYY");
    };

    const getCategoryTypeBadge = (isDoubles: boolean) => {
        return isDoubles ? "Duplas" : "Simples";
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

    const handleGenerateMatches = async () => {
        try {
            await TournamentService.generateGroupMatches(tournamentId);

            setModalTitle("Sucesso");
            setModalBody(<Text>Chaves geradas com sucesso!</Text>);
            setModalType("success");
            setIsModalOpen(true);

            // Atualizar status após gerar
            await fetchCategories();
        } catch (err) {
            console.error("Erro ao gerar chaves", err);
            setModalTitle("Erro");
            setModalBody(<Text>Erro ao gerar chaves. Tente novamente.</Text>);
            setModalType("error");
            setIsModalOpen(true);
        }
    };

    const fetchUserType = async () => {
        const storedType = await AsyncStorage.getItem("userType");
        if (storedType) {
            setUserType(Number(storedType));
        }
    };

    const loadUserProfilePicture = async () => {
        try {
            const userName = await AsyncStorage.getItem("userName");
            if (userName) {
                const user = await UserService.getUserByUserName(userName);
                setProfilePictureUrl(user.profilePictureUrl);
            }
        } catch (err) {
            console.error("Erro ao carregar imagem do usuário:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchUserType();
        loadUserProfilePicture();
    }, []);

    return (
        <Box flex={1} bg={colors.white}>
            <ScrollView flex={1} bg={colors.white} p={4}>
                {/* Header com imagem e nome do torneio */}
                <VStack alignItems="center" mb={6}>
                    <Image
                        source={{
                            uri: profilePictureUrl || "https://th.bing.com/th/id/R.8d14cc1312617df21d21e59fc9fe28c9?rik=UZHtrtuEClfMtw&pid=ImgRaw&r=0",
                        }}
                        alt="Imagem Adm Torneio"
                        borderRadius={6}
                        width={500}
                        height={150}
                        mb={3}
                    />
                    <Text fontSize={fontSizes.lg} fontWeight="bold" textAlign="center">
                        {tournamentName}
                    </Text>
                    {tournamentEndDate && (
                        <Text color={colors.gray[600]} fontSize={fontSizes.sm} mt={1}>
                            Início em {formatDate(tournamentEndDate)}
                        </Text>
                    )}

                    {/* Botão Gerar Chaves */}
                    {tournamentStatus === 2 && (
                        <Button
                            mt={4}
                            bg={colors.green[500]}
                            borderRadius={20}
                            px={6}
                            py={3}
                            onPress={handleGenerateMatches}
                            _pressed={{ opacity: 0.9 }}
                        >
                            <Text color="white" fontWeight="bold">
                                Gerar Chaves
                            </Text>
                        </Button>
                    )}
                </VStack>

                {loading ? (
                    <Center flex={1}>
                        <Spinner size="lg" color={colors.blue[500]} />
                        <Text mt={4} color={colors.black}>
                            Carregando categorias...
                        </Text>
                    </Center>
                ) : categories.length === 0 ? (
                    <Text textAlign="center" color={colors.black}>
                        Nenhuma categoria encontrada.
                    </Text>
                ) : (
                    <VStack space={4} mb={4}>
                        {categories.map((cat) => (
                            <Box
                                key={cat.id}
                                p={4}
                                bg={colors.white}
                                borderRadius={10}
                                shadow={1}
                                borderWidth={1}
                                borderColor={colors.gray[200]}
                            >
                                <HStack space={3} alignItems="center" mb={2}>
                                    <Image
                                        source={{
                                            uri: tournamentPictureUrl || "https://res.cloudinary.com/dqj6qbp0s/image/upload/v1750301894/goplay/users/zuxqmczwestyzzn0t6xp.png",
                                        }}
                                        alt="Imagem Torneio"
                                        borderRadius={70}
                                        width={70}
                                        height={70}
                                    />
                                    <VStack flex={1}>
                                        <Text
                                            fontWeight="bold"
                                            fontSize={fontSizes.md}
                                            color={colors.blue[800]}

                                        >
                                            {cat.categoryType}
                                        </Text>
                                        <Text color={colors.gray[600]} fontSize={fontSizes.xs}>
                                            Termina em {formatDate(tournamentEndDate)}
                                        </Text>
                                    </VStack>
                                </HStack>

                                <HStack space={2} flexWrap="wrap" mb={2} alignItems="center">
                                    {/* Tipo (Duplas/Simples) */}
                                    <BadgeStatus
                                        label={getCategoryTypeBadge(cat.isDoubles)}
                                        bgColor={colors.gray[200]}
                                        textColor={colors.black}
                                        fontWeight="bold"
                                    />

                                    {/* Status do torneio */}
                                    <BadgeStatus
                                        label={getTournamentBadgeLabel(tournamentStatus)}
                                        bgColor={getTournamentBadgeColor(tournamentStatus)}
                                        textColor={colors.black}
                                        fontWeight="bold"
                                    />

                                    {/* Grupo + Chaves */}
                                    <BadgeStatus
                                        label="Grupo + Chaves"
                                        bgColor={colors.gray[200]}
                                        textColor={colors.black}
                                        fontWeight="bold"
                                    />
                                </HStack>

                                <Divider bg={colors.gray[200]} my={2} />

                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack space={8} alignItems="center">
                                        {/* Duplas/Inscritos */}
                                        <VStack alignItems="center">
                                            <Text fontSize="lg" fontWeight="bold" color={colors.black}>
                                                {cat.registerCount}
                                            </Text>
                                            <Text fontSize="xs" color={colors.black}>
                                                {cat.isDoubles ? "Duplas" : "Inscritos"}
                                            </Text>
                                        </VStack>

                                        {/* Jogos - não vem mais na API, colocar 0 */}
                                        <VStack alignItems="center">
                                            <Text fontSize="lg" fontWeight="bold" color={colors.black}>
                                                0
                                            </Text>
                                            <Text fontSize="xs" color={colors.black}>
                                                Jogos
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    {/* Ícones Horários + Chaves */}
                                    <HStack space={4}>
                                        {/* Botão Horário */}
                                        <VStack alignItems="center">
                                            <Button variant="ghost" p={2}>
                                                <MaterialIcons name="calendar-today" size={30} color="black" />
                                            </Button>
                                            <Text fontSize="xs" color={colors.black}>
                                                Horário
                                            </Text>
                                        </VStack>

                                        {/* Botão Chaves */}
                                        <VStack alignItems="center">
                                            <Button
                                                variant="ghost"
                                                p={2}
                                                onPress={() =>
                                                    navigation.navigate("MatchGroup", {
                                                        categoryId: cat.id,
                                                        tournamentId: tournamentId,
                                                        categoryName: cat.categoryType,
                                                    })
                                                }
                                            >
                                                <MaterialIcons name="emoji-events" size={30} color="black" />
                                            </Button>
                                            <Text fontSize="xs" color={colors.black}>
                                                Chaves
                                            </Text>
                                        </VStack>
                                    </HStack>

                                </HStack>
                            </Box>
                        ))}
                    </VStack>
                )}
                <GenericModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
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
