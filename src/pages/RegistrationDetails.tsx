import { useEffect, useState } from "react";
import {
    VStack,
    Image,
    Text,
    useTheme,
    ScrollView,
    Spinner,
    Box,
    Center,
    HStack,
    Button,
    Avatar,
    useToast,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CategoryPlayerService } from "../api/categoryPlayer/categoryPlayerService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import GenericModal from "../components/modals/GenericModal";

export default function RegistrationDetails() {
    const { colors, fontSizes } = useTheme();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { registrationId } = route.params;

    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetch = async () => {
            const type = await AsyncStorage.getItem("userType");
            if (type) setUserType(Number(type));

            try {
                const data = await CategoryPlayerService.getRegistrationDetails(registrationId);
                setDetails(data);
            } catch (error) {
                console.error("Erro ao carregar detalhes da inscrição:", error);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [registrationId]);

    const formatDate = (date: string) => dayjs(date).format("DD/MM/YYYY");

    const goToPayment = (userId: string) => {
        navigation.navigate("PaymentPage", {
            categoryPlayerId: registrationId,
        });
    };

    const handleDelete = async () => {
        try {
            await CategoryPlayerService.deleteCategoryPlayer(registrationId);
            toast.show({
                title: "Inscrição cancelada com sucesso!",
                backgroundColor: colors.green[500],
            });
            setModalOpen(false);
            navigation.navigate("HomePlayer");
        } catch (error) {
            console.error("Erro ao cancelar inscrição:", error);
            toast.show({
                title: "Erro ao cancelar inscrição.",
                backgroundColor: colors.red[500],
            });
        }
    };

    if (loading) {
        return (
            <Center flex={1}>
                <Spinner size="lg" color={colors.blue[500]} />
                <Text mt={4}>Carregando inscrição...</Text>
            </Center>
        );
    }

    if (!details) return <Text>Inscrição não encontrada</Text>;

    const showCancelButton = !details.firstUserPaymentConfirmed && !details.secondUserPaymentConfirmed;

    return (
        <Box flex={1} bg={colors.white}>
            <ScrollView flex={1} p={4}>
                <VStack alignItems="center" mb={6}>
                    <Image
                        source={{
                            uri: "https://itaguara.com/wp-content/uploads/2022/04/2-beach-soccer-thumb.jpg",
                        }}
                        alt="Imagem do Torneio"
                        width={500}
                        height={100}
                        borderRadius={8}
                        mb={3}
                    />
                    <Text fontSize={fontSizes.lg} fontWeight="bold" textAlign="center">
                        {details.tournamentName}
                    </Text>
                    <Text fontSize={fontSizes.sm} color={colors.gray[600]}>
                        {details.categoryName}
                    </Text>
                    <Text color={colors.gray[700]}>
                        Pagamento até: {formatDate(details.paymentDeadline)}
                    </Text>
                </VStack>

                {/* Jogador 1 */}
                <Box mb={6} p={4} bg={colors.gray[100]} borderRadius={12}>
                    <HStack alignItems="center" space={3} mb={2}>
                        <Avatar bg="blue.500" size="md">
                            {details.firstUserName[0]}
                        </Avatar>
                        <VStack>
                            <Text fontWeight="bold">{details.firstUserName}</Text>
                            <Text>Valor: R$ {details.registrationFee.toFixed(2)}</Text>
                        </VStack>
                    </HStack>
                    {details.firstUserPaymentConfirmed ? (
                        <Text color="green.600">
                            {details.firstUserName} não tem pendências de pagamento nesta categoria
                        </Text>
                    ) : (
                        <Button mt={2} bg="green.500" borderRadius={12} onPress={() => goToPayment(details.firstUserId)}>
                            Pagar Inscrição
                        </Button>
                    )}
                </Box>

                {/* Jogador 2 */}
                {details.secondUserName && (
                    <Box mb={6} p={4} bg={colors.gray[100]} borderRadius={12}>
                        <HStack alignItems="center" space={3} mb={2}>
                            <Avatar bg="green.500" size="md">
                                {details.secondUserName[0]}
                            </Avatar>
                            <VStack>
                                <Text fontWeight="bold">{details.secondUserName}</Text>
                                <Text>Valor: R$ {details.registrationFee.toFixed(2)}</Text>
                            </VStack>
                        </HStack>
                        {details.secondUserPaymentConfirmed ? (
                            <Text color="green.600">
                                {details.secondUserName} não tem pendências de pagamento nesta categoria
                            </Text>
                        ) : (
                            <Button mt={2} bg="green.500" borderRadius={12} onPress={() => goToPayment(details.secondUserId)}>
                                Pagar Inscrição
                            </Button>
                        )}
                    </Box>
                )}

                {/* Botão Cancelar Inscrição (visível somente se nenhum pagamento foi feito) */}
                {showCancelButton && (
                    <Box mt={2} p={4} borderRadius={12}>
                        <Button
                            bg={colors.red[600]}
                            borderRadius={12}
                            w="100%"
                            onPress={() => setModalOpen(true)}
                        >
                            Cancelar Inscrição
                        </Button>
                    </Box>
                )}
            </ScrollView>

            {/* Rodapé */}
            <Box marginBottom={3} marginTop={3} px={4} alignItems="center">
                <HStack space={4} justifyContent="center">
                    <Button
                        borderRadius="full"
                        bg={colors.blue[500]}
                        onPress={() => {
                            if (userType === 1) navigation.navigate("HomePlayer");
                            if (userType === 2) navigation.navigate("HomeAdm");
                        }}
                        p={3}
                    >
                        <MaterialIcons name="home" size={28} color="white" />
                    </Button>
                    <Button
                        borderRadius="full"
                        bg={colors.blue[500]}
                        onPress={() => navigation.navigate("PlayerTournaments")}
                        p={3}
                    >
                        <MaterialIcons name="emoji-events" size={28} color="white" />
                    </Button>
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

            {/* Modal de confirmação */}
            <GenericModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                title="Cancelar inscrição"
                body={<Text textAlign="center">Deseja realmente cancelar esta inscrição?</Text>}
                variant="confirm-delete"
                confirmText="Sim, cancelar"
                type="info"
            />
        </Box>
    );
}
