import React, { useEffect, useState } from "react";
import {
    VStack,
    FormControl,
    Input,
    Button,
    Text,
    useTheme,
    ScrollView,
    KeyboardAvoidingView,
    Image
} from "native-base";
import { Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserService } from "../api/user/userService";
import { UpdateUserPayload } from "../api/user/userTypes";
import DatePicker from "../components/form/DatePicker";
import SelectField from "../components/form/SelectField";
import Logo from "../assets/logo.png";

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
            <ScrollView
                style={{ flex: 1, backgroundColor: colors.white }}
                contentContainerStyle={{ paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
            >
                <VStack flex={1} p={5} space={5} alignItems="center">
                    <Image source={Logo} alt="Logo" width={150} height={150} resizeMode="contain" mb={4} />
                    <Text fontSize={fontSizes.xl} fontWeight="bold" textAlign="center">
                        Editar Perfil
                    </Text>

                    {/* Campos editáveis */}
                    <FormControl w="100%">
                        <FormControl.Label>Nome Completo</FormControl.Label>
                        <Input
                            variant="filled"
                            bg={colors.gray[200]}
                            value={userData.name}
                            onChangeText={(v) => setUserData({ ...userData, name: v })}
                        />
                    </FormControl>

                    <FormControl w="100%">
                        <FormControl.Label>Instagram</FormControl.Label>
                        <Input
                            variant="filled"
                            bg={colors.gray[200]}
                            value={userData.instagramPage}
                            onChangeText={(v) => setUserData({ ...userData, instagramPage: v })}
                        />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                            Esta informação fica pública no seu perfil do GoPlay
                        </Text>
                    </FormControl>

                    <SelectField
                        label="Gênero"
                        value={userData.gender}
                        onChange={(v) => setUserData({ ...userData, gender: v })}
                        options={[
                            { label: "Masculino", value: "masculino" },
                            { label: "Feminino", value: "feminino" },
                            { label: "Prefiro não informar", value: "" },
                        ]}
                    />

                    <DatePicker
                        date={new Date(userData.birthDate)}
                        onChange={(d) =>
                            setUserData({ ...userData, birthDate: d.toISOString().split("T")[0] })
                        }
                    />

                    <SelectField
                        label="Tamanho Camiseta"
                        value={userData.tShirtSize}
                        onChange={(v) => setUserData({ ...userData, tShirtSize: v })}
                        options={[
                            { label: "Infantil - 6", value: "Infantil - 6" },
                            { label: "Infantil - 8", value: "Infantil - 8" },
                            { label: "Infantil - 10", value: "Infantil - 10" },
                            { label: "Infantil - 12", value: "Infantil - 12" },
                            { label: "Infantil - 14", value: "Infantil - 14" },
                            { label: "PP", value: "PP" },
                            { label: "P", value: "P" },
                            { label: "M", value: "M" },
                            { label: "G", value: "G" },
                            { label: "GG", value: "GG" },
                            { label: "XG", value: "XG" },
                            { label: "XXG", value: "XXG" },
                        ]}
                    />

                    {/* Campos somente leitura */}
                    <FormControl w="100%" isDisabled>
                        <FormControl.Label>Usuário</FormControl.Label>
                        <Input variant="filled" bg={colors.gray[100]} value={userData.userName} isDisabled />
                    </FormControl>

                    <FormControl w="100%" isDisabled>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input variant="filled" bg={colors.gray[100]} value={readOnlyFields.email} isDisabled />
                    </FormControl>

                    <FormControl w="100%" isDisabled>
                        <FormControl.Label>CPF/CNPJ</FormControl.Label>
                        <Input variant="filled" bg={colors.gray[100]} value={readOnlyFields.cpfCnpj} isDisabled />
                    </FormControl>

                    <Button
                        mt={4}
                        w="100%"
                        bg={colors.blue[500]}
                        borderRadius={20}
                        isLoading={loading}
                        onPress={handleUpdate}
                    >
                        <Text fontSize={fontSizes.md} color={colors.white} fontWeight="bold">
                            Salvar Alterações
                        </Text>
                    </Button>

                    <Button
                        mt={4}
                        variant="ghost"
                        _text={{ color: colors.black, fontFamily: "Montserrat", textDecorationLine: "underline" }}
                        onPress={() => navigation.navigate("Home" as never)}
                    >
                        Voltar
                    </Button>
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
