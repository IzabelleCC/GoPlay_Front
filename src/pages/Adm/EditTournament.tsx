import React, { useEffect, useState } from "react";
import {
  VStack,
  Input,
  Text,
  Button,
  useTheme,
  ScrollView,
  HStack,
  Box,
} from "native-base";
import { useRoute, useNavigation, NavigationProp } from "@react-navigation/native";
import { TournamentService } from "../../api/tournament/tournamentService";
import { UpdateTournamentPayload } from "../../api/tournament/tournamentTypes";
import DatePicker from "../../components/form/DatePicker";
import GenericModal from "../../components/modals/GenericModal";
import { RootStackParamList } from "../../navigation/Routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationInput from "../../components/form/LocationInput";
import TournamentPictureUploader from "../../components/TournamentPictureUploader";
import CategoryInput from "../../components/CategoryInput";
import AutoGrowingTextArea from "../../components/form/AutoGrowingTextArea";
import { MaterialIcons } from "@expo/vector-icons";

type LocalCategory = {
  categoryType: string;
  playerLimit: string;
  isDoubles: boolean;
};

export default function EditTournament() {
  const { colors, fontSizes } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { id } = route.params;

  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [fee, setFee] = useState("");
  const [courtQty, setCourtQty] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [registrationDeadline, setRegistrationDeadline] = useState(new Date());
  const [paymentDeadline, setPaymentDeadline] = useState(new Date());

  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadTournament();
  }, [id]);


  const loadTournament = async () => {
    try {
      const data = await TournamentService.getFullInformationById(id);
      setName(data.name);
      setDescription(data.description);
      setLocation(data.location);
      setLatitude(data.latitude ?? null);
      setLongitude(data.longitude ?? null);
      setFee(data.registrationFee.toString());
      setCourtQty(data.courtQuantity.toString());
      setStartDate(new Date(data.gamesStartDate));
      setEndDate(new Date(data.gamesEndDate));
      setRegistrationDeadline(new Date(data.registrationDeadline));
      setPaymentDeadline(new Date(data.paymentDeadline));
      setImageUrl(data.imageUrl);
      setCategories(
        data.categories.map((c: any) => ({
          categoryType: c.categoryType,
          playerLimit: c.playerLimit.toString(),
          isDoubles: c.isDoubles ?? true,
        }))
      );
      setLoaded(true);
    } catch (err) {
      console.error("Erro ao carregar torneio", err);
    }
  };

  const handleChangeCategory = (
    index: number,
    key: keyof LocalCategory,
    value: string | boolean
  ) => {
    const updated = [...categories];
    (updated[index][key] as any) = value;
    setCategories(updated);
  };

  const handleRemoveCategory = (index: number) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
  };

  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        setShowModalError(true);
        return;
      }

      const payload: UpdateTournamentPayload = {
        data: {
          id,
          name,
          description,
          gamesStartDate: startDate.toISOString(),
          gamesEndDate: endDate.toISOString(),
          registrationDeadline: registrationDeadline.toISOString(),
          paymentDeadline: paymentDeadline.toISOString(),
          location,
          latitude: latitude!,
          longitude: longitude!,
          registrationFee: Number(fee),
          courtQuantity: Number(courtQty),
          admUserId: userId,
          categories: categories.map((c) => ({
            categoryType: c.categoryType,
            playerLimit: Number(c.playerLimit),
            isDoubles: c.isDoubles,
          })),
        },
      };

      await TournamentService.updateTournament(payload);
      setShowModalSuccess(true);
    } catch (err) {
      console.error("Erro ao atualizar torneio", err);
      setShowModalError(true);
    }
  };

  if (!loaded) return <Text textAlign="center">Carregando...</Text>;
  
  return (
    <Box flex={1} bg={colors.white}>
      <ScrollView flex={1} bg={colors.white} p={5}>
        <VStack space={4} pb={8}>
          <Text fontSize={fontSizes.xl} fontWeight="bold" textAlign="center" color={colors.blue[800]}>
            {name}
          </Text>

          <TournamentPictureUploader tournamentId={id} initialImageUrl={imageUrl} />

          <LocationInput
            value={location}
            onChange={(address, lat, lng) => {
              setLocation(address);
              setLatitude(lat);
              setLongitude(lng);
            }}
          />

          <AutoGrowingTextArea
            value={description}
            onChange={setDescription}
            placeholder="Descrição"
          />

          <HStack space={2} width="100%">
            <VStack flex={1}>
              <Text fontWeight="medium" fontSize="sm" color={colors.gray[600]}>
                Valor da inscrição
              </Text>
              <Input
                flex={1}
                placeholder="0.00"
                value={fee}
                onChangeText={setFee}
                keyboardType="numeric"
                bg={colors.gray[100]}
                borderRadius={10}
                fontSize="md"
                InputLeftElement={
                  <Text ml={3} color="gray.500">
                    R$
                  </Text>
                }
              />
            </VStack>
            <VStack flex={1}>
              <Text fontWeight="medium" fontSize="sm" color={colors.gray[600]}>
                Quantidade de quadras
              </Text>
              <Input
                flex={1}
                placeholder="Quantidade de quadras"
                value={courtQty}
                onChangeText={setCourtQty}
                keyboardType="numeric"
                bg={colors.gray[100]}
                borderRadius={10}
                fontSize={"md"}
              />
            </VStack>
          </HStack>


          <DatePicker label="Data de Início" date={startDate} onChange={setStartDate} />
          <DatePicker label="Data de Término" date={endDate} onChange={setEndDate} />
          <DatePicker label="Prazo de Inscrição" date={registrationDeadline} onChange={setRegistrationDeadline} />
          <DatePicker label="Prazo de Pagamento" date={paymentDeadline} onChange={setPaymentDeadline} />

          {categories.map((category, index) => (
            <CategoryInput
              key={index}
              value={category}
              onChange={(key, value) => handleChangeCategory(index, key, value)}
              onAdd={index === categories.length - 1 ? () =>
                setCategories([...categories, { categoryType: "", playerLimit: "", isDoubles: true }])
                : undefined}
              onRemove={() => setCategoryToDelete(index)}
            />
          ))}

          <Button bg={colors.blue[500]} borderRadius={20} mt={4} onPress={handleSubmit}>
            <Text color={colors.white} fontWeight="bold" fontSize={"md"}>Atualizar dados</Text>
          </Button>

        </VStack>

        <GenericModal
          isOpen={showModalSuccess}
          onClose={() => {
            setShowModalSuccess(false);
            navigation.goBack();
          }}
          title="Sucesso"
          body={<Text textAlign="center">Torneio atualizado com sucesso!</Text>}
          type="success"
          variant="info"
        />

        <GenericModal
          isOpen={showModalError}
          onClose={() => setShowModalError(false)}
          title="Erro"
          body={<Text textAlign="center">Erro ao atualizar o torneio. Tente novamente.</Text>}
          type="error"
          variant="info"
        />

        <GenericModal
          isOpen={showDuplicateModal}
          onClose={() => setShowDuplicateModal(false)}
          title="Nome duplicado"
          body={<Text textAlign="center">Não é permitido cadastrar duas categorias com o mesmo nome.</Text>}
          type="error"
          variant="info"
        />

        <GenericModal
          isOpen={categoryToDelete !== null}
          onClose={() => setCategoryToDelete(null)}
          title="Confirmar exclusão"
          body={<Text textAlign="center">Deseja excluir esta categoria?</Text>}
          type="info"
          variant="confirm-delete"
          confirmText="Confirmar"
          onConfirm={() => {
            if (categoryToDelete !== null) {
              handleRemoveCategory(categoryToDelete);
              setCategoryToDelete(null);
            }
          }}
        />
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
            onPress={() => { navigation.navigate("HomeAdm" as never) }}
            p={3}
          >
            <MaterialIcons name="home" size={28} color="white" />
          </Button>

          {/* Botão Criar Torneio */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.navigate("CreateTournament" as never)}
            p={3}
          >
            <MaterialIcons name="emoji-events" size={28} color="white" />
          </Button>

          {/* Botão Meu Perfil */}
          <Button
            borderRadius="full"
            bg={colors.blue[500]}
            onPress={() => navigation.navigate("MyProfile" as never)}
            p={3}
          >
            <MaterialIcons name="person" size={28} color="white" />
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
