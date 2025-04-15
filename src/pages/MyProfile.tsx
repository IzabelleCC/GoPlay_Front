import React, { useEffect, useState, useRef } from "react";
import {
    VStack,
    Text,
    Box,
    Button,
    useTheme,
    AlertDialog,
    ScrollView,
    Divider
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserService } from "../api/user/userService";

export default function MyProfile() {
    const { colors, fontSizes } = useTheme();
    const navigation = useNavigation();
    const cancelRef = useRef(null);

    const [userData, setUserData] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchUserData = async () => {
        try {
            const storedUserName = await AsyncStorage.getItem("userName");
            if (storedUserName) {
                const data = await UserService.getUserByUserName(storedUserName);
                setUserData(data);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userName");
        navigation.navigate("Login" as never);
    };

    const handleDeleteAccount = async () => {
        try {
            await UserService.deleteUser(userData.userName);
            await AsyncStorage.removeItem("userName");
            setShowModal(false);
            navigation.navigate("Inicial" as never);
        } catch (error) {
            console.error("Erro ao excluir conta:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.white }}>
            <VStack flex={1} px={5} pt={10} pb={8} justifyContent="space-between">
                <VStack space={5}>
                    <Text fontSize={fontSizes.xl} fontWeight="bold" textAlign="center">
                        Meus Dados
                    </Text>

                    {userData ? (
                        <Box bg="gray.100" p={5} borderRadius={16} shadow={2}>
                            <VStack space={3}>
                                <ProfileField label="Nome" value={userData.name} />
                                <ProfileField label="Email" value={userData.email} />
                                <ProfileField label="CPF/CNPJ" value={userData.cpfCnpj} />
                                <ProfileField label="Gênero" value={userData.gender} />
                                <ProfileField label="Instagram" value={userData.instagramPage} />
                                <ProfileField label="Tam. Camiseta" value={userData.tShirtSize} />
                            </VStack>
                        </Box>
                    ) : (
                        <Text textAlign="center" mt={4}>Carregando dados...</Text>
                    )}
                </VStack>

                <VStack space={3} mt={8}>
                    <Button
                        bg={colors.blue[500]}
                        borderRadius={20}
                        onPress={() => navigation.navigate("EditProfile" as never)}
                    >
                        <Text fontSize={fontSizes.md} color={colors.white} fontWeight="bold">
                            Editar Dados
                        </Text>
                    </Button>

                    <Button
                        bg="red.500"
                        borderRadius={20}
                        onPress={() => setShowModal(true)}
                    >
                        <Text fontSize={fontSizes.md} color="white" fontWeight="bold">
                            Excluir Conta
                        </Text>
                    </Button>

                    <Button
                        variant="outline"
                        borderColor={colors.gray[400]}
                        borderRadius={20}
                        onPress={handleLogout}
                    >
                        <Text fontSize={fontSizes.md} color={colors.black}>
                            Sair
                        </Text>
                    </Button>
                </VStack>

                <AlertDialog
                    leastDestructiveRef={cancelRef}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                >
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Excluir Conta</AlertDialog.Header>
                        <AlertDialog.Body>
                            Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button ref={cancelRef} onPress={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button colorScheme="danger" ml={3} onPress={handleDeleteAccount}>
                                Confirmar
                            </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </VStack>
        </ScrollView>
    );
}

function ProfileField({ label, value }: { label: string, value: string }) {
    const { fontSizes } = useTheme();

    return (
        <Box>
            <Text fontSize={fontSizes.sm} color="gray.500">
                {label}
            </Text>
            <Text fontSize={fontSizes.md} fontWeight="medium">
                {value || "—"}
            </Text>
            <Divider mt={2} />
        </Box>
    );
}
