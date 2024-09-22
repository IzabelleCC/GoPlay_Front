import { VStack, Image, Button, Text } from "native-base";
import Logo from "./assets/logo.png";

interface NavigationType {
    navigate: (route: string) => void;
}

export default function Home({ navigation }: { navigation: NavigationType }) {
    return (
        <VStack flex={1} alignItems="center" justifyContent="center" p={5}>
            <Image source={Logo} alt="Logo" width={249} height={264} />
            <Button
                mt="10" w="80%" variant="solid"
                style={{backgroundColor: '#053C72', borderRadius: 20, paddingBottom: 12, paddingTop: 12,}}
                onPress={() => navigation.navigate('Inicial')}
            >
                <Text style={{ fontSize: 18, color: '#fff' }}>SAIR</Text>
            </Button>
        </VStack>
    );
}

