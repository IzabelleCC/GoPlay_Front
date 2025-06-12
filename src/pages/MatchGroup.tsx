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
} from "native-base";
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CategoryPlayerService } from "../api/categoryPlayer/categoryPlayerService";
import { TournamentMatchesResultDto } from "../api/categoryPlayer/categoryPlayerTypes";
import { MaterialIcons } from "@expo/vector-icons";

export default function MatchGroup() {
    const { colors, fontSizes } = useTheme();
    const navigation: any = useNavigation();
    const route = useRoute<any>();
    const { categoryId } = route.params;

    const [matchGroupData, setMatchGroupData] = useState<TournamentMatchesResultDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [quadras, setQuadras] = useState<{ [key: number]: number }>({
        1: 10,
        2: 11,
        3: 12,
    });

    const fetchMatchGroups = async () => {
        try {
            setLoading(true);
            const data = await CategoryPlayerService.getMatchGroupsByCategoryId(categoryId);
            setMatchGroupData(data);
        } catch (err) {
            console.error("Erro ao buscar grupos da categoria", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatchGroups();
    }, []);

    const generateMatches = (players: any[]) => {
        const matches = [];
        const total = players.length;
        for (let i = 0; i < total; i++) {
            const j = (i + 1) % total;
            matches.push([players[i], players[j]]);
        }
        return matches;
    };

    const renderDoubleAvatar = () => (
        <ZStack width={10} height={10} mr={3}>
            <Image
                source={{ uri: "https://www.hhcc.co.in/wp-content/plugins/business_reviews/photos/5dd3d47d719e11574163581.png" }}
                alt="Avatar 1"
                borderRadius={50}
                width={8}
                height={8}
                position="absolute"
                left={0}
                zIndex={1}
            />
            <Image
                source={{ uri: "https://www.hhcc.co.in/wp-content/plugins/business_reviews/photos/5dd3d47d719e11574163581.png" }}
                alt="Avatar 2"
                borderRadius={50}
                width={8}
                height={8}
                position="absolute"
                left={5}
                zIndex={0}
            />
        </ZStack>
    );

    return (
        <ScrollView flex={1} bg={colors.white} p={4}>
            {/* Header do torneio */}
            <VStack alignItems="center" mb={4}>
                <Image
                    source={{
                        uri: "https://img.favpng.com/4/19/3/beach-tennis-tennis-t-shirt-serve-png-favpng-dsZSu0xit617YDdkPWYfyUuxR.jpg",
                    }}
                    alt="Logo"
                    borderRadius={6}
                    width={60}
                    height={60}
                    mb={2}
                />
                <Text fontSize={fontSizes.md} fontWeight="bold" textAlign="center">
                    {matchGroupData?.tournamentName || "Nome do Torneio"}
                </Text>
                <Text fontSize={fontSizes.sm} color={colors.gray[600]} textAlign="center">
                    {matchGroupData?.groups[0]?.categoryType || "Categoria"}
                </Text>
            </VStack>

            {/* Título Fase de Grupos + botão QF vertical */}
            <HStack justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontSize={fontSizes.lg} fontWeight="bold" textAlign="center" flex={1}>
                    Fase de Grupos
                </Text>
                <VStack alignItems="center">
                    <Icon as={MaterialIcons} name="arrow-forward" size={5} color="black" />
                    <Button
                        bg={colors.gray[300]}
                        borderRadius="full"
                        px={2}
                        py={1}
                        mt={1}
                        onPress={() => navigation.navigate("QuarterFinal")}
                        _pressed={{ opacity: 0.8 }}
                    >
                        <Text fontSize="xs" fontWeight="bold" color="black">
                            QF
                        </Text>
                    </Button>
                </VStack>
            </HStack>

            {loading ? (
                <Center flex={1}>
                    <Spinner size="lg" color={colors.blue[500]} />
                    <Text mt={4} color={colors.black}>
                        Carregando grupos...
                    </Text>
                </Center>
            ) : matchGroupData?.groups.length === 0 ? (
                <Text textAlign="center" color={colors.black}>
                    Nenhum grupo encontrado.
                </Text>
            ) : (
                <VStack space={6}>
                    {matchGroupData?.groups.map((groupItem) =>
                        groupItem.groups
                            .sort((a, b) => a.groupNumber - b.groupNumber)
                            .map((groupDto) => (
                                <Box
                                    key={`${groupItem.categoryId}-${groupDto.groupNumber}`}
                                    p={4}
                                    bg={colors.white}
                                    borderRadius={10}
                                    shadow={1}
                                    borderWidth={1}
                                    borderColor={colors.gray[200]}
                                    mb={4}
                                >
                                    {/* Header do grupo e botão quadra */}
                                    <HStack justifyContent="space-between" alignItems="center" mb={3}>
                                        <Text
                                            fontWeight="bold"
                                            fontSize={fontSizes.md}
                                            color={colors.blue[800]}
                                            flex={1}
                                            textAlign="center"
                                        >
                                            GRUPO {groupDto.groupNumber}
                                        </Text>

                                        <Button
                                            bg={colors.gray[300]}
                                            borderRadius="full"
                                            px={3}
                                            py={1}
                                            height={8}
                                            onPress={() =>
                                                console.log(`Editar quadra do grupo ${groupDto.groupNumber}`)
                                            }
                                            _pressed={{ opacity: 0.8 }}
                                        >
                                            <HStack alignItems="center" space={2}>
                                                <Text fontSize="xs" color={colors.black}>
                                                    N° Quadra
                                                </Text>
                                                <Text fontSize="sm" fontWeight="bold" color={colors.black}>
                                                    {quadras[groupDto.groupNumber] || "-"}
                                                </Text>
                                                <Icon as={MaterialIcons} name="arrow-forward" size={4} color="black" />
                                            </HStack>
                                        </Button>
                                    </HStack>

                                    {/* Lista de duplas */}
                                    {groupDto.players.map((player, index) => (
                                        <HStack
                                            key={player.id}
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={2}
                                        >
                                            <HStack space={3} alignItems="center" flex={1}>
                                                {renderDoubleAvatar()}
                                                <VStack maxW="70%">
                                                    <Text
                                                        color={colors.black}
                                                        fontSize={fontSizes.sm}
                                                        numberOfLines={1}
                                                        ellipsizeMode="tail"
                                                    >
                                                        {player.firstUserName}
                                                    </Text>
                                                    <Text
                                                        color={colors.black}
                                                        fontSize={fontSizes.sm}
                                                        numberOfLines={1}
                                                        ellipsizeMode="tail"
                                                    >
                                                        {player.secondUserName}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                            <VStack alignItems="center">
                                                <Text fontWeight="bold" color={colors.black}>
                                                    {index + 1}º
                                                </Text>
                                                <Text fontSize="xs" color="blue.600" underline>
                                                    ver infos
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    ))}

                                    <Divider bg={colors.gray[300]} my={3} />

                                    {/* Jogos */}
                                    {generateMatches(groupDto.players).map((match, matchIndex) => (
                                        <Box key={`match-${groupDto.groupNumber}-${matchIndex}`} mb={4}>
                                            <Text
                                                fontWeight="bold"
                                                fontSize={fontSizes.md}
                                                color={colors.black}
                                                mb={1}
                                            >
                                                Jogo #{matchIndex + 1}
                                            </Text>
                                            <Text color={colors.gray[500]}>
                                                Fase de grupos - G{groupDto.groupNumber}
                                            </Text>
                                            <Text color={colors.gray[500]}>
                                                Sem horário definido — Por favor, aguarde
                                            </Text>

                                            <HStack justifyContent="space-between" alignItems="center" mt={2}>
                                                <HStack space={3} alignItems="center" flex={1}>
                                                    {renderDoubleAvatar()}
                                                    <VStack maxW="70%">
                                                        <Text
                                                            color={colors.black}
                                                            fontSize={fontSizes.sm}
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {match[0]?.firstUserName}
                                                        </Text>
                                                        <Text
                                                            color={colors.black}
                                                            fontSize={fontSizes.sm}
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {match[0]?.secondUserName}
                                                        </Text>
                                                    </VStack>
                                                </HStack>

                                                <HStack space={3} alignItems="center" flex={1} justifyContent="flex-end">
                                                    {renderDoubleAvatar()}
                                                    <VStack maxW="70%">
                                                        <Text
                                                            color={colors.black}
                                                            fontSize={fontSizes.sm}
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {match[1]?.firstUserName}
                                                        </Text>
                                                        <Text
                                                            color={colors.black}
                                                            fontSize={fontSizes.sm}
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {match[1]?.secondUserName}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </HStack>

                                            <Text mt={2} color="red.500" fontWeight="bold">
                                                Placar Pendente
                                            </Text>
                                        </Box>
                                    ))}
                                </Box>
                            ))
                    )}
                </VStack>
            )}

            {/* Botão Voltar com margem menor */}
            <Center mt={4} mb={6}>
                <Button
                    bg={colors.blue[500]}
                    borderRadius={20}
                    px={6}
                    py={3}
                    onPress={() => navigation.goBack()}
                    _pressed={{ opacity: 0.9 }}
                >
                    <Text color="white" fontWeight="bold">
                        Voltar
                    </Text>
                </Button>
            </Center>
        </ScrollView>
    );
}
