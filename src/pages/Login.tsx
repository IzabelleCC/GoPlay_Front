import { VStack, Box, Image, FormControl, Input, Button, Text, Link, useTheme } from "native-base";
import Logo from "../assets/logo.png";
import React, { useState } from "react";
import { Alert } from "react-native";
import { AccessService } from "../api/access/accessService";
import PasswordInput from "../components/form/PasswordInput";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
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

    const handleBack = () => navigation.navigate("Inicial" as never);

    return (
        <VStack flex={1} alignItems="center" justifyContent="center" p={5} bg="white">
            <Image source={Logo} alt="Logo" width={150} height={150} resizeMode="contain" />
            <Text mt={2} fontSize={fontSizes.lg} fontFamily="Montserrat">GoPlay</Text>

            <Box w="100%" alignItems="center" mt={8}>
                <FormControl w="100%" mb={4}>
                    <Input
                        placeholder="Nome de Usuário"
                        variant="rounded"
                        fontSize={fontSizes.md}
                        bg={colors.gray[300]}
                        onChangeText={setUserName}
                    />
                </FormControl>

                <FormControl w="100%">
                    <PasswordInput
                        placeholder="Senha *"
                        value={password}
                        onChangeText={setPassword}
                        fontSize={fontSizes.md}
                        variant="rounded"
                        bg={colors.gray[300]}
                    />
                </FormControl>

                <Link mt={4} _text={{ color: colors.black, textDecoration: 'underline', fontFamily: 'Montserrat' }}>
                    Esqueci minha senha
                </Link>

                <Button
                    mt={6}
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
                    mt={4}
                    variant="ghost"
                    _text={{ color: colors.black, fontFamily: "Montserrat", textDecorationLine: "underline" }}
                    onPress={handleBack}
                >
                    Voltar
                </Button>
            </Box>
        </VStack>
    );
}
