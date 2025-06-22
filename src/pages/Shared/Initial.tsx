import { VStack, useTheme, Box } from "native-base";
import { Image } from "react-native";
import  LogoImg  from "../../assets/logo.png";
import { GoPlayButton } from "../../components/GoPlayButton";
import { useNavigation } from "@react-navigation/native";

export default function Initial() {
    const navigation = useNavigation();
    const { colors, fontSizes, fonts } = useTheme();

    return (
        <VStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            p={5}
            bg={colors.white}
            space={10}
        >
            <Image
                source={LogoImg}
                style={{ width: 180, height: 190, resizeMode: "contain" }}
            />

            <Box w="100%">
                <GoPlayButton
                    text="ENTRAR"
                    bgColor={colors.blue[500]}
                    textColor={colors.white}
                    fontSize={fontSizes.md}
                    fontFamily="Montserrat"
                    height={12}
                    onPress={() => navigation.navigate("Login" as never)}
                />
            </Box>

            <Box w="100%">
                <GoPlayButton
                    text="Criar uma conta"
                    bgColor={colors.blue[300]}
                    textColor={colors.black}
                    fontSize={fontSizes.md}
                    fontFamily="Montserrat"
                    height={12}
                    onPress={() => navigation.navigate("Register" as never)}
                />
            </Box>
        </VStack>
    );
}
