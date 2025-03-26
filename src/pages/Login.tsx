import React, { useState } from "react";
import {
    Box,
    Image,
    FormControl,
    Input,
    Button,
    Text,
    Link,
    useTheme,
    VStack,
} from "native-base";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AccessService } from "../api/access/accessService";
import { UserService } from "../api/user/userService";
import PasswordInput from "../components/form/PasswordInput";
import Logo from "../assets/logo.png";
import GenericModal from "../components/modals/GenericModal";

export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const { colors, fontSizes } = useTheme();
    const navigation = useNavigation();

    const handleSignIn = async () => {
        try {
            const token = await AccessService.login({ data: { userName, password } });
            console.log("Login realizado com sucesso. Token:", token);
            navigation.navigate("Home" as never);
        } catch (error: any) {
            console.log("Erro ao logar", error);
            Alert.alert("Erro ao logar", error.message);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Erro", "Informe um e-mail válido");
            return;
        }

        try {
            setLoading(true);
            await UserService.passwordResetLink({ data: { email } });
            Alert.alert("Sucesso", "Link de redefinição enviado para seu e-mail.");
            setShowModal(false);
            setEmail("");
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Falha ao enviar e-mail de redefinição.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => navigation.navigate("Inicial" as never);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
                keyboardShouldPersistTaps="handled"
            >
                <Image
                    source={Logo}
                    alt="Logo"
                    width={150}
                    height={150}
                    resizeMode="contain"
                    alignSelf="center"
                />

                <Text
                    fontSize={fontSizes.lg}
                    fontFamily="heading"
                    mt={2}
                    textAlign="center"
                >
                    GoPlay
                </Text>

                <VStack space={4} mt={6}>
                    <FormControl w="100%">
                        <FormControl.Label>Nome de Usuário</FormControl.Label>
                        <Input
                            value={userName}
                            onChangeText={setUserName}
                            bg={colors.gray[300]}
                            fontSize={fontSizes.md}
                        />
                    </FormControl>

                    <FormControl w="100%">
                        <FormControl.Label>Senha</FormControl.Label>
                        <PasswordInput
                            value={password}
                            onChangeText={setPassword}
                            fontSize={fontSizes.md}
                            bg={colors.gray[300]}
                        />
                    </FormControl>

                    <Link
                        mt={1}
                        alignSelf="flex-end"
                        _text={{
                            color: colors.black,
                            textDecoration: "underline",
                            fontFamily: "Montserrat",
                        }}
                        onPress={() => setShowModal(true)}
                    >
                        Esqueci minha senha
                    </Link>

                    <Button
                        mt={4}
                        w="100%"
                        borderRadius={20}
                        py={3}
                        bg={colors.blue[500]}
                        _pressed={{ opacity: 0.8 }}
                        onPress={handleSignIn}
                    >
                        <Text fontSize={fontSizes.md} color={colors.white} fontFamily="Montserrat">
                            Entrar no GoPlay
                        </Text>
                    </Button>

                    <Button
                        mt={2}
                        variant="ghost"
                        _text={{
                            color: colors.black,
                            fontFamily: "Montserrat",
                            textDecorationLine: "underline",
                        }}
                        onPress={handleBack}
                    >
                        Voltar
                    </Button>
                </VStack>

                <GenericModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title="Redefinição de senha"
                    body={
                        <VStack space={3} px={2} py={2}>
                            <Text textAlign="center" fontSize="md" color={colors.gray[600]}>
                                Informe o e-mail associado à sua conta para enviarmos um link de redefinição.
                            </Text>

                            <FormControl isRequired>
                                <FormControl.Label>E-mail</FormControl.Label>
                                <Input
                                    placeholder="exemplo@email.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    bg={colors.gray[200]}
                                    borderRadius={10}
                                    fontSize="md"
                                />
                            </FormControl>
                        </VStack>
                    }
                    onConfirm={handleResetPassword}
                    confirmText={loading ? "Enviando..." : "Enviar"}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
