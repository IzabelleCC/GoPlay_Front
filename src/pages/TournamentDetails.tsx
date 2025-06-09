import { useEffect, useState } from "react";
import { VStack, Text, Button, Box, ScrollView, useTheme } from "native-base";
import { TournamentService } from "../api/tournament/tournamentService";

export default function TournamentDetails({ route, navigation }: any) {
  const { tournamentId } = route.params;
  const { colors, fontSizes } = useTheme();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCategories() {
      try {
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

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView flex={1} bg={colors.white} p={4}>
      <Text fontSize={fontSizes.xl} fontWeight="bold" mb={4}>
        Categorias Disponíveis
      </Text>

      {categories.map((category: any) => (
        <Box
          key={category.id}
          bg={colors.gray[100]}
          p={4}
          mb={3}
          borderRadius={12}
          shadow={1}
        >
          <Text fontSize={fontSizes.lg} fontWeight="bold">
            {category.categoryType}
          </Text>
          <Text fontSize={fontSizes.sm} mb={2}>
            Inscritos: {category.categoryPlayers.length} / {category.playerLimit}
          </Text>
          <Button
            mt={3}
            bg={colors.green[500]}
            onPress={() =>
              navigation.navigate("CategoryRegister", {
                tournamentId,
                categoryId: category.id,
              })
            }
          >
            Inscreva-se
          </Button>
        </Box>
      ))}

      <Button
        mt={6}
        bg={colors.blue[500]}
        onPress={() => navigation.goBack()}
      >
        Voltar
      </Button>
    </ScrollView>
  );
}
