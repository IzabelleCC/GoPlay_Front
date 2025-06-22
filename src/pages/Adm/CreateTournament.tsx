import React, { useState } from "react";
import {
  VStack,
  Input,
  Text,
  Button,
  useTheme,
  ScrollView,
  HStack,
  Box
} from "native-base";
import { TournamentService } from "../../api/tournament/tournamentService";
import CategoryInput from "../../components/CategoryInput";
import DatePicker from "../../components/form/DatePicker";
import GenericModal from "../../components/modals/GenericModal";
import AutoGrowingTextArea from "../../components/form/AutoGrowingTextArea";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationInput from "../../components/form/LocationInput";
import { CreateTournamentPayload } from "../../api/tournament/tournamentTypes";
import { MaterialIcons } from "@expo/vector-icons";

interface Category {
  categoryType: string;
  playerLimit: string;
  isDoubles: boolean;
}

export default function CreateTournament({ navigation }: any) {
  const { colors, fontSizes } = useTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [fee, setFee] = useState("");
  const [courtQty, setCourtQty] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [registrationDeadline, setRegistrationDeadline] = useState(new Date());
  const [paymentDeadline, setPaymentDeadline] = useState(new Date());

  const [categories, setCategories] = useState<Category[]>([
    { categoryType: "", playerLimit: "", isDoubles: true },
  ]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDuplicateCategoryModal, setShowDuplicateCategoryModal] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      { categoryType: "", playerLimit: "", isDoubles: true },
    ]);
  };

  const handleRemoveCategory = (index: number) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
  };

  const handleChangeCategory = (
    index: number,
    key: "categoryType" | "playerLimit" | "isDoubles",
    value: string | boolean
  ) => {
    const updated = [...categories];
    updated[index][key] = value as never;
    setCategories(updated);
  };

  const hasDuplicateCategories = () => {
    const names = categories
      .filter((c) => c.categoryType.trim())
      .map((c) => c.categoryType.trim().toLowerCase());
    return new Set(names).size !== names.length;
  };

  const isFormValid = (): boolean => {
    const missing: string[] = [];

    if (!name.trim()) missing.push("Nome do Torneio");
    if (!description.trim()) missing.push("Descrição");
    if (!location.trim()) missing.push("Local");
    if (latitude === null || longitude === null) missing.push("Selecione um local válido");
    if (!fee.trim()) missing.push("Valor da inscrição");
    if (!courtQty.trim()) missing.push("Quantidade de quadras");

    categories.forEach((c, i) => {
      const hasAnyValue = c.categoryType.trim() || c.playerLimit.trim();
      if (hasAnyValue) {
        if (!c.categoryType.trim()) missing.push(`Categoria ${i + 1}`);
        if (!c.playerLimit.trim()) missing.push(`Quantidade de duplas ${i + 1}`);
      }
    });

    setInvalidFields(missing);
    return missing.length === 0;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setShowErrorModal(true);
      return;
    }

    if (hasDuplicateCategories()) {
      setShowDuplicateCategoryModal(true);
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.error("Usuário não encontrado no armazenamento.");
        setShowErrorModal(true);
        return;
      }

      const payload: CreateTournamentPayload = {
        data: {
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
          categories: categories
            .filter((c) => c.categoryType.trim() && c.playerLimit.trim())
            .map((c) => ({
              categoryType: c.categoryType,
              playerLimit: Number(c.playerLimit),
              isDoubles: c.isDoubles,
            })),
        },
      };

      await TournamentService.createTournament(payload);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Erro ao criar torneio", err);
      setShowErrorModal(true);
    }
  };

  return (
    <Box flex={1} bg={colors.white}>
      <ScrollView flex={1} p={5}>
        <VStack space={4} pb={8}>
          <Text fontSize={fontSizes.xl} fontWeight="bold" textAlign="center" color={colors.blue[800]}>
            Cadastre um novo torneio
          </Text>

          <VStack space={1}>
            <Text fontWeight="medium" fontSize="sm" color={colors.gray[600]}>
              Nome do Torneio
            </Text>
            <Input
              placeholder="Nome do Torneio"
              value={name}
              onChangeText={setName}
              bg={colors.gray[100]}
              borderRadius={10}
              fontSize="md"
            />
          </VStack>

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
            label="Descrição"
          />

          <HStack space={2} width="100%">
            <VStack flex={1}>
              <Text fontWeight="medium" fontSize="sm" color={colors.gray[600]}>
                Valor da inscrição
              </Text>
              <Input
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
                placeholder=""
                value={courtQty}
                onChangeText={setCourtQty}
                keyboardType="numeric"
                bg={colors.gray[100]}
                borderRadius={10}
                fontSize="md"
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
              onAdd={index === categories.length - 1 ? handleAddCategory : undefined}
              onRemove={categories.length > 1 ? () => handleRemoveCategory(index) : undefined}
            />
          ))}

          <Button
            borderRadius={20}
            bg={colors.blue[500]}
            onPress={handleSubmit}
            px={6}
          >
            <Text color={colors.white} fontWeight="bold">Cadastrar torneio</Text>
          </Button>
        </VStack>
        <GenericModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigation.navigate("HomeAdm");
        }}
        title="Sucesso"
        body={<Text textAlign="center">Torneio cadastrado com sucesso!</Text>}
        type="success"
        variant="info"
      />

      <GenericModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Erro"
        body={
          invalidFields.length > 0 ? (
            <VStack space={1}>
              <Text textAlign="center">Preencha os campos obrigatórios:</Text>
              {invalidFields.map((field, idx) => (
                <Text key={idx} textAlign="center" color="red.500">
                  • {field}
                </Text>
              ))}
            </VStack>
          ) : (
            <Text textAlign="center">Preencha todos os campos obrigatórios corretamente.</Text>
          )
        }
        type="error"
        variant="info"
      />

      <GenericModal
        isOpen={showDuplicateCategoryModal}
        onClose={() => setShowDuplicateCategoryModal(false)}
        title="Categoria duplicada"
        body={<Text textAlign="center">Não é permitido cadastrar duas categorias com o mesmo nome.</Text>}
        type="error"
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
