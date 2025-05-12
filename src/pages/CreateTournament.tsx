import React, { useState } from "react";
import {
  VStack,
  Input,
  Text,
  Button,
  useTheme,
  ScrollView,
  IconButton,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { TournamentService } from "../api/tournament/tournamentService";
import CategoryInput from "../components/CategoryInput";
import DatePicker from "../components/form/DatePicker";
import GenericModal from "../components/modals/GenericModal";

interface Category {
  categoryType: string;
  playerLimit: string;
}

export default function CreateTournament({ navigation }: any) {
  const { colors, fontSizes } = useTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [fee, setFee] = useState("");
  const [courtQty, setCourtQty] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [registrationDeadline, setRegistrationDeadline] = useState(new Date());
  const [paymentDeadline, setPaymentDeadline] = useState(new Date());

  const [categories, setCategories] = useState<Category[]>([
    { categoryType: "", playerLimit: "" },
  ]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDuplicateCategoryModal, setShowDuplicateCategoryModal] = useState(false);

  const handleAddCategory = () => {
    setCategories([...categories, { categoryType: "", playerLimit: "" }]);
  };

  const handleChangeCategory = (
    index: number,
    key: "categoryType" | "playerLimit",
    value: string
  ) => {
    const updated = [...categories];
    updated[index][key] = value;
    setCategories(updated);
  };

  const hasDuplicateCategories = () => {
    const names = categories.map(c => c.categoryType.trim().toLowerCase());
    return new Set(names).size !== names.length;
  };

  const isFormValid = () => {
    return (
      name.trim() &&
      description.trim() &&
      location.trim() &&
      fee.trim() &&
      courtQty.trim() &&
      categories.every(c => c.categoryType.trim() && c.playerLimit.trim())
    );
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

    const payload = {
      data: {
        name,
        description,
        gamesStartDate: startDate.toISOString(),
        gamesEndDate: endDate.toISOString(),
        registrationDeadline: registrationDeadline.toISOString(),
        paymentDeadline: paymentDeadline.toISOString(),
        location,
        registrationFee: Number(fee),
        courtQuantity: Number(courtQty),
        categories: categories.map((c) => ({
          categoryType: c.categoryType,
          playerLimit: Number(c.playerLimit),
        })),
      },
    };

    try {
      await TournamentService.createTournament(payload);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Erro ao criar torneio", err);
      setShowErrorModal(true);
    }
  };

  return (
    <ScrollView flex={1} bg={colors.white} p={5}>
      <VStack space={4}>
        <Text fontSize={fontSizes.lg} fontWeight="bold" textAlign="center">
          Cadastre um novo torneio
        </Text>

        <Input placeholder="Nome do Torneio" value={name} onChangeText={setName} bg={colors.gray[100]} borderRadius={10} />
        <Input placeholder="Descrição" value={description} onChangeText={setDescription} bg={colors.gray[100]} borderRadius={10} />
        <Input placeholder="Local" value={location} onChangeText={setLocation} bg={colors.gray[100]} borderRadius={10} />
        <Input placeholder="Valor da inscrição" value={fee} onChangeText={setFee} keyboardType="numeric" bg={colors.gray[100]} borderRadius={10} />
        <Input placeholder="Quantidade de quadras" value={courtQty} onChangeText={setCourtQty} keyboardType="numeric" bg={colors.gray[100]} borderRadius={10} />

        <DatePicker label="Data de Início dos Jogos" date={startDate} onChange={setStartDate} />
        <DatePicker label="Data de Término dos Jogos" date={endDate} onChange={setEndDate} />
        <DatePicker label="Prazo de Inscrição" date={registrationDeadline} onChange={setRegistrationDeadline} />
        <DatePicker label="Prazo de Pagamento" date={paymentDeadline} onChange={setPaymentDeadline} />

        {categories.map((category, index) => (
          <CategoryInput
            key={index}
            value={category}
            onChange={(key, value) => handleChangeCategory(index, key, value)}
          />
        ))}

        <IconButton
          icon={<MaterialIcons name="add-circle-outline" size={24} color="black" />}
          onPress={handleAddCategory}
          alignSelf="flex-end"
        />

        <Button bg={colors.blue[500]} borderRadius={20} mt={4} onPress={handleSubmit}>
          <Text color={colors.white} fontWeight="bold">Cadastrar torneio</Text>
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
        body={<Text textAlign="center">Preencha todos os campos obrigatórios corretamente.</Text>}
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
  );
}