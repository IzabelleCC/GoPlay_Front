import { VStack, Image, Button, Text } from "native-base";
import Logo from "./assets/logo.png";

interface NavigationType {
    navigate: (route: string) => void;
}

export default function Inicial({ navigation }: { navigation: NavigationType }) {
    return (
        <VStack flex={1} alignItems="center" justifyContent="center" p={5}>
            <Image source={Logo} alt="Logo" width={249} height={264} />
            <Button
                mt="10" w="80%" variant="solid"
                style={{backgroundColor: '#053C72', borderRadius: 20, paddingBottom: 12, paddingTop: 12,}}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={{ fontSize: 18, color: '#fff' }}>ENTRAR</Text>
            </Button>
            <Button
                mt="6" w="80%" variant="solid"
                style={{backgroundColor: '#0896B0', borderRadius: 20, paddingBottom: 12, paddingTop: 12,}}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={{ fontSize: 16, color: '#fff' }}>Criar uma conta</Text>
            </Button>
        </VStack>
    );
}

