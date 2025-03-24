import { VStack, Box, Image, FormControl, Input, Button, Text, Link } from "native-base";
import Logo from "../assets/logo.png";
import React from "react";
import { Alert } from "react-native";
import { ConsumerAPI } from "../api/ConsumerWS";

const { signIn } = ConsumerAPI;

interface NavigationType {
    navigate: (route: string) => void;
}

export default function Login({ navigation }: { navigation: NavigationType }) {

    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleCreateAccount = () => {

    };

    const handleSignIn = () => {
        signIn(userName, password)
            .then((token) => {
                console.log('Login realizado com sucesso. Token:', token);
                navigation.navigate('Home');
            })
            .catch((error) => {
                console.log('Erro ao logar', error);
                Alert.alert('Erro ao logar', error.message);
            });
    }

    return (
        <VStack flex={1} alignItems="center" justifyContent="center" p={5}>
            <Image source={Logo} alt="Logo" width={198} height={210} />
            <Box>
                <FormControl mt="4" mb="4">
                    <Input
                        mx="3"
                        placeholder="Digite seu User Name"
                        w="80%"
                        variant="rounded"
                        textAlign="center"
                        fontSize="18"
                        onChangeText={(text) => setUserName(text)}
                    />
                </FormControl>
                <FormControl>
                    <Input
                        type="password"
                        mx="3"
                        placeholder="Digite sua senha"
                        w="80%"
                        variant="rounded"
                        textAlign="center"
                        fontSize="18"
                        onChangeText={(text) => setPassword(text)}
                    />
                </FormControl>
            </Box>
            <Link href='https://docs.nativebase.io/link' mt={4}>
                Esqueci minha senha
            </Link>
            <Button
                mt="6"
                w="80%"
                variant="solid"
                style={{ backgroundColor: '#053C72', borderRadius: 20, paddingBottom: 12, paddingTop: 12 }}
                onPress={handleSignIn}
            >
                <Text style={{ fontSize: 16, color: '#fff' }}>Acessar minha conta</Text>
            </Button>
            <Button
                mt="6" w="80%" variant="solid"
                style={{ backgroundColor: '#0896B0', borderRadius: 20, paddingBottom: 12, paddingTop: 12, }}
                onPress={handleCreateAccount}
            >
                <Text style={{ fontSize: 16, color: '#fff' }}>Criar uma conta</Text>
            </Button>
        </VStack>
    );
}
