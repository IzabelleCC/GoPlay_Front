import React, { useState } from "react";
import {
  VStack,
  Input,
  Text,
  Button,
  useTheme,
  ScrollView,
  TextArea,
} from "native-base";
import {
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from "react-native";
import { TournamentService } from "../api/tournament/tournamentService";
import CategoryInput from "../components/CategoryInput";
import DatePicker from "../components/form/DatePicker";
import GenericModal from "../components/modals/GenericModal";
import AutoGrowingTextArea from "../components/form/AutoGrowingTextArea";

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
  const [showDuplicateCategoryModal, setShowDuplicateCategoryModal] =
    useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const handleAddCategory = () => {
    setCategories([...categories, { categoryType: "", playerLimit: "" }]);
  };

  const handleRemoveCategory = (index: number) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
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
        categories: categories
          .filter((c) => c.categoryType.trim() && c.playerLimit.trim())
          .map((c) => ({
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

        <Input
          placeholder="Nome do Torneio"
          value={name}
          onChangeText={setName}
          bg={colors.gray[100]}
          borderRadius={10}
        />

        <AutoGrowingTextArea
          value={description}
          onChange={setDescription}
          placeholder="Descrição"
        />

        <Input
          placeholder="Local"
          value={location}
          onChangeText={setLocation}
          bg={colors.gray[100]}
          borderRadius={10}
        />
        <Input
          placeholder="Valor da inscrição"
          value={fee}
          onChangeText={setFee}
          keyboardType="numeric"
          bg={colors.gray[100]}
          borderRadius={10}
        />
        <Input
          placeholder="Quantidade de quadras"
          value={courtQty}
          onChangeText={setCourtQty}
          keyboardType="numeric"
          bg={colors.gray[100]}
          borderRadius={10}
        />

        <DatePicker label="Data de Início dos Jogos" date={startDate} onChange={setStartDate} />
        <DatePicker label="Data de Término dos Jogos" date={endDate} onChange={setEndDate} />
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

        <Button bg={colors.blue[500]} borderRadius={20} mt={4} onPress={handleSubmit}>
          <Text color={colors.white} fontWeight="bold">
            Cadastrar torneio
          </Text>
        </Button>

        <Button
          mt={2}
          variant="outline"
          borderColor={colors.gray[400]}
          borderRadius={20}
          onPress={() => navigation.navigate("HomeAdm")}
        >
          <Text fontWeight="bold" color={colors.gray[600]}>
            Voltar
          </Text>
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
            <Text textAlign="center">
              Preencha todos os campos obrigatórios corretamente.
            </Text>
          )
        }
        type="error"
        variant="info"
      />

      <GenericModal
        isOpen={showDuplicateCategoryModal}
        onClose={() => setShowDuplicateCategoryModal(false)}
        title="Categoria duplicada"
        body={
          <Text textAlign="center">
            Não é permitido cadastrar duas categorias com o mesmo nome.
          </Text>
        }
        type="error"
        variant="info"
      />
    </ScrollView>
  );
}
