// src/pages/ResetPassword.tsx
import React, { useState, useEffect } from 'react';
import { VStack, Text, Input, Button, FormControl, useTheme } from 'native-base';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Routes';
import { UserService } from '../api/user/userService';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function ResetPassword() {
    const { colors, fontSizes } = useTheme();
    const route = useRoute<RouteProp<RootStackParamList, 'ResetPassword'>>();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (route?.params?.token) {
            setToken(route.params.token);
        }
    }, [route?.params?.token]);

    const handleReset = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        try {
            setLoading(true);
            await UserService.resetPassword(token, {
                data: {
                    email,
                    password,
                },
            });
            Alert.alert('Sucesso', 'Senha redefinida com sucesso.');
            navigation.navigate('Login' as never);
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Falha ao redefinir senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <VStack flex={1} p={5} space={4} alignItems="center" justifyContent="center" bg="white">
                    <Text fontSize={fontSizes.xl} fontWeight="bold">Redefinir Senha</Text>

                    <FormControl isRequired w="100%">
                        <FormControl.Label>E-mail</FormControl.Label>
                        <Input keyboardType="email-address" bg={colors.gray[200]} value={email} onChangeText={setEmail} />
                    </FormControl>

                    <FormControl isRequired w="100%">
                        <FormControl.Label>Nova Senha</FormControl.Label>
                        <Input type="password" bg={colors.gray[200]} value={password} onChangeText={setPassword} />
                    </FormControl>

                    <FormControl isRequired w="100%">
                        <FormControl.Label>Confirmar Nova Senha</FormControl.Label>
                        <Input type="password" bg={colors.gray[200]} value={confirmPassword} onChangeText={setConfirmPassword} />
                    </FormControl>

                    <Button mt={4} w="100%" bg={colors.blue[500]} borderRadius={20} onPress={handleReset} isLoading={loading}>
                        Redefinir Senha
                    </Button>
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
