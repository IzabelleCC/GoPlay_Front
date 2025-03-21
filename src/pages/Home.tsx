import { VStack, Image, Button, Text, Box, Input } from "native-base";
import Logo from "../assets/logo.png";

interface NavigationType {
    navigate: (route: string) => void;
}

export default function Home({ navigation }: { navigation: NavigationType }) {
    return (
        <VStack flex={1} alignItems="center" justifyContent="center" p={5}>
            <Image source={Logo} alt="Logo" width={99} height={105} />
            <Input
                mt="4"
                placeholder="Busca"
                w="80%"
                variant="rounded"
                textAlign="center"
                fontSize="18"
            />
            <Box alignItems="center"
                mt="10" mb="4" width='90%' height='60%'
                style={{ backgroundColor: '#D9D9D9', borderRadius: 8 }}>
                <Text style={{ fontSize: 20, color: '#000000', alignItems: "center", paddingTop: 12 }}>Meus torneios</Text>
            </Box>
            <Button
                mt="10" w="80%" variant="solid"
                style={{ backgroundColor: '#053C72', borderRadius: 20, paddingBottom: 12, paddingTop: 12 }}
                onPress={() => navigation.navigate('Inicial')}
            >
                <Text style={{ fontSize: 18, color: '#fff' }}>SAIR</Text>
            </Button>
        </VStack>
    );
}

