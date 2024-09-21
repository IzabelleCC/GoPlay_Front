import { VStack, Box, Image, FormControl, Input, Button, Text, Link } from "native-base";
import Logo from "./assets/logo.png";

export default function Login() {
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
            >
                <Text style={{ fontSize: 16, color: '#fff' }}>Acessar minha conta</Text>
            </Button>
        </VStack>
    );
}
