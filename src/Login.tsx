import { VStack, Box, Image, FormControl, Input, Button, Text, Link } from "native-base";
import Logo from "./assets/logo.png";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase-config";
import React from "react";
import { Alert } from "react-native";

interface NavigationType {
    navigate: (route: string) => void;
}

export default function Login({ navigation }: { navigation: NavigationType }) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleCreateAccount = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Conta criada com sucesso', user);
            })
            .catch((error) => {
                console.log('Erro ao criar conta', error);
                Alert.alert('Erro ao criar conta', error.message);
            });
    };

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Usuário logado com sucesso', user);
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
                        placeholder="Digite seu e-mail"
                        w="80%"
                        variant="rounded"
                        textAlign="center"
                        fontSize="18"
                        onChangeText={(text) => setEmail(text)}
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
                style={{backgroundColor: '#0896B0', borderRadius: 20, paddingBottom: 12, paddingTop: 12,}}
                onPress={handleCreateAccount}
            >
                <Text style={{ fontSize: 16, color: '#fff' }}>Criar uma conta</Text>
            </Button>
        </VStack>
    );
}
