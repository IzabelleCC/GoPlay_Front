import React, { useEffect, useState, useRef } from "react";
import {
    VStack, Text, Box, Button, useTheme, AlertDialog
} from "native-base";
import { ScrollView } from "react-native";
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: colors.white }}>
            <VStack space={4}>
                <Text fontSize={fontSizes.xl} fontWeight="bold" textAlign="center">Meus Dados</Text>

                {userData ? (
                    <Box bg="gray.100" p={4} borderRadius={12}>
                        <Text fontSize={fontSizes.md}><Text bold>Nome:</Text> {userData.name}</Text>
                        <Text fontSize={fontSizes.md}><Text bold>Email:</Text> {userData.email}</Text>
                        <Text fontSize={fontSizes.md}><Text bold>CPF/CNPJ:</Text> {userData.cpfCnpj}</Text>
                        <Text fontSize={fontSizes.md}><Text bold>Gênero:</Text> {userData.gender}</Text>
                        <Text fontSize={fontSizes.md}><Text bold>Instagram:</Text> {userData.instagramPage}</Text>
                        <Text fontSize={fontSizes.md}><Text bold>Tam. Camiseta:</Text> {userData.tShirtSize}</Text>
                    </Box>
                ) : (
                    <Text>Carregando dados...</Text>
                )}

                <Button bg={colors.blue[500]} borderRadius={20} mt={4} onPress={() => {
                    console.log("clicou editar");
                    navigation.navigate("EditProfile" as never)}}>
                    <Text fontSize={fontSizes.md} color={colors.white}>Editar Dados</Text>
                </Button>

                <Button bg="red.500" borderRadius={20} onPress={() => setShowModal(true)}>
                    <Text fontSize={fontSizes.md} color="white">Excluir Conta</Text>
                </Button>

                <Button variant="outline" borderColor={colors.gray[400]} borderRadius={20} mt={2} onPress={handleLogout}>
                    <Text fontSize={fontSizes.md} color={colors.black}>Sair</Text>
                </Button>
            </VStack>

            <AlertDialog leastDestructiveRef={cancelRef} isOpen={showModal} onClose={() => setShowModal(false)}>
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
        </ScrollView>
    );
}
