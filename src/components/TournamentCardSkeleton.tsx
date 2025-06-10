import { Box, Skeleton, VStack, HStack, useTheme } from "native-base";

export default function TournamentCardSkeleton() {
  const { colors } = useTheme();

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
        <Skeleton size={50} rounded="full" />

        <VStack flex={1} space={2}>
          <Skeleton height={4} rounded="md" />
          <Skeleton height={3} width="60%" rounded="md" />
          <Skeleton height={3} width="40%" rounded="md" />
        </VStack>
      </HStack>

      {/* Info */}
      <HStack justifyContent="space-between" mb={3}>
        <VStack alignItems="center" space={2}>
          <Skeleton height={4} width={16} rounded="md" />
          <Skeleton height={3} width={20} rounded="md" />
        </VStack>

        <VStack alignItems="center" space={2}>
          <Skeleton height={4} width={12} rounded="md" />
          <Skeleton height={3} width={20} rounded="md" />
        </VStack>
      </HStack>

      {/* Botão */}
      <Skeleton height={10} rounded="md" />
    </Box>
  );
}
