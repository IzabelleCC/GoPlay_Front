import { useEffect, useState } from "react";
import {
  VStack,
  Text,
  Button,
  ScrollView,
  useTheme,
  Skeleton,
  Box,
  Image,
} from "native-base";
import { TournamentService } from "../api/tournament/tournamentService";
import CategoryCardPlayer from "../components/CategoryCardPlayer";
import Logo from "../assets/logo.png";

export default function TournamentDetails({ route, navigation }: any) {
  const { tournamentId } = route.params;
  const { colors, fontSizes } = useTheme();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const data = await TournamentService.getCategoriesByTournamentId(tournamentId);
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias do torneio:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [tournamentId]);

  return (
    <ScrollView flex={1} bg={colors.white} p={4}>
      <VStack alignItems="center" space={4} pb={12}>
        {/* Logo */}
        <Image
          source={Logo}
          alt="Logo"
          width={90}
          height={90}
          resizeMode="contain"
          mt={2}
        />

        {/* Título */}
        <Text fontSize={fontSizes.xl} fontWeight="bold" mb={2} color={colors.blue[800]}>
          Categorias Disponíveis
        </Text>

        {/* Lista de categorias ou Skeleton */}
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Box
              key={index}
              w="100%"
              bg={colors.white}
              p={4}
              borderRadius={12}
              shadow={1}
              borderWidth={1}
              borderColor={colors.gray[200]}
              mb={3}
            >
              <Skeleton height={5} mb={2} />
              <Skeleton height={3} mb={2} />
              <Skeleton height={10} />
            </Box>
          ))
        ) : categories.length === 0 ? (
          <Text color={colors.gray[300]} textAlign="center">
            Nenhuma categoria disponível no momento.
          </Text>
        ) : (
          categories.map((category: any) => (
            <CategoryCardPlayer
              key={category.id}
              categoryId={category.id}
              categoryType={category.categoryType}
              inscritos={category.categoryPlayers.length}
              limite={category.playerLimit}
              onRegister={(categoryId) =>
                navigation.navigate("CategoryRegister", {
                  tournamentId,
                  categoryId,
                })
              }
            />
          ))
        )}

        {/* Botão voltar */}
        <Button mt={4} bg={colors.blue[500]} onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </VStack>
    </ScrollView>
  );
}
