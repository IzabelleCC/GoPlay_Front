import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import {
    VStack,
    Text,
    Input,
    FormControl,
    Button,
    useTheme,
    Checkbox,
    Image,
} from "native-base";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/Routes";
import { useNavigation } from "@react-navigation/native";
import Logo from "../assets/logo.png";
import DatePicker from "../components/form/DatePicker";
import SelectField from "../components/form/SelectField";
import PasswordInput from "../components/form/PasswordInput";
import { UserService } from "../api/user/userService";

export default function Register() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { colors, fontSizes } = useTheme();

    const [form, setForm] = useState({
        userName: "",
        name: "",
        email: "",
        cpfCnpj: "",
        gender: "",
        birthDate: new Date(),
        password: "",
        confirmPassword: "",
        instagramPage: "",
        tShirtSize: "",
        userType: 0, // nenhum selecionado inicialmente
    });

    const handleInput = (key: string, value: any) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        if (form.userType === 0) {
            Alert.alert("Erro", "Por favor, selecione um tipo de perfil.");
            return;
        }

        const payload = {
            data: {
                ...form,
                birthDate: form.birthDate.toISOString().split("T")[0],
            },
        };

        try {
            const response = await UserService.createUser(payload);

            if (response.success) {
                navigation.navigate("Home");
            }
        } catch (error) {
            console.error("Erro ao criar conta:", error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={{ flex: 1, backgroundColor: colors.white }}
                contentContainerStyle={{ paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
            >
                <VStack flex={1} p={5} space={5} alignItems="center">
                    <Image source={Logo} alt="Logo" width={150} height={150} resizeMode="contain" mb={4} />
                    <Text fontSize={fontSizes.xl} fontWeight="bold">Crie sua conta gratuitamente</Text>

                    <FormControl w="100%">
                        <FormControl.Label>Seu Perfil (login)</FormControl.Label>
                        <Input variant="filled" bg={colors.gray[200]} onChangeText={(v) => handleInput("userName", v)} />
                        <Text fontSize="xs" color="gray.500">
                            O perfil é único e identifica você no GoPlay. Não pode conter espaços ou caracteres especiais.
                        </Text>
                    </FormControl>

                    <FormControl w="100%">
                        <FormControl.Label>Nome Completo</FormControl.Label>
                        <Input variant="filled" bg={colors.gray[200]} onChangeText={(v) => handleInput("name", v)} />
                    </FormControl>

                    <FormControl w="100%">
                        <FormControl.Label>E-mail</FormControl.Label>
                        <Input keyboardType="email-address" variant="filled" bg={colors.gray[200]} onChangeText={(v) => handleInput("email", v)} />
                    </FormControl>

                    <FormControl w="100%">
                        <FormControl.Label>CPF ou CNPJ</FormControl.Label>
                        <Input keyboardType="numeric" variant="filled" bg={colors.gray[200]} onChangeText={(v) => handleInput("cpfCnpj", v)} />
                    </FormControl>

                    <SelectField
                        label="Gênero"
                        value={form.gender}
                        onChange={(v) => handleInput("gender", v)}
                        options={[
                            { label: "Masculino", value: "masculino" },
                            { label: "Feminino", value: "feminino" },
                            { label: "Prefiro não informar", value: "" },
                        ]}
                    />

                    <DatePicker date={form.birthDate} onChange={(d) => handleInput("birthDate", d)} />

                    <PasswordInput placeholder="Senha" value={form.password} onChangeText={(v) => handleInput("password", v)} />
                    <PasswordInput placeholder="Confirmar Senha" value={form.confirmPassword} onChangeText={(v) => handleInput("confirmPassword", v)} />

                    <FormControl w="100%">
                        <FormControl.Label>Instagram</FormControl.Label>
                        <Input variant="filled" bg={colors.gray[200]} onChangeText={(v) => handleInput("instagramPage", v)} />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                            Esta informação fica pública e com link para o Instagram no seu perfil do GoPlay
                        </Text>
                    </FormControl>

                    <SelectField
                        label="Tamanho Camiseta"
                        value={form.tShirtSize}
                        onChange={(v) => handleInput("tShirtSize", v)}
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

                    <Text mt={2}>Selecione seu perfil</Text>
                    <Checkbox.Group
                        accessibilityLabel="Tipo de usuário"
                        value={form.userType !== 0 ? [form.userType.toString()] : []}
                        onChange={(values) => {
                            const selected = values[0];
                            handleInput("userType", selected === "1" ? 1 : selected === "2" ? 2 : 0);
                        }}
                    >
                        <Checkbox value="1" my={1}>Jogador</Checkbox>
                        <Checkbox value="2">Adm Torneios</Checkbox>
                    </Checkbox.Group>

                    <Button mt={6} bg={colors.blue[500]} w="100%" borderRadius={20} onPress={handleSubmit}>
                        <Text fontSize={fontSizes.md} color={colors.white}>Criar minha conta</Text>
                    </Button>

                    <Button
                        mt={4}
                        variant="ghost"
                        _text={{ color: colors.black, fontFamily: "Montserrat", textDecorationLine: "underline" }}
                        onPress={() => navigation.navigate("Inicial")}
                    >
                        Voltar
                    </Button>
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
