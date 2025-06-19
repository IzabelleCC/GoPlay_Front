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
import ProfilePictureUploader from "../components/ProfilePictureUploader";

export default function MyProfile() {
    const { colors, fontSizes } = useTheme();
    const navigation = useNavigation();

    const [userData, setUserData] = useState<any>(null);
    const [userType, setUserType] = useState<number | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const fetchUserData = async () => {
        const storedUserName = await AsyncStorage.getItem("userName");
        const storedUserType = await AsyncStorage.getItem("userType");
        if (storedUserType) setUserType(Number(storedUserType));
        if (storedUserName) {
            const data = await UserService.getUserByUserName(storedUserName);
            setUserData(data);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.navigate("Login" as never);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <ScrollView flex={1} bg={colors.white} p={5}>
            <VStack space={5} alignItems="center">
                {/* Avatar com upload */}
                {userData && (
                    <ProfilePictureUploader
                        userId={userData.id}
                        name={userData.name}
                        initialProfileUrl={userData.profilePictureUrl}
                    />
                )}

                <Text fontSize={fontSizes.xl} fontWeight="bold">Meus Dados</Text>

                {userData && (
                    <Box w="100%" bg={colors.gray[100]} p={4} borderRadius={12} shadow={1}>
                        <Text>Nome</Text>
                        <Text bold>{userData.name}</Text>
                        <Divider my={2} />

                        <Text>Usuário</Text>
                        <Text bold>{userData.userName}</Text>
                        <Divider my={2} />

                        <Text>Email</Text>
                        <Text bold>{userData.email}</Text>
                        <Divider my={2} />

                        <Text>CPF/CNPJ</Text>
                        <Text bold>{userData.cpfCnpj}</Text>
                        <Divider my={2} />

                        {userType !== 2 && (
                            <>
                                <Text>Data de Nascimento</Text>
                                <Text bold>{new Date(userData.birthDate).toLocaleDateString("pt-BR")}</Text>
                                <Divider my={2} />
                            </>
                        )}

                        {userType !== 2 && (
                            <>
                                <Text>Gênero</Text>
                                <Text bold>{userData.gender || "—"}</Text>
                                <Divider my={2} />
                            </>
                        )}

                        <Text>Instagram</Text>
                        <Text bold>{userData.instagramPage || "—"}</Text>
                        <Divider my={2} />

                        {userType !== 2 && (
                            <>
                                <Text>Tam. Camiseta</Text>
                                <Text bold>{userData.tShirtSize || "—"}</Text>
                            </>
                        )}
                    </Box>
                )}

                <Button
                    mt={4}
                    w="100%"
                    bg={colors.blue[500]}
                    borderRadius={20}
                    onPress={() => navigation.navigate("EditProfile" as never)}
                >
                    <Text fontSize={fontSizes.md} color={colors.white} fontWeight="bold">
                        Editar Dados
                    </Text>
                </Button>

                <Button
                    mt={2}
                    w="100%"
                    bg={colors.red[600]}
                    borderRadius={20}
                    onPress={() => setShowConfirmModal(true)}
                >
                    <Text fontSize={fontSizes.md} color={colors.white} fontWeight="bold">
                        Excluir Conta
                    </Text>
                </Button>

                <Button
                    mt={2}
                    variant="ghost"
                    _text={{ color: colors.black }}
                    onPress={handleLogout}
                >
                    Sair
                </Button>

                <Button
                    variant="ghost"
                    _text={{ color: colors.gray[600], textDecorationLine: "underline" }}
                    onPress={() => {
                        if (userType === 1) navigation.navigate("HomePlayer" as never);
                        if (userType === 2) navigation.navigate("HomeAdm" as never);
                    }}
                >
                    Voltar
                </Button>
            </VStack>

            <GenericModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirmação"
                body={<Text>Tem certeza que deseja excluir sua conta?</Text>}
                confirmText="Excluir"
                onConfirm={() => {/* chamada para deletar conta */ }}
                type="error"
                variant="info"
            />
        </ScrollView>
    );
}
