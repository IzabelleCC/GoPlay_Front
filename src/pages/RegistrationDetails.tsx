import React, { useState, useCallback } from "react";
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
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import * as Location from 'expo-location';

import { CategoryPlayerService } from "../api/categoryPlayer/categoryPlayerService";
import { TournamentService } from "../api/tournament/tournamentService";
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
    const [modalResult, setModalResult] = useState({
        isOpen: false,
        title: '',
        body: '',
        type: 'info'
    });
    const toast = useToast();

    const loadDetails = async () => {
        setLoading(true);
        const type = await AsyncStorage.getItem("userType");
        if (type) setUserType(Number(type));

        try {
            console.log("RegistrationId:", registrationId);
            const data = await CategoryPlayerService.getRegistrationDetails(registrationId);

            console.log("Detalhes da inscrição:", data);
            setDetails(data)
        } catch (error) {
            console.error("Erro ao carregar detalhes da inscrição:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => {
        loadDetails();
    }, [registrationId]));

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

    const handleConfirmAttendance = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setModalResult({
                    isOpen: true,
                    title: "Permissão negada",
                    body: "É necessário permitir o acesso à localização para confirmar presença.",
                    type: "error",
                });
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            if (!location || !location.coords) throw new Error("Localização não encontrada");

            const userId = await AsyncStorage.getItem("userId");
            const payload = {
                registrationCategoryId: registrationId,
                userId: userId || "",
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            console.log("Presença confirmada com sucesso", payload);
            await TournamentService.confirmAttendance(payload);
            await loadDetails();

            setModalResult({
                isOpen: true,
                title: "Presença confirmada",
                body: "Sua presença foi registrada com sucesso!",
                type: "success",
            });
        } catch (err: any) {
            console.error("Erro ao confirmar presença:", err);
            const apiMessage = err?.response?.data?.message || "Erro ao confirmar presença. Tente novamente.";
            setModalResult({
                isOpen: true,
                title: "Erro",
                body: apiMessage,
                type: "error",
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
    const canConfirmPresence = details.firstUserPaymentConfirmed && details.secondUserPaymentConfirmed;

    const confirmedByName = details.attendanceConfirmedUserId === details.firstUserId
        ? details.firstUserName
        : details.attendanceConfirmedUserId === details.secondUserId
            ? details.secondUserName
            : "um administrador";

    return (
        <Box flex={1} bg={colors.white}>
            <ScrollView flex={1} p={4}>
                <HStack alignItems="center" space={4} mb={6}>
                    <Image
                        source={{ uri: details.tournamentPictureUrl  || "https://res.cloudinary.com/dqj6qbp0s/image/upload/v1750298193/goplay/users/h6bclcczqpsze0h0vy3j.png" }}
                        alt="Imagem do Torneio"
                        width={90}
                        height={90}
                        borderRadius={90}
                        mb={3}
                    />
                <VStack mb={6} flex={1}>
                    <Text fontSize={fontSizes.xl} fontWeight="bold"color={colors.blue[800]}>
                        {details.tournamentName}
                    </Text>
                    <Text fontSize={fontSizes.lg} fontWeight="bold" color={colors.gray[600]}>
                        {details.categoryName}
                    </Text>
                    <Text color={colors.gray[700]}>
                        Pagamento até: {formatDate(details.paymentDeadline)}
                    </Text>
                </VStack>
                </HStack>

                {/* Jogador 1 */}
                <Box mb={6} p={4} bg={colors.gray[100]} borderRadius={12}>
                    <HStack alignItems="center" space={3} mb={2}>
                        {details.firstUserPictureUrl ? (
                            <Image
                                source={{ uri: details.firstUserPictureUrl }}
                                alt={details.firstUserName}
                                width={50}
                                height={50}
                                borderRadius={50}
                            />
                        ) : (
                            <Avatar bg="blue.500" size="md">
                                {details.firstUserName
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </Avatar>
                        )}
                        <VStack>
                            <Text fontWeight="bold">{details.firstUserName}</Text>
                            <Text>Valor: R$ {details.registrationFee.toFixed(2)}</Text>
                        </VStack>
                    </HStack>

                    {details.firstUserPaymentConfirmed ? (
                        <Text color="green.600" fontWeight="bold">
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
                        {details.secondUserName && (
                            <HStack alignItems="center" space={3} mb={2}>
                                {details.secondUserPictureUrl ? (
                                    <Image
                                        source={{ uri: details.secondUserPictureUrl }}
                                        alt={details.secondUserName}
                                        width={50}
                                        height={50}
                                        borderRadius={50}
                                    />
                                ) : (
                                    <Avatar bg="green.500" size="md">
                                        {details.secondUserName
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </Avatar>
                                )}
                                <VStack>
                                    <Text fontWeight="bold">{details.secondUserName}</Text>
                                    <Text>Valor: R$ {details.registrationFee.toFixed(2)}</Text>
                                </VStack>
                            </HStack>
                        )}

                        {details.secondUserPaymentConfirmed ? (
                            <Text color="green.600" fontWeight="bold">
                                {details.secondUserName} não tem pendências de pagamento nesta categoria
                            </Text>
                        ) : (
                            <Button mt={2} bg="green.500" borderRadius={12} onPress={() => goToPayment(details.secondUserId)}>
                                Pagar Inscrição
                            </Button>
                        )}
                    </Box>
                )}

                {/* Presença */}
                {canConfirmPresence && (
                    <Box mb={6} p={4}>
                        {details.attendanceConfirmed ? (
                            <Text fontWeight="bold" color="green.700" textAlign="center">
                                A presença da dupla foi confirmada no dia {dayjs(details.attendanceTime).format("DD/MM/YYYY [às] HH:mm")} por {confirmedByName}.
                            </Text>
                        ) : (
                            <Button
                                bg={colors.blue[500]}
                                borderRadius={12}
                                w="100%"
                                onPress={handleConfirmAttendance}
                                leftIcon={<MaterialIcons name="location-on" size={20} color="white" />}
                            >
                                <Text color="white" fontWeight="bold">Confirmar Presença</Text>
                            </Button>
                        )}
                    </Box>
                )}

                {/* Cancelar inscrição */}
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

            {/* Modal Cancelar */}
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

            {/* Modal Retorno */}
            <GenericModal
                isOpen={modalResult.isOpen}
                onClose={() => setModalResult({ ...modalResult, isOpen: false })}
                title={modalResult.title}
                body={<Text textAlign="center">{modalResult.body}</Text>}
                type={modalResult.type as any}
            />
        </Box>
    );
}
