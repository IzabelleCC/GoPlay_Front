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
import { CategoryPlayerService } from "../../api/categoryPlayer/categoryPlayerService";
import dayjs from "dayjs";
import GenericModal from "../../components/modals/GenericModal";
import { CategoryPlayerByCategoryResponse } from "../../api/categoryPlayer/categoryPlayerTypes";

export default function RegistrationOfCategoryDetails() {
    const { colors, fontSizes } = useTheme();
    const navigation: any = useNavigation();
    const route = useRoute<any>();
    const { categoryId } = route.params;
    const [registrations, setRegistrations] = useState<CategoryPlayerByCategoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState<React.ReactNode>(null);
    const [modalType, setModalType] = useState<"success" | "error">("success");

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const data = await CategoryPlayerService.getCategoryPlayersByCategory(categoryId);
            setRegistrations(data || []);
        } catch (err) {
            console.error("Erro ao buscar inscrições", err);
            setModalTitle("Erro");
            setModalBody(<Text>Erro ao carregar inscrições. Tente novamente.</Text>);
            setModalType("error");
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return dayjs(dateStr).format("DD/MM/YYYY");
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    const [pendingAction, setPendingAction] = useState<{
        reg: CategoryPlayerByCategoryResponse;
        user: "first" | "second";
    } | null>(null);

    const confirmIsentar = async () => {
        if (!pendingAction) return;

        const { reg, user } = pendingAction;
        const payload = {
            id: reg.id,
            firstUserId: reg.firstUserId,
            secondUserId: reg.secondUserId,
            firstUserPaymentConfirmed: user === "first" ? true : reg.firstUserPaymentConfirmed,
            secondUserPaymentConfirmed: user === "second" ? true : reg.secondUserPaymentConfirmed,
        };

        try {
            await CategoryPlayerService.updateCategoryPlayer(payload);
            setModalTitle("Sucesso");
            setModalBody(<Text>Inscrição isenta com sucesso!</Text>);
            setModalType("success");
            setIsModalOpen(true);
            fetchRegistrations();
        } catch (err) {
            console.error("Erro ao isentar inscrição", err);
            setModalTitle("Erro");
            setModalBody(<Text>Erro ao isentar inscrição. Tente novamente.</Text>);
            setModalType("error");
            setIsModalOpen(true);
        } finally {
            setPendingAction(null);
        }
    };


    useEffect(() => {
        fetchRegistrations();
    }, []);

    const totalConfirmed = registrations.filter((r) => r.registerStatus === 2).length;

    return (
        <Box flex={1} bg={colors.white}>
            <ScrollView flex={1} bg={colors.white} p={4}>
                <HStack flex={1} space={4} mb={2}>
                    <Image
                        source={{
                            uri:
                                registrations.length > 0
                                    ? registrations[0].tournamentPictureUrl
                                    : "https://res.cloudinary.com/dqj6qbp0s/image/upload/v1750301894/goplay/users/zuxqmczwestyzzn0t6xp.png",
                        }}
                        alt="Imagem Torneio"
                        borderRadius={75}
                        width={75}
                        height={75}
                        mb={3}
                    />
                    <VStack>
                        <Text fontSize={fontSizes.xl} fontWeight="bold" textAlign="center" color={colors.blue[800]}>
                            {registrations.length > 0 ? registrations[0].categoryName : ""}
                        </Text>
                        <Text fontSize={fontSizes.sm} color={colors.gray[600]}>
                            Data limite pagamento: {formatDate(registrations.length > 0 ? registrations[0].paymentDeadline : "")}
                        </Text>
                        <Text fontSize={fontSizes.sm} color={colors.gray[600]}>
                            Taxa de inscrição: R$ {registrations.length > 0 ? registrations[0].registrationFee : "0,00"}
                        </Text>
                    </VStack>
                </HStack>
                <VStack flex={1} space={1} mb={4} alignItems="center">
                    <Divider bg={colors.gray[200]} my={1} />
                    <Text fontSize={fontSizes.md} color={colors.gray[600]} mt={1} fontWeight="bold">
                        {registrations.length} inscrições / {totalConfirmed} confirmadas
                    </Text>
                </VStack>

                {loading ? (
                    <Center flex={1}>
                        <Spinner size="lg" color={colors.blue[500]} />
                        <Text mt={4} color={colors.black}>
                            Carregando inscrições...
                        </Text>
                    </Center>
                ) : registrations.length === 0 ? (
                    <Text textAlign="center" color={colors.black}>
                        Nenhuma inscrição encontrada.
                    </Text>
                ) : (
                    <VStack space={4}>
                        {registrations.map((reg) => (
                            <Box
                                key={reg.id}
                                p={4}
                                bg={colors.white}
                                borderRadius={10}
                                shadow={1}
                                borderWidth={1}
                                borderColor={colors.gray[200]}
                            >
                                <VStack space={3}>
                                    <HStack space={3} alignItems="center">
                                        {reg.firstUserPictureUrl ? (
                                            <Image
                                                source={{ uri: reg.firstUserPictureUrl }}
                                                alt="Jogador 1"
                                                borderRadius={50}
                                                width={50}
                                                height={50}
                                            />
                                        ) : (
                                            <Center bg="blue.500" borderRadius={50} width={50} height={50}>
                                                <Text color="white" fontWeight="bold">
                                                    {getInitials(reg.firstUserName)}
                                                </Text>
                                            </Center>
                                        )}
                                        <VStack>
                                            <Text fontWeight="bold" color={colors.blue[800]}>
                                                {reg.firstUserName}
                                            </Text>
                                            <HStack flex={1} justifyContent="space-between" alignItems="center" space={8}>
                                                
                                            <Text fontSize={fontSizes.xs} color={colors.gray[600]}>
                                                <HStack alignItems="center">
                                                    <Text>
                                                        {reg.firstUserPaymentConfirmed ? "Pagamento Confirmado" : "Pagamento Pendente"}
                                                    </Text>
                                                    <MaterialIcons
                                                        name={reg.firstUserPaymentConfirmed ? "check-circle" : "error-outline"}
                                                        size={20}
                                                        color={reg.firstUserPaymentConfirmed ? "green" : "red"}
                                                        style={{ marginLeft: 4 }}
                                                    />
                                                </HStack>
                                            </Text>

                                            {!reg.firstUserPaymentConfirmed && (
                                                <Button
                                                    mt={1}
                                                    bg="blue.500"
                                                    size="xs"
                                                    borderRadius={20}
                                                    onPress={() => {
                                                        setModalTitle("Confirmar Isenção");
                                                        setModalBody(
                                                            <Text>Deseja realmente isentar a inscrição de {reg.firstUserName}?</Text>
                                                        );
                                                        setModalType("success");
                                                        setIsModalOpen(true);
                                                        setPendingAction({ reg, user: "first" });
                                                    }}
                                                >
                                                    <Text color="white" fontSize="xs">Isentar Inscrição</Text>
                                                </Button>
                                            )}
                                            </HStack>
                                        </VStack>
                                    </HStack>

                                    <HStack space={3} alignItems="center" mt={2}>
                                        {reg.secondUserPictureUrl ? (
                                            <Image
                                                source={{ uri: reg.secondUserPictureUrl }}
                                                alt="Jogador 2"
                                                borderRadius={50}
                                                width={50}
                                                height={50}
                                            />
                                        ) : (
                                            <Center bg="gray.500" borderRadius={50} width={50} height={50}>
                                                <Text color="white" fontWeight="bold">
                                                    {getInitials(reg.secondUserName)}
                                                </Text>
                                            </Center>
                                        )}
                                        <VStack>
                                            <Text fontWeight="bold" color={colors.blue[800]}>
                                                {reg.secondUserName}
                                            </Text>
                                            <HStack flex={1} justifyContent="space-between" alignItems="center" space={8}>
                                            <Text fontSize={fontSizes.xs} color={colors.gray[600]}>
                                                <HStack alignItems="center">
                                                    <Text>
                                                        {reg.secondUserPaymentConfirmed ? "Pagamento Confirmado" : "Pagamento Pendente"}
                                                    </Text>
                                                    <MaterialIcons
                                                        name={reg.secondUserPaymentConfirmed ? "check-circle" : "error-outline"}
                                                        size={20}
                                                        color={reg.secondUserPaymentConfirmed ? "green" : "red"}
                                                        style={{ marginLeft: 4 }}
                                                    />
                                                </HStack>
                                            </Text>

                                            {!reg.secondUserPaymentConfirmed && (
                                                <Button
                                                mt={1}
                                                bg="blue.500"
                                                size="xs"
                                                borderRadius={20}
                                                    onPress={() => {
                                                        setModalTitle("Confirmar Isenção");
                                                        setModalBody(
                                                            <Text>Deseja realmente isentar a inscrição de {reg.secondUserName}?</Text>
                                                        );
                                                        setModalType("success");
                                                        setIsModalOpen(true);
                                                        setPendingAction({ reg, user: "second" });
                                                    }}
                                                >
                                                    <Text color="white" fontSize="xs">Isentar Inscrição</Text>
                                                </Button>
                                            )}
                                            </HStack>
                                        </VStack>

                                    </HStack>

                                </VStack>
                            </Box>
                        ))}
                    </VStack>
                )}

                <GenericModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        if (pendingAction) {
                            confirmIsentar();
                        } else {
                            setIsModalOpen(false);
                        }
                    }}
                    title={modalTitle}
                    body={modalBody}
                    type={modalType}
                />
            </ScrollView>

            <Box marginBottom={3} marginTop={3} px={4} alignItems="center">
                <HStack space={4} justifyContent="center">
                    <Button
                        borderRadius="full"
                        bg={colors.blue[500]}
                        onPress={() => navigation.goBack()}
                        p={3}
                    >
                        <MaterialIcons name="chevron-left" size={28} color="white" />
                    </Button>
                    <Button
                        borderRadius="full"
                        bg={colors.blue[500]}
                        onPress={() => navigation.navigate("HomePlayer")}
                        p={3}
                    >
                        <MaterialIcons name="home" size={28} color="white" />
                    </Button>
                    <Button
                        borderRadius="full"
                        bg={colors.blue[500]}
                        onPress={() => navigation.navigate("CreateTournament")}
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
        </Box>
    );
}
