import { VStack, Image, Button, Text, Box, Input, useTheme } from "native-base";
import Logo from "../assets/logo.png";
import { MaterialIcons } from "@expo/vector-icons";

interface NavigationType {
    navigate: (route: string) => void;
}

export default function HomePlayer({ navigation }: { navigation: NavigationType }) {
    const { colors, fontSizes } = useTheme();

    return (
        <VStack
            flex={1}
            bg={colors.white}
            px={5}
            pt={10}
            justifyContent="space-between"
        >
            <VStack alignItems="center" space={6}>
                <Image
                    source={Logo}
                    alt="Logo"
                    width={70}
                    height={70}
                    resizeMode="contain"
                />

                <Input
                    placeholder="Buscar torneios"
                    variant="rounded"
                    fontSize={fontSizes.md}
                    textAlign="center"
                    bg={colors.gray[100]}
                    w="90%"
                    borderRadius={20}
                />

                <Box
                    w="100%"
                    bg={colors.gray[200]}
                    p={4}
                    borderRadius={12}
                    shadow={1}
                    alignItems="center"
                    mt={4}
                >
                    <Text fontSize={fontSizes.lg} fontWeight="bold" mb={2}>
                        Meus Torneios PLAYER
                    </Text>
                    <Text fontSize={fontSizes.sm} color="gray.600">
                        Nenhum torneio disponível no momento.
                    </Text>
                </Box>
            </VStack>

            <Button
                mt={6}
                mb={4}
                alignSelf="center"
                borderRadius="full"
                bg={colors.blue[500]}
                onPress={() => navigation.navigate("MyProfile")}
                p={3}
            >
                <MaterialIcons name="person" size={28} color="white" />
            </Button>
        </VStack>
    );
}
