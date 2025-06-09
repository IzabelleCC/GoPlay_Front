import { useEffect, useState } from "react";
import { VStack, Text, Button, Box, ScrollView, useTheme } from "native-base";
import { TournamentService } from "../api/tournament/tournamentService";

export default function PlayerTournaments({ navigation }: any) {
  const { colors, fontSizes } = useTheme();
  const [tournaments, setTournaments] = useState<any[]>([]);

  useEffect(() => {
    async function loadTournaments() {
      try {
        const data = await TournamentService.getAllTournaments();
        setTournaments(data);
      } catch (error) {
        console.error("Erro ao buscar torneios:", error);
      }
    }
    loadTournaments();
  }, []);

  return (
    <ScrollView flex={1} bg={colors.white} p={4}>
      <Text fontSize={fontSizes.xl} fontWeight="bold" mb={4}>
        Torneios Disponíveis
      </Text>

      {tournaments.map((tournament) => (
        <Box
          key={tournament.id}
          bg={colors.gray[100]}
          p={4}
          mb={3}
          borderRadius={12}
          shadow={1}
        >
          <Text fontSize={fontSizes.lg} fontWeight="bold">
            {tournament.name}
          </Text>
          <Button
            mt={3}
            bg={colors.green[500]}
            onPress={() => navigation.navigate("TournamentDetails", { tournamentId: tournament.id })}
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
