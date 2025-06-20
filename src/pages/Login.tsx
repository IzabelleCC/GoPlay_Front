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
    VStack
} from "native-base";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccessService } from "../api/access/accessService";
import { UserService } from "../api/user/userService";
import PasswordInput from "../components/form/PasswordInput";
import Logo from "../assets/logo.png";
import GenericModal from "../components/modals/GenericModal";

export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { colors, fontSizes } = useTheme();
    const navigation = useNavigation();

    const handleSignIn = async () => {
        try {
            var response = await AccessService.login({ data: { userName, password } });
            await AsyncStorage.setItem("userName", userName);
            setUserName("");
            setPassword("");
            console.log("login com sucesso");
            await AsyncStorage.setItem("userId", response.result.user.id);
            await AsyncStorage.setItem("userType", response.result.user.userType.toString());
            if(response.result.user.userType == 1) navigation.navigate("HomePlayer" as never);
            if(response.result.user.userType == 2) navigation.navigate("HomeAdm" as never);

        } catch (error: any) {
            handleBackendError(error, "Erro ao realizar login.");
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setErrorMessage("Informe um e-mail válido.");
            setShowErrorModal(true);
            return;
        }

        try {
            setLoading(true);
            await UserService.passwordResetLink({ data: { email } });
            setShowResetModal(false);
            setSuccessMessage("Link de redefinição de senha enviado.");
            setShowSuccessModal(true);
            setEmail("");
        } catch (error: any) {
            handleBackendError(error, "Falha ao enviar e-mail de redefinição.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackendError = (error: any, fallback: string) => {
        let message = fallback;
        const responseData = error?.response?.data;

        if (responseData) {
            if (typeof responseData.error === "string") {
                message = responseData.error;
            } else if (typeof responseData.message === "string") {
                message = responseData.message;
            } else if (typeof responseData === "string") {
                message = responseData;
            }
        } else if (error?.message) {
            message = error.message;
        }

        setErrorMessage(message);
        setShowErrorModal(true);
    };

    const handleBack = () => navigation.navigate("Inicial" as never);

    const resetModalContent = (
        <VStack space={3} px={2} py={2} width="100%">
            <Text textAlign="center" fontSize="md" color={colors.gray[600]}>
                Informe o e-mail associado à sua conta para enviarmos um link de redefinição.
            </Text>

            <FormControl isRequired w="100%">
                <FormControl.Label>E-mail</FormControl.Label>
                <Input
                    placeholder="exemplo@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    bg={colors.gray[100]}
                    borderColor={colors.blue[800]}
                    borderWidth={1}
                    borderRadius={10}
                    fontSize="md"
                    w="100%"
                />
            </FormControl>
        </VStack>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
                keyboardShouldPersistTaps="handled"
            >
                <Image source={Logo} alt="Logo" width={150} height={150} resizeMode="contain" alignSelf="center" />
                <Text fontSize={fontSizes.lg} fontFamily="heading" mt={2} textAlign="center">GoPlay</Text>

                <VStack space={4} mt={6}>
                    <FormControl>
                        <FormControl.Label>Nome de Usuário</FormControl.Label>
                        <Input
                            value={userName}
                            onChangeText={setUserName}
                            bg={colors.gray[100]}
                            borderColor={colors.blue[800]}
                            borderWidth={1}
                            borderRadius={10}
                            fontSize={fontSizes.md}
                        />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label>Senha</FormControl.Label>
                        <PasswordInput
                            value={password}
                            onChangeText={setPassword}
                            fontSize={fontSizes.md}
                            bg={colors.gray[100]}
                            borderColor={colors.blue[800]}
                            borderWidth={1}
                            borderRadius={10}
                        />
                    </FormControl>

                    <Link
                        mt={1}
                        alignSelf="flex-end"
                        _text={{ color: colors.black, textDecoration: "underline", fontFamily: "Montserrat" }}
                        onPress={() => setShowResetModal(true)}
                    >
                        Esqueci minha senha
                    </Link>

                    <Button
                        mt={4}
                        w="100%"
                        borderRadius={20}
                        py={3}
                        bg={colors.blue[500]}
                        onPress={handleSignIn}
                    >
                        <Text fontSize={fontSizes.md} color={colors.white} fontFamily="Montserrat">
                            ENTRAR
                        </Text>
                    </Button>

                    <Button
                        mt={2}
                        variant="ghost"
                        _text={{ color: colors.black, fontFamily: "Montserrat", textDecorationLine: "underline" }}
                        onPress={handleBack}
                    >
                        Voltar
                    </Button>
                </VStack>

                {/* Modal para redefinição de senha */}
                <GenericModal
                    isOpen={showResetModal}
                    onClose={() => setShowResetModal(false)}
                    title="Redefinição de senha"
                    body={resetModalContent}
                    onConfirm={handleResetPassword}
                    confirmText={loading ? "Enviando..." : "Enviar"}
                    isLoading={loading}
                    type="info"
                    variant="reset-password"
                />

                {/* Modal para erro */}
                <GenericModal
                    isOpen={showErrorModal}
                    onClose={() => setShowErrorModal(false)}
                    title="Atenção"
                    body={<Text textAlign="center" color="gray.700">{errorMessage}</Text>}
                    onConfirm={() => setShowErrorModal(false)}
                    confirmText="Fechar"
                    type="error"
                    variant="error"
                />
                {/* Modal de sucesso */}
                <GenericModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title="Sucesso"
                    body={<Text textAlign="center" color="gray.700">{successMessage}</Text>}
                    onConfirm={() => setShowSuccessModal(false)}
                    confirmText="Fechar"
                    type="success"
                    variant="success"
                />

            </ScrollView>
        </KeyboardAvoidingView>
    );
}
