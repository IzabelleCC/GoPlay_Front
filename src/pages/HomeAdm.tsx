import { VStack, Image, Button, Text, Input, ScrollView, useTheme } from "native-base";
import Logo from "../assets/logo.png";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { TournamentService } from "../api/tournament/tournamentService";
import TournamentCard from "../components/TournamentCard";

export default function HomeAdm() {
  const { colors, fontSizes } = useTheme();
  const navigation: any = useNavigation();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchTournaments = async () => {
    try {
      const data = await TournamentService.getAllTournaments();
      setTournaments(data);
    } catch (err) {
      console.error("Erro ao carregar torneios", err);
    }
  };

  const searchTournament = async (text: string) => {
    setSearch(text);

    if (!text.trim()) {
      fetchTournaments();
      return;
    }

    try {
      const data = await TournamentService.getTournamentByName(text.trim());
      setTournaments(data ? [data] : []);
    } catch (err) {
      console.error("Erro ao buscar torneio por nome", err);
      setTournaments([]); // Se erro, lista vazia
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <VStack flex={1} bg={colors.white} px={5} pt={10} pb={4} justifyContent="space-between">
      <VStack alignItems="center" space={6} flex={1}>
        <Image source={Logo} alt="Logo" width={70} height={70} resizeMode="contain" />
        <Text fontSize={fontSizes.lg} fontWeight="bold">MEUS TORNEIOS</Text>

        <Input
          placeholder="Buscar torneios"
          variant="rounded"
          fontSize={fontSizes.md}
          textAlign="center"
          bg={colors.gray[100]}
          w="90%"
          borderRadius={20}
          value={search}
          onChangeText={searchTournament}
        />

        <ScrollView w="100%" mt={4} maxH="72%">
          <VStack space={4}>
            {tournaments.map(t => (
              <TournamentCard
                key={t.id}
                id={t.id}
                tournamentName={t.name}
                onEdit={() => navigation.navigate("EditTournament", { id: t.id })}
                onInsertResult={() => navigation.navigate("InsertResult", { id: t.id })}
                onDeleted={fetchTournaments}
              />
            ))}
          </VStack>
        </ScrollView>
      </VStack>

      <Button
        mt={6}
        alignSelf="center"
        borderRadius={20}
        w="70%"
        bg={colors.blue[500]}
        onPress={() => navigation.navigate("CreateTournament")}
      >
        <Text fontSize={fontSizes.md} color={colors.white} fontWeight="bold">
          Criar Novo Torneio
        </Text>
      </Button>
    </VStack>
  );
}
