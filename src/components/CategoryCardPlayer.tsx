import { Box, Button, HStack, Text, VStack, useTheme, Image } from "native-base";

interface CategoryCardPlayerProps {
  categoryId: number;
  categoryType: string;
  inscritos: number;
  limite: number;
  imageUrl: string;

  onRegister: (categoryId: number) => void;
}

export default function CategoryCardPlayer({
  categoryId,
  categoryType,
  inscritos,
  limite,
  imageUrl,
  onRegister,
}: CategoryCardPlayerProps) {
  const { colors, fontSizes } = useTheme();
  const vagasRestantes = limite - inscritos;
  const isFull = inscritos >= limite;

  return (
    <Box
      w="100%"
      bg={colors.white}
      p={4}
      mb={3}
      borderRadius={12}
      shadow={1}
      borderWidth={1}
      borderColor={colors.gray[200]}
    >
      <HStack alignItems="center" space={3} mb={2}>
        <Image
          source={{
            uri: imageUrl
              ? imageUrl
              : "https://res.cloudinary.com/dqj6qbp0s/image/upload/v1750298193/goplay/users/h6bclcczqpsze0h0vy3j.png",
          }}
          alt="Imagem do Torneio"
          borderRadius={50}
          width={50}
          height={50}
        />
        <VStack flex={1}>
          {/* Nome da Categoria */}
          <Text
            fontWeight="bold"
            fontSize={fontSizes.md}
            color={colors.blue[800]}
          >
            {categoryType}
          </Text>
        </VStack>

      </HStack>
      {/* Inscritos */}
      <HStack justifyContent="space-between" alignItems="center" >
        <VStack>
          <Text fontWeight="bold" fontSize={fontSizes.xs} color={colors.black}>
            {inscritos} / {limite} Inscritos
          </Text>
          <Text fontSize="10" color={colors.gray[300]}>
            {isFull
              ? "Categoria completa"
              : `${vagasRestantes} vaga${vagasRestantes > 1 ? "s" : ""} restante${vagasRestantes > 1 ? "s" : ""}`}
          </Text>
        </VStack>

        {/* Botão Inscreva-se */}
        <Button
          bg={isFull ? colors.gray[300] : "green.500"}
          _pressed={{ bg: isFull ? colors.gray[300] : "green.600" }}
          isDisabled={isFull}
          onPress={() => onRegister(categoryId)}
        >
          Inscreva-se
        </Button>
      </HStack>
    </Box>
  );
}
