import { Input, VStack, useTheme, IconButton, HStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  value: {
    categoryType: string;
    playerLimit: string;
  };
  onChange: (key: "categoryType" | "playerLimit", value: string) => void;
  onAdd?: () => void;
  onRemove?: () => void;
}

export default function CategoryInput({ value, onChange, onAdd, onRemove }: Props) {
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

      <HStack alignItems="center" space={2}>
        <Input
          flex={1}
          placeholder="Quantidade de duplas"
          value={value.playerLimit}
          onChangeText={(text) => onChange("playerLimit", text)}
          keyboardType="numeric"
          bg={colors.white}
          borderRadius={10}
          variant="filled"
          fontSize="md"
        />

        {onAdd && (
          <IconButton
            icon={<MaterialIcons name="add-circle-outline" size={28} color="black" />}
            onPress={onAdd}
            variant="ghost"
          />
        )}

        {onRemove && (
          <IconButton
            icon={<MaterialIcons name="delete-outline" size={26} color="black" />}
            onPress={onRemove}
            variant="ghost"
          />
        )}
      </HStack>
    </VStack>
  );
}
