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
  Box,
  Center,
  Divider,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import Logo from "../assets/logo.png";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { TournamentService } from "../api/tournament/tournamentService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import BadgeStatus from "../components/BadgeStatus";
import GenericModal from "../components/modals/GenericModal";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function HomeAdm() {
  const { colors, fontSizes } = useTheme();
  const navigation: any = useNavigation();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateModalTitle, setGenerateModalTitle] = useState("");
  const [generateModalBody, setGenerateModalBody] = useState("");
  const [generateModalType, setGenerateModalType] = useState<"success" | "error">("success");
  const [userType, setUserType] = useState<number | null>(null);

  const fetchTournaments = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);

      if (storedUserId) {
        const data = await TournamentService.getTournamentsByAdmUserId(storedUserId);
        setTournaments(data);
      }
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

  const handleGenerateMatches = async (tournamentId: number) => {
    try {
      await TournamentService.generateGroupMatches(tournamentId);

      setGenerateModalTitle("Chaves geradas com sucesso!");
      setGenerateModalBody("As chaves do torneio foram geradas corretamente.");
      setGenerateModalType("success");
      setIsGenerateModalOpen(true);
    } catch (err) {
      console.error("Erro ao gerar chaves", err);

      setGenerateModalTitle("Erro ao gerar chaves");
      setGenerateModalBody("Ocorreu um erro ao tentar gerar as chaves. Tente novamente.");
      setGenerateModalType("error");
      setIsGenerateModalOpen(true);
    }
  };

  const handleDeleteTournament = async () => {
    if (!selectedTournamentId) return;

    setIsDeleting(false);

    try {
      await TournamentService.deleteTournament(selectedTournamentId);
      fetchTournaments();
    } catch (err) {
      console.error("Erro ao excluir torneio", err);
    }
  };

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format("DD/MM/YYYY");
  };

  const getTournamentBadgeLabel = (status: number) => {
    switch (status) {
      case 0:
      case 1:
        return "Inscrições Abertas";
      case 2:
        return "Inscrições Encerradas";
      case 3:
        return "Em Andamento";
      case 4:
        return "Concluído";
      case 5:
        return "Chaves Geradas";
      default:
        return "Status Desconhecido";
    }
  };

  const getTournamentBadgeColor = (status: number) => {
    switch (status) {
      case 4:
        return colors.gray[200];
      case 0:
      case 1:
      case 3:
      case 5:
        return "green.500";
      case 2:
        return "red.500";
      default:
        return colors.gray[300];
    }
  };

  const fetchUserType = async () => {
    const storedType = await AsyncStorage.getItem("userType");
    if (storedType) {
      setUserType(Number(storedType));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTournaments();
      fetchUserType();
    }, [])
  );

  return (
    <Box flex={1} bg={colors.white}>
      <ScrollView flex={1} p={4} contentContainerStyle={{ paddingBottom: 100 }}>
        <VStack alignItems="center" mb={6}>
          <Image source={Logo} alt="Logo" width={90} height={90} resizeMode="contain" />
          <Text fontSize={fontSizes.lg} fontWeight="bold" mt={2}>
            Meus Torneios
          </Text>
        </VStack>


        {/* Campo de busca */}
        <HStack w="90%" alignSelf="center" mb={4}>
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
        {tournaments.length === 0 ? (
          <Text textAlign="center" mt={4} color={colors.gray[500]}>
            Nenhum torneio encontrado.
          </Text>
        ) : (
          <VStack space={4}>
            {tournaments.map((t) => (
              <Box
                key={t.id}
                p={4}
                bg={colors.white}
                borderRadius={10}
                shadow={1}
                borderWidth={1}
                borderColor={colors.gray[200]}
              >
                <HStack>
                  <Center mb={3}>
                    <Image
                      source={{
                        uri: t.profilePictureUrl || "https://res.cloudinary.com/dqj6qbp0s/image/upload/v1750298193/goplay/users/h6bclcczqpsze0h0vy3j.png",
                      }}
                      alt="Imagem do Torneio"
                      borderRadius={70}
                      width={70}
                      height={70}
                    />
                  </Center>
                  <VStack flex={1} ml={3}>

                    <Text
                      fontWeight="bold"
                      fontSize={fontSizes.md}
                      color={colors.blue[800]}
                      flexShrink={1}
                      flexWrap="wrap"
                      ml={2}
                    >
                      {t.name}
                    </Text>

                    <Text color={colors.black} fontSize={fontSizes.xs} mb={1} ml={2}>
                      Termina em {formatDate(t.gamesEndDate)}
                    </Text>
                  </VStack>

                </HStack>

                <HStack space={2} mb={2} flexWrap="wrap" alignItems="center">
                  <BadgeStatus
                    label={getTournamentBadgeLabel(t.status)}
                    bgColor={getTournamentBadgeColor(t.status)}
                    textColor={colors.black}
                    fontWeight="bold"
                  />
                </HStack>

                <Divider bg={colors.gray[200]} my={2} />

                <HStack justifyContent="space-between" alignItems="center" mt={2}>
                  <HStack space={8} alignItems="center">
                    <VStack alignItems="center">
                      <Text fontSize="lg" fontWeight="bold" color={colors.black}>
                        {t.categories.length}
                      </Text>
                      <Text fontSize="xs" color={colors.black}>
                        Categorias
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack space={1}>

                    {/* Botão Ir Categorias */}
                    <Button
                      variant="outline"
                      borderColor={colors.green[500]}
                      _text={{ color: colors.green[500], fontWeight: "bold" }}
                      onPress={() =>
                        navigation.navigate("CategoryDetails", {
                          tournamentId: t.id,
                          tournamentName: t.name,
                        })
                      }
                    >
                      Ir Categorias
                    </Button>

                    {/* Botão Editar */}
                    <Button
                      variant="ghost"
                      p={2}
                      onPress={() => navigation.navigate("EditTournament", { id: t.id })}
                    >
                      <MaterialIcons name="edit" size={30} color="black" />
                    </Button>

                    {/* Botão Excluir */}
                    <Button
                      variant="ghost"
                      p={2}
                      onPress={() => {
                        setSelectedTournamentId(t.id);
                        setIsDeleting(true);
                      }}
                    >
                      <MaterialIcons name="delete" size={30} color="black" />
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}

        {/* Modal de confirmação de delete */}
        <GenericModal
          isOpen={isDeleting}
          onClose={() => setIsDeleting(false)}
          title="Excluir Torneio"
          body={
            <Text textAlign="center">
              Você tem certeza que deseja excluir este torneio? Esta ação não poderá ser desfeita.
            </Text>
          }
          onConfirm={handleDeleteTournament}
          confirmText="Excluir"
          type="error"
          variant="confirm-delete"
        />

        {/* Modal de resultado da geração de chaves */}
        <GenericModal
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          title={generateModalTitle}
          body={<Text textAlign="center">{generateModalBody}</Text>}
          type={generateModalType}
          variant="info"
        />
      </ScrollView>
      <Box
        marginBottom={3}
        marginTop={3}
        px={4}
        alignItems="center">
        {/* Floating buttons */}
        <HStack space={4} justifyContent="center">
          {/* Botão Home (casinha) */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => {
              if (userType === 1) navigation.navigate("HomePlayer" as never);
              if (userType === 2) navigation.navigate("HomeAdm" as never);
            }}
            p={3}
          >
            <MaterialIcons name="home" size={28} color="white" />
          </Button>

          {/* Botão Criar Torneio */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.navigate("CreateTournament")}
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
