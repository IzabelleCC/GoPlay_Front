import React, { useEffect, useState } from "react";
import {
    VStack,
    FormControl,
    Input,
    Button,
    Text,
    useTheme,
    ScrollView,
    KeyboardAvoidingView
} from "native-base";
import { Platform, Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserService } from "../api/user/userService";
import { UpdateUserPayload } from "../api/user/userTypes";

export default function EditProfile() {
    const { colors, fontSizes } = useTheme();
    const navigation = useNavigation();

    const [userData, setUserData] = useState<UpdateUserPayload["data"]>({
        id: "",
        userName: "",
        name: "",
        instagramPage: "",
        gender: "",
        birthDate: "",
        tShirtSize: ""
    });

    const [readOnlyFields, setReadOnlyFields] = useState({
        email: "",
        cpfCnpj: ""
    });

    const [loading, setLoading] = useState(false);

    const fetchUserData = async () => {
        try {
            const storedUserName = await AsyncStorage.getItem("userName");
            if (storedUserName) {
                const data = await UserService.getUserByUserName(storedUserName);
                setUserData({
                    id: data.id,
                    userName: data.userName,
                    name: data.name,
                    instagramPage: data.instagramPage,
                    gender: data.gender,
                    birthDate: data.birthDate,
                    tShirtSize: data.tShirtSize
                });

                setReadOnlyFields({
                    email: data.email,
                    cpfCnpj: data.cpfCnpj
                });
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const payload: UpdateUserPayload = { data: userData };
            await UserService.updateUser(payload);
            Alert.alert("Sucesso", "Dados atualizados com sucesso.");
            navigation.goBack();
        } catch (error: any) {
            console.error("Erro ao atualizar:", error);
            Alert.alert("Erro", error.message || "Erro ao atualizar os dados.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text fontSize={fontSizes.xl} fontWeight="bold" mb={4} textAlign="center">
                    Editar Perfil
                </Text>

                <VStack space={4}>
                    {/* Campos editáveis */}
                    <FormControl>
                        <FormControl.Label>Nome</FormControl.Label>
                        <Input
                            value={userData.name}
                            onChangeText={(value) => setUserData({ ...userData, name: value })}
                            bg={colors.gray[200]}
                        />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label>Instagram</FormControl.Label>
                        <Input
                            value={userData.instagramPage}
                            onChangeText={(value) => setUserData({ ...userData, instagramPage: value })}
                            bg={colors.gray[200]}
                        />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label>Gênero</FormControl.Label>
                        <Input
                            value={userData.gender}
                            onChangeText={(value) => setUserData({ ...userData, gender: value })}
                            bg={colors.gray[200]}
                        />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label>Data de Nascimento</FormControl.Label>
                        <Input
                            value={userData.birthDate}
                            onChangeText={(value) => setUserData({ ...userData, birthDate: value })}
                            placeholder="AAAA-MM-DD"
                            bg={colors.gray[200]}
                        />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label>Tamanho da Camiseta</FormControl.Label>
                        <Input
                            value={userData.tShirtSize}
                            onChangeText={(value) => setUserData({ ...userData, tShirtSize: value })}
                            bg={colors.gray[200]}
                        />
                    </FormControl>

                    {/* Campos somente leitura */}
                    <FormControl isDisabled>
                        <FormControl.Label>Usuário</FormControl.Label>
                        <Input
                            value={userData.userName}
                            isDisabled
                            bg={colors.gray[100]}
                        />
                    </FormControl>

                    <FormControl isDisabled>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input
                            value={readOnlyFields.email}
                            isDisabled
                            bg={colors.gray[100]}
                        />
                    </FormControl>

                    <FormControl isDisabled>
                        <FormControl.Label>CPF/CNPJ</FormControl.Label>
                        <Input
                            value={readOnlyFields.cpfCnpj}
                            isDisabled
                            bg={colors.gray[100]}
                        />
                    </FormControl>

                    <Button
                        mt={6}
                        onPress={handleUpdate}
                        isLoading={loading}
                        borderRadius={20}
                        bg={colors.blue[500]}
                    >
                        <Text color="white" fontWeight="bold" fontSize="md">Salvar Alterações</Text>
                    </Button>

                    <Button
                        mt={4}
                        variant="outline"
                        borderColor={colors.gray[400]}
                        borderRadius={20}
                        onPress={() => navigation.navigate("Home" as never)}
                    >
                        <Text color={colors.black} fontSize="md">Voltar para Home</Text>
                    </Button>
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
