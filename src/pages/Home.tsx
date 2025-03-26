import { VStack, Image, Button, Text, Box, Input, useTheme } from "native-base";
import Logo from "../assets/logo.png";

interface NavigationType {
    navigate: (route: string) => void;
}

export default function Home({ navigation }: { navigation: NavigationType }) {
    const { colors, fontSizes } = useTheme();

    return (
        <VStack
            flex={1}
            bg={colors.white}
            p={5}
            alignItems="center"
            justifyContent="flex-start"
            space={6}
        >
            <Image
                source={Logo}
                alt="Logo"
                width={150}
                height={150}
                resizeMode="contain"
                mt={8}
            />

            <Input
                placeholder="Buscar torneios"
                variant="rounded"
                fontSize={fontSizes.md}
                textAlign="center"
                bg={colors.gray[300]}
                w="90%"
                borderRadius={20}
            />

            <Box
                w="100%"
                bg="gray.200"
                p={4}
                borderRadius={12}
                mt={4}
                shadow={1}
                alignItems="center"
            >
                <Text fontSize={fontSizes.lg} fontWeight="bold" mb={2}>
                    Meus Torneios
                </Text>
                <Text fontSize={fontSizes.sm} color="gray.600">
                    Nenhum torneio disponível no momento.
                </Text>
            </Box>

            <Button
                mt="auto"
                w="90%"
                borderRadius={20}
                py={3}
                bg={colors.blue[500]}
                _pressed={{ opacity: 0.8 }}
                onPress={() => navigation.navigate("Inicial")}
            >
                <Text fontSize={fontSizes.md} color={colors.white} fontFamily="Montserrat">
                    Sair
                </Text>
            </Button>
        </VStack>
    );
}
