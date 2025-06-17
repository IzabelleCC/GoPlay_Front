import { Box, HStack, VStack, Text, ZStack, Image, useTheme } from "native-base";

type EmptyStateCardProps = {
    title: string;
    message: string;
    count?: number;
};

export default function EmptyStateCard({ title, message, count = 2}: EmptyStateCardProps) {
    const { colors } = useTheme();

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Box
                    key={index}
                    p={4}
                    borderWidth={1}
                    borderColor={colors.gray[300]}
                    borderRadius={10}
                    bg="white"
                    mb={4}
                >
                    <Text fontSize="xs" fontWeight="bold" mb={2}>
                        #{index + 1} • {title}
                    </Text>

                    {[1, 2].map((_, i) => (
                        <HStack key={i} alignItems="center" space={3} mb={2} justifyContent="space-between">
                            <HStack alignItems="center" space={3} flex={1}>
                                <ZStack width={10} height={10} mr={3}>
                                    <Image
                                        source={{ uri: "https://img.freepik.com/psd-premium/ponto-de-interrogacao-do-alfabeto-feito-de-um-personagem-de-desenho-animado-sorridente-em-um-fundo-isolado_443830-1396.jpg?w=1380" }}
                                        alt="?"
                                        borderRadius={50}
                                        width={10}
                                        height={10}
                                        position="absolute"
                                        left={0}
                                        zIndex={1}
                                    />
                                    <Image
                                        source={{ uri: "https://img.freepik.com/psd-premium/ponto-de-interrogacao-do-alfabeto-feito-de-um-personagem-de-desenho-animado-sorridente-em-um-fundo-isolado_443830-1396.jpg?w=1380" }}
                                        alt="?"
                                        borderRadius={50}
                                        width={10}
                                        height={10}
                                        position="absolute"
                                        left={8}
                                        zIndex={0}
                                    />
                                </ZStack>
                                <VStack>
                                    <Text fontWeight="bold" color={colors.gray[500]}>
                                        {message}
                                    </Text>
                                </VStack>
                            </HStack>
                        </HStack>
                    ))}
                </Box>
            ))}
        </>
    );
}
