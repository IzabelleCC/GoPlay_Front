import { useEffect, useState } from "react";
import { VStack, Text, Button, ScrollView, useTheme, Image, Box, HStack } from "native-base";
import { TournamentService } from "../../api/tournament/tournamentService";
import TournamentCardPlayer from "../../components/TournamentCard";
import TournamentCardSkeleton from "../../components/TournamentCardSkeleton";
import Logo from "../../assets/logo.png";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PlayerTournaments({ navigation }: any) {
  const { colors, fontSizes } = useTheme();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTournaments() {
      try {
        setLoading(true);
        const data = await TournamentService.getAllTournaments();
        const filtered = data.filter((tournament: any) => tournament.status === 1);
        setTournaments(filtered);

        if (filtered.length > 0) {
          await AsyncStorage.setItem("tournamentPictureUrl", filtered[0].profilePictureUrl || "");
        }
      } catch (error) {
        console.error("Erro ao buscar torneios:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTournaments();
  }, []);

  return (
    <Box flex={1} bg={colors.white}>
      <ScrollView flex={1} bg={colors.white} p={4}>
        <VStack alignItems="center" space={4} pb={12}>
          <Image
            source={Logo}
            alt="Logo"
            width={90}
            height={90}
            resizeMode="contain"
            mt={2}
          />

          <Text fontSize={fontSizes.lg} fontWeight="bold" mb={2} color={colors.blue[800]}>
            Torneios Disponíveis
          </Text>

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
                  imageUrl={tournament.profilePictureUrl}
                  organizerUserName={tournament.organizerUserName}
                  organizerName={tournament.organizerName}
                  location={tournament.location}
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
        </VStack>
      </ScrollView>
      <Box
        marginBottom={3}
        marginTop={3}
        px={4}
        alignItems="center">
        <HStack space={4} justifyContent="center">
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.goBack()}
            p={3}
          >
            <MaterialIcons name="chevron-left" size={28} color="white" />
          </Button>
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => { navigation.navigate("HomePlayer" as never) }}
            p={3}
          >
            <MaterialIcons name="home" size={28} color="white" />
          </Button>
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.navigate("PlayerTournaments")}
            p={3}
          >
            <MaterialIcons name="emoji-events" size={28} color="white" />
          </Button>
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.navigate("MyProfile")}
            p={3}
          >
            <MaterialIcons name="person" size={28} color="white" />
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
