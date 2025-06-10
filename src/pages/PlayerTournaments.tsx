import { useEffect, useState } from "react";
import { VStack, Text, Button, ScrollView, useTheme, Image } from "native-base";
import { TournamentService } from "../api/tournament/tournamentService";
import TournamentCardPlayer from "../components/TournamentCard";
import TournamentCardSkeleton from "../components/TournamentCardSkeleton";
import Logo from "../assets/logo.png";

export default function PlayerTournaments({ navigation }: any) {
  const { colors, fontSizes } = useTheme();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTournaments() {
      try {
        setLoading(true);
        const data = await TournamentService.getAllTournaments();
        setTournaments(data);
      } catch (error) {
        console.error("Erro ao buscar torneios:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTournaments();
  }, []);

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
          Torneios Disponíveis
        </Text>

        {/* Lista de torneios ou skeleton */}
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <TournamentCardSkeleton key={index} />
          ))
        ) : (
          tournaments.map((tournament) => {
            const totalCategories = tournament.categories?.length ?? 0;

            const openCategories = tournament.categories
              ? tournament.categories.filter(
                  (category: any) =>
                    category.playerLimit > 0 &&
                    category.categoryPlayers.length < category.playerLimit
                ).length
              : 0;

            return (
              <TournamentCardPlayer
                key={tournament.id}
                id={tournament.id}
                name={tournament.name}
                imageUrl={tournament.imageUrl}
                organizerUserName={tournament.organizerUserName}
                organizerName={tournament.organizerName}
                city={tournament.city}
                state={tournament.state}
                totalCategories={totalCategories}
                openCategories={openCategories}
                registrationDeadline={tournament.registrationDeadline}
                onPress={() =>
                  navigation.navigate("TournamentDetails", { tournamentId: tournament.id })
                }
              />
            );
          })
        )}

        {/* Botão voltar */}
        <Button mt={4} bg={colors.blue[500]} onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </VStack>
    </ScrollView>
  );
}
