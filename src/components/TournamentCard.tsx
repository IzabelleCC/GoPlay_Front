import { Box, Button, HStack, Icon, Image, Text, VStack, useTheme } from "native-base";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";

interface Props {
  id: number;
  name: string;
  imageUrl?: string;
  organizerUserName: string;
  organizerName: string;
  city: string;
  state: string;
  totalCategories: number;
  openCategories: number;
  registrationDeadline: string;
  onPress: () => void;
}

export default function TournamentCardPlayer({
  id,
  name,
  imageUrl,
  organizerUserName,
  organizerName,
  city,
  state,
  totalCategories,
  openCategories,
  registrationDeadline,
  onPress,
}: Props) {
  const { colors, fontSizes } = useTheme();

  const daysUntilRegistrationDeadline = (registrationDeadline: string) => {
    const today = dayjs();
    const deadline = dayjs(registrationDeadline);
    const diff = deadline.diff(today, "day");
    return diff >= 0 ? diff : 0;
  };

  return (
    <Box
      w="100%"
      bg={colors.white}
      p={4}
      borderRadius={12}
      shadow={1}
      borderWidth={1}
      borderColor={colors.gray[200]}
      mb={3}
    >
      {/* Header */}
      <HStack alignItems="center" space={3} mb={2}>
        <Image
          source={{
            uri: imageUrl
              ? imageUrl
              : "https://via.placeholder.com/60.png?text=Torneio",
          }}
          alt="Imagem do Torneio"
          borderRadius={50}
          width={50}
          height={50}
        />

        <VStack flex={1}>
          <Text fontWeight="bold" fontSize={fontSizes.md} color={colors.blue[800]}>
            {name}
          </Text>
          <Text fontSize="xs" color={colors.black}>
            @{organizerUserName} • {organizerName}
          </Text>
          <HStack alignItems="center" space={1}>
            <Icon as={MaterialIcons} name="place" size="xs" color={colors.gray[300]} />
            <Text fontSize="xs" color={colors.gray[300]}>
              {city} - {state}
            </Text>
          </HStack>
        </VStack>
      </HStack>

      {/* Info */}
      <HStack justifyContent="space-between" mb={3}>
        <VStack alignItems="center">
          <HStack alignItems="center" space={1}>
            <Icon as={MaterialCommunityIcons} name="format-list-bulleted" size="sm" color={colors.black} />
            <Text fontWeight="bold" fontSize={fontSizes.sm} color={colors.black}>
              {totalCategories} Categorias
            </Text>
          </HStack>
          <Text fontSize="xs" color={colors.gray[300]}>
            {openCategories} com inscr. abertas
          </Text>
        </VStack>

        <VStack alignItems="center">
          <HStack alignItems="center" space={1}>
            <Icon as={MaterialIcons} name="access-time" size="sm" color={colors.black} />
            <Text fontWeight="bold" fontSize={fontSizes.sm} color={colors.black}>
              {daysUntilRegistrationDeadline(registrationDeadline)} dias
            </Text>
          </HStack>
          <Text fontSize="xs" color={colors.gray[300]}>
            Fim das inscrições
          </Text>
        </VStack>
      </HStack>

      {/* Botão */}
      <Button
        bg="green.500"
        _pressed={{ bg: "green.600" }}
        onPress={onPress}
      >
        Inscreva-se
      </Button>
    </Box>
  );
}
