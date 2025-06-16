import React, { useEffect, useState } from "react";
import {
  VStack,
  Input,
  Text,
  Button,
  useTheme,
  ScrollView,
  IconButton,
  FormControl,
  HStack,
  Switch,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation, NavigationProp } from "@react-navigation/native";
import { TournamentService } from "../api/tournament/tournamentService";
import { UpdateTournamentPayload } from "../api/tournament/tournamentTypes";
import DatePicker from "../components/form/DatePicker";
import GenericModal from "../components/modals/GenericModal";
import { RootStackParamList } from "../navigation/Routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationInput from "../components/form/LocationInput";

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
  const [editedCategoryIndex, setEditedCategoryIndex] = useState<number | null>(null);

  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

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
      setCategories(
        data.categories.map((c: any) => ({
          categoryType: c.categoryType,
          playerLimit: c.playerLimit.toString(),
          isDoubles: c.isDoubles ?? true,
        }))
      );
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

  const handleSaveCategory = (index: number) => {
    const categoryName = categories[index].categoryType.trim().toLowerCase();
    const duplicate = categories.some(
      (c, i) => i !== index && c.categoryType.trim().toLowerCase() === categoryName
    );
    if (duplicate) {
      setShowDuplicateModal(true);
    } else {
      setEditedCategoryIndex(null);
    }
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

  return (
    <ScrollView flex={1} bg={colors.white} p={5}>
      <VStack space={4} pb={8}>
        <Text fontSize={fontSizes.lg} fontWeight="bold" textAlign="center">
          Editar {name}
        </Text>

        <LocationInput
          value={location}
          onChange={(address, lat, lng) => {
            setLocation(address);
            setLatitude(lat);
            setLongitude(lng);
          }}
        />

        <Input placeholder="Endereço" value={description} onChangeText={setDescription} bg={colors.gray[100]} borderRadius={10} />
        <Input placeholder="Valor da inscrição" value={fee} onChangeText={setFee} keyboardType="numeric" bg={colors.gray[100]} borderRadius={10} />
        <Input placeholder="Quantidade de quadras" value={courtQty} onChangeText={setCourtQty} keyboardType="numeric" bg={colors.gray[100]} borderRadius={10} />

        <DatePicker label="Data de Início" date={startDate} onChange={setStartDate} />
        <DatePicker label="Data de Término" date={endDate} onChange={setEndDate} />
        <DatePicker label="Prazo de Inscrição" date={registrationDeadline} onChange={setRegistrationDeadline} />
        <DatePicker label="Prazo de Pagamento" date={paymentDeadline} onChange={setPaymentDeadline} />

        {categories.map((category, index) => (
          <VStack key={index} bg={colors.blue[300]} p={4} borderRadius={10} space={3}>
            <FormControl>
              <FormControl.Label>Categoria</FormControl.Label>
              <Input
                value={category.categoryType}
                onChangeText={(text) => handleChangeCategory(index, "categoryType", text)}
                bg={colors.gray[100]}
                borderRadius={10}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Quantidade de duplas</FormControl.Label>
              <HStack alignItems="center" space={2}>
                <Input
                  flex={1}
                  value={category.playerLimit}
                  onChangeText={(text) => handleChangeCategory(index, "playerLimit", text)}
                  keyboardType="numeric"
                  bg={colors.gray[100]}
                  borderRadius={10}
                />
                <IconButton
                  icon={<MaterialIcons name="delete" size={24} color="black" />}
                  variant="ghost"
                  onPress={() => setCategoryToDelete(index)}
                />
                {index === categories.length - 1 && (
                  <IconButton
                    icon={<MaterialIcons name="add" size={24} color="black" />}
                    variant="ghost"
                    onPress={() =>
                      setCategories([...categories, { categoryType: "", playerLimit: "", isDoubles: true }])
                    }
                  />
                )}
              </HStack>
            </FormControl>

            <FormControl>
              <FormControl.Label>É dupla?</FormControl.Label>
              <Switch
                isChecked={category.isDoubles}
                onToggle={() => handleChangeCategory(index, "isDoubles", !category.isDoubles)}
              />
            </FormControl>
          </VStack>
        ))}

        <Button bg={colors.blue[500]} borderRadius={20} mt={4} onPress={handleSubmit}>
          <Text color={colors.white} fontWeight="bold">Atualizar dados</Text>
        </Button>

        <Button
          mt={2}
          variant="outline"
          borderColor={colors.gray[400]}
          borderRadius={20}
          onPress={() => navigation.navigate("HomeAdm")}
        >
          <Text fontWeight="bold" color={colors.gray[600]}>Voltar</Text>
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
  );
}
