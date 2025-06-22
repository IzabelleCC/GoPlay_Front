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
  HStack,
} from "native-base";
import { TournamentService } from "../../api/tournament/tournamentService";
import CategoryCardPlayer from "../../components/CategoryCardPlayer";
import Logo from "../../assets/logo.png";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TournamentDetails({ route, navigation }: any) {
  const { tournamentId } = route.params;
  const [tournamentPictureUrl, setTournamentPictureUrl] = useState<string | null>(null);
  const { colors, fontSizes } = useTheme();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const data = await TournamentService.getCategoriesByTournamentId(tournamentId);
        setCategories(data);
        const tournamentPictureUrl = await AsyncStorage.getItem("tournamentPictureUrl");
        setTournamentPictureUrl(tournamentPictureUrl || null);
      } catch (error) {
        console.error("Erro ao buscar categorias do torneio:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [tournamentId]);

  return (
    <Box flex={1} bg={colors.white}>
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
          <Text fontSize={fontSizes.lg} fontWeight="bold" mb={2} color={colors.blue[800]}>
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
                imageUrl={tournamentPictureUrl || ""}
                onRegister={(categoryId) =>
                  navigation.navigate("CategoryRegister", {
                    tournamentId,
                    categoryId,
                  })
                }
              />
            ))
          )}

        </VStack>
      </ScrollView>
      <Box
        marginBottom={3}
        marginTop={3}
        px={4}
        alignItems="center">
        {/* Floating buttons */}
        <HStack space={4} justifyContent="center">
          {/* Botão Voltar */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.goBack()}
            p={3}
          >
            <MaterialIcons name="chevron-left" size={28} color="white" />
          </Button>
          {/* Botão Home (casinha) */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => { navigation.navigate("HomePlayer" as never) }}
            p={3}
          >
            <MaterialIcons name="home" size={28} color="white" />
          </Button>

          {/* Botão Criar Torneio */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.navigate("PlayerTournaments")}
            p={3}
          >
            <MaterialIcons name="emoji-events" size={28} color="white" />
          </Button>

          {/* Botão Meu Perfil */}
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
