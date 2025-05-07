import React, { useEffect, useState } from "react";
import {
    VStack,
    Text,
    Box,
    Button,
    useTheme,
    ScrollView,
    Divider
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserService } from "../api/user/userService";
import GenericModal from "../components/modals/GenericModal";

export default function MyProfile() {
    const { colors, fontSizes } = useTheme();
    const navigation = useNavigation();

    const [userData, setUserData] = useState<any>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const fetchUserData = async () => {
        try {
            const storedUserName = await AsyncStorage.getItem("userName");
            if (storedUserName) {
                const data = await UserService.getUserByUserName(storedUserName);
                setUserData(data);

                if (data?.userType) 
                    await AsyncStorage.setItem("userType", data.userType.toString());
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userName");
        await AsyncStorage.removeItem("userType");
        navigation.navigate("Login" as never);
    };

    const handleDeleteAccount = async () => {
        try {
            await UserService.deleteUser(userData.userName);
            await AsyncStorage.removeItem("userName");
            await AsyncStorage.removeItem("userType");
            setShowConfirmModal(false);
            navigation.navigate("Inicial" as never);
        } catch (error) {
            console.error("Erro ao excluir conta:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const formatDate = (isoDate: string) => {
        if (!isoDate) return "—";
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat("pt-BR").format(date); // dd/mm/yyyy
    };

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
                                <ProfileField label="Usuário" value={userData.userName} />
                                <ProfileField label="Email" value={userData.email} />
                                <ProfileField label="CPF/CNPJ" value={userData.cpfCnpj} />
                                <ProfileField label="Data de Nascimento" value={formatDate(userData.birthDate)} />
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
                        onPress={() => setShowConfirmModal(true)}
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

                    <Button
                        variant="ghost"
                        _text={{ color: colors.black, fontFamily: "Montserrat", textDecorationLine: "underline" }}
                        onPress={() => 
                            {
                                AsyncStorage.getItem("userType").then((userType) => {
                                    if (userType === "1")
                                        navigation.navigate("HomePlayer" as never);
                                    if (userType === "2")
                                        navigation.navigate("HomeAdm" as never);
                                });
                            }}
                    >
                        Voltar
                    </Button>
                </VStack>

                <GenericModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    title="Excluir Conta"
                    type="info"
                    variant="confirm-delete"
                    body={
                        <Text textAlign="center" color="gray.700">
                            Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.
                        </Text>
                    }
                    onConfirm={handleDeleteAccount}
                    confirmText="Confirmar Exclusão"
                />
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
