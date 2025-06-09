import { useEffect, useState } from "react";
import {
  VStack,
  Text,
  Input,
  Button,
  useTheme,
  ScrollView,
  Box,
  Modal,
  FlatList,
  Pressable,
  Image,
  Divider,
  HStack,
} from "native-base";
import { CategoryPlayerService } from "../api/categoryPlayer/categoryPlayerService";
import { UserService } from "../api/user/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../assets/logo.png";
import { TournamentService } from "../api/tournament/tournamentService";
import { UserBasicData } from "../api/user/userTypes";
import { MaterialIcons } from "@expo/vector-icons";
import GenericModal from "../components/modals/GenericModal";

export default function CategoryRegister({ route, navigation }: any) {
  const { tournamentId, categoryId } = route.params;
  const { colors, fontSizes } = useTheme();

  const [player, setPlayer] = useState<UserBasicData | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [tShirtSize, setTShirtSize] = useState("");

  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [partnerResults, setPartnerResults] = useState<UserBasicData[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successCategoryPlayerId, setSuccessCategoryPlayerId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const userName = await AsyncStorage.getItem("userName");
        if (!userName) return;

        const user = await UserService.getUserByUserName(userName);

        setPlayer(user);
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phoneNumber ?? "");
        setGender(user.gender ?? "");
        setTShirtSize(user.tShirtSize ?? "");

        const categories = await TournamentService.getCategoriesByTournamentId(tournamentId);
        const category = categories.find((c: any) => c.id === categoryId);
        setCategoryName(category ? category.categoryType : "");
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    loadData();
  }, [tournamentId, categoryId]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("Usuário não encontrado.");
  
      const response = await CategoryPlayerService.registerCategoryPlayer({
        categoryId,
        firstUserId: userId,
        secondUserId: partnerId ?? "",
      });
  
      // Correção aqui:
      setSuccessMessage("Inscrição realizada com sucesso!");
      setSuccessCategoryPlayerId(response.categoryPlayerId);
      setShowSuccessModal(true);
  
    } catch (error) {
      console.error("Erro ao realizar inscrição:", error);
      alert("Erro ao realizar inscrição.");
    } finally {
      setLoading(false);
    }
  };
  

  const goToPayment = () => {
    if (successCategoryPlayerId) {
      navigation.navigate("PaymentPage", { categoryPlayerId: successCategoryPlayerId });
      setShowSuccessModal(false);
    }
  };

  const searchPartners = async () => {
    try {
      const users = await UserService.searchUsersByName(partnerSearch);
      setPartnerResults(users);
    } catch (error) {
      console.error("Erro ao buscar parceiros:", error);
    }
  };

  const selectPartner = (user: UserBasicData) => {
    setPartnerId(user.id);
    setPartnerName(user.name);
    setPartnerModalOpen(false);
  };

  return (
    <ScrollView flex={1} bg={colors.white} p={4}>
      <VStack alignItems="center" mb={4}>
        <Image source={Logo} alt="Logo" width={50} height={50} resizeMode="contain" />
        <Text fontSize={fontSizes.lg} fontWeight="bold" mt={2}>
          TORNEIO A
        </Text>
      </VStack>

      <Divider mb={3} />

      <Text fontSize={fontSizes.md} fontWeight="bold" mb={2}>
        Categoria escolhida
      </Text>
      <Text fontSize={fontSizes.md} mb={2}>
        {categoryName}
      </Text>

      <Button mb={4} bg={colors.green[500]} onPress={() => setPartnerModalOpen(true)}>
        Escolher parceiro
      </Button>

      {partnerName && (
        <Box p={3} mb={4} bg={colors.green[100]} borderRadius={10}>
          <Text>Parceiro escolhido: {partnerName}</Text>
        </Box>
      )}

      <Divider mb={4} />

      <Text fontSize={fontSizes.md} fontWeight="bold" mb={2}>
        Confirme ou informe seus dados
      </Text>

      <Input
        placeholder="Nome Completo"
        mb={3}
        value={name}
        onChangeText={setName}
      />
      <Input
        placeholder="E-mail"
        mb={3}
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Telefone"
        mb={3}
        value={phone}
        onChangeText={setPhone}
      />
      <Input
        placeholder="Tamanho Camiseta"
        mb={3}
        value={tShirtSize}
        onChangeText={setTShirtSize}
      />
      <Input
        placeholder="Gênero"
        mb={3}
        value={gender}
        onChangeText={setGender}
      />

      <Button
        mt={6}
        bg={colors.green[500]}
        isLoading={loading}
        onPress={handleRegister}
      >
        Finalizar Inscrição
      </Button>

      <Button
        mt={4}
        bg={colors.blue[500]}
        onPress={() => navigation.goBack()}
      >
        Voltar
      </Button>

      {/* Modal de parceiros */}
      <Modal isOpen={partnerModalOpen} onClose={() => setPartnerModalOpen(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Escolher Parceiro</Modal.Header>
          <Modal.Body>

            <HStack w="100%" alignSelf="center" mb={3}>
              <Input
                flex={1}
                placeholder="Buscar parceiro por nome"
                fontSize={fontSizes.md}
                bg={isFocused ? colors.gray[200] : colors.gray[100]}
                borderTopRightRadius={0}
                borderBottomRightRadius={0}
                borderTopLeftRadius={20}
                borderBottomLeftRadius={20}
                value={partnerSearch}
                onChangeText={setPartnerSearch}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onSubmitEditing={searchPartners}
                returnKeyType="search"
              />
              <Pressable
                onPress={searchPartners}
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

            <FlatList
              data={partnerResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Box
                  p={3}
                  mb={2}
                  bg={colors.gray[100]}
                  borderRadius={8}
                >
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text fontSize="sm" color={colors.gray[600]} mb={2}>
                    {item.email}
                  </Text>

                  <Button
                    size="sm"
                    bg={colors.blue[500]}
                    onPress={() => selectPartner(item)}
                  >
                    Selecionar
                  </Button>
                </Box>
              )}
              ListEmptyComponent={
                <Text textAlign="center" mt={4} color={colors.gray[500]}>
                  Nenhum parceiro encontrado.
                </Text>
              }
            />

          </Modal.Body>
        </Modal.Content>
      </Modal>

      <GenericModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Sucesso"
        body={
          <Text textAlign="center" color={colors.gray[700]}>
            {successMessage}
          </Text>
        }
        type="success"
        variant="confirm-payment"
        onConfirm={goToPayment}
        confirmText="Ir para Pagamento"
      />


    </ScrollView>
  );
}
