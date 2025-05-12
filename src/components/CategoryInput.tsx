import { Input, VStack, useTheme } from "native-base";

interface Props {
  value: {
    categoryType: string;
    playerLimit: string;
  };
  onChange: (key: "categoryType" | "playerLimit", value: string) => void;
}

export default function CategoryInput({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <VStack
      space={3}
      bg={colors.blue[300]}
      p={4}
      borderRadius={12}
      w="100%"
    >
      <Input
        placeholder="Categoria"
        value={value.categoryType}
        onChangeText={(text) => onChange("categoryType", text)}
        bg={colors.white}
        borderRadius={10}
        variant="filled"
        fontSize="md"
      />
      <Input
        placeholder="Quantidade de duplas"
        value={value.playerLimit}
        onChangeText={(text) => onChange("playerLimit", text)}
        keyboardType="numeric"
        bg={colors.white}
        borderRadius={10}
        variant="filled"
        fontSize="md"
      />
    </VStack>
  );
}
