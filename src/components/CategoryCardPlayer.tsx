import { Box, Button, HStack, Text, VStack, useTheme } from "native-base";

interface CategoryCardPlayerProps {
  categoryId: number;
  categoryType: string;
  inscritos: number;
  limite: number;
  onRegister: (categoryId: number) => void;
}

export default function CategoryCardPlayer({
  categoryId,
  categoryType,
  inscritos,
  limite,
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
      {/* Nome da Categoria */}
      <Text
        fontWeight="bold"
        fontSize={fontSizes.md}
        color={colors.blue[800]}
        mb={2}
      >
        {categoryType}
      </Text>

      {/* Inscritos */}
      <HStack justifyContent="space-between" alignItems="center" mb={3}>
        <VStack>
          <Text fontWeight="bold" fontSize={fontSizes.sm} color={colors.black}>
            {inscritos} / {limite} Inscritos
          </Text>
          <Text fontSize="xs" color={colors.gray[300]}>
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
