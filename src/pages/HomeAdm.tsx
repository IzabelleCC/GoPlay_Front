import {
  VStack,
  Image,
  Button,
  Text,
  Input,
  ScrollView,
  useTheme,
  HStack,
  Pressable,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import Logo from "../assets/logo.png";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { TournamentService } from "../api/tournament/tournamentService";
import TournamentCard from "../components/TournamentCard";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function HomeAdm() {
  const { colors, fontSizes } = useTheme();
  const navigation: any = useNavigation();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  

  const fetchTournaments = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const data = await TournamentService.getTournamentsByAdmUserId(userId || "");
      const storedUserType = await AsyncStorage.getItem("userType");
      console.log("storedUserType", storedUserType);
      setTournaments(data);
    } catch (err) {
      console.error("Erro ao carregar torneios", err);
    }
  };

  const searchTournament = async () => {
    if (!search.trim()) {
      fetchTournaments();
      return;
    }

    try {
      const data = await TournamentService.getTournamentByName(search.trim());
      setTournaments(data || []);
    } catch (err) {
      console.error("Erro ao buscar torneio por nome", err);
      setTournaments([]);
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

        {/* Campo de busca com estilo do protótipo */}
        <HStack w="90%" alignSelf="center">
          <Input
            flex={1}
            placeholder="Buscar torneios"
            fontSize={fontSizes.md}
            bg={isFocused ? colors.gray[200] : colors.gray[100]}
            borderTopRightRadius={0}
            borderBottomRightRadius={0}
            borderTopLeftRadius={20}
            borderBottomLeftRadius={20}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              searchTournament();
            }}
          />
          <Pressable
            onPress={searchTournament}
            bg={colors.gray[100]}
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
            borderTopRightRadius={20}
            borderBottomRightRadius={20}
            px={4}
            justifyContent="center"
            alignItems="center"
          >
            <MaterialIcons name="search" size={20} color="black" />
          </Pressable>
        </HStack>

        {/* Lista de torneios */}
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

            {tournaments.length === 0 && (
              <Text textAlign="center" mt={4} color={colors.gray[500]}>
                Nenhum torneio encontrado.
              </Text>
            )}
          </VStack>
        </ScrollView>
      </VStack>


      <HStack space={4} mt={6} mb={4} alignSelf="center">
        <Button
          borderRadius="full"
          bg={colors.blue[500]}
          onPress={() => navigation.navigate("CreateTournament")}
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

    </VStack>
  );
}
