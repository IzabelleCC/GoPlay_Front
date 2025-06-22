import { Input, VStack, useTheme, IconButton, HStack, Switch, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  value: {
    categoryType: string;
    playerLimit: string;
    isDoubles: boolean;
  };
  onChange: (key: "categoryType" | "playerLimit" | "isDoubles", value: string | boolean) => void;
  onAdd?: () => void;
  onRemove?: () => void;
}

export default function CategoryInput({ value, onChange, onAdd, onRemove }: Props) {
  const { colors } = useTheme();

  return (
    <VStack
      bg={colors.blue[300]}
      p={3}
      borderRadius={15}
      w="100%"
      space={2}
    >
      <Text fontWeight="medium" fontSize="sm" color={colors.gray[600]}>
        Nome da Categoria
      </Text>
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
        <HStack flex={0.7}>
        <VStack flex={1} space={1}>
          <Text fontWeight="medium" fontSize="sm" color={colors.gray[600]}>
            {value.isDoubles ? "Qtd. Duplas" : "Qtd. Jogadores"}
          </Text>
          <Input
            placeholder="0"
            value={value.playerLimit}
            onChangeText={(text) => onChange("playerLimit", text)}
            keyboardType="numeric"
            bg={colors.white}
            borderRadius={10}
            variant="filled"
            fontSize="md"
          />
        </VStack>
        </HStack>
        <HStack alignItems="center" space={1} ml={2} mt={3}>
          <Text fontSize="md" color={colors.black}>
            Dupla
          </Text>
          <Switch
            isChecked={value.isDoubles}
            onToggle={() => onChange("isDoubles", !value.isDoubles)}
          />
        </HStack>

        <HStack alignItems="center" space={1} ml="auto" mt={3} flex={0.4}>
          {onAdd && (
            <IconButton
              icon={<MaterialIcons name="add-circle-outline" size={30} color="black" />}
              onPress={onAdd}
              variant="ghost"
            />
          )}

          {onRemove && (
            <IconButton
              icon={<MaterialIcons name="delete-outline" size={30} color="black" />}
              onPress={onRemove}
              variant="ghost"
            />
          )}
        </HStack>
      </HStack>
    </VStack>
  );
}
