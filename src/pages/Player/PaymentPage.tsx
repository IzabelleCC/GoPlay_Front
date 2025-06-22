import { useEffect, useState } from "react";
import {
  VStack,
  Text,
  Button,
  useTheme,
  ScrollView,
  Spinner,
  Box,
  Center,
  useToast,
} from "native-base";
import { CategoryPlayerService } from "../../api/categoryPlayer/categoryPlayerService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";

export default function PaymentPage({ route, navigation }: any) {
  const { categoryPlayerId } = route.params;
  const { colors, fontSizes } = useTheme();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [paymentPayload, setPaymentPayload] = useState<string>("");

  useEffect(() => {
    async function generatePayment() {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) throw new Error("Usuário não encontrado.");

        const response = await CategoryPlayerService.generatePayment({
          registrationId: categoryPlayerId,
          userId,
        });

        const responseBodyParsed = JSON.parse(response.responseBody);

        const brCode = responseBodyParsed.pixCopiaECola;

        setPaymentPayload(brCode);

      } catch (error) {
        console.error("Erro ao gerar pagamento:", error);
        toast.show({
          title: "Erro ao gerar pagamento.",
          backgroundColor: colors.red[500],
        });
      } finally {
        setLoading(false);
      }
    }

    generatePayment();
  }, [categoryPlayerId]);

  const copyPixCode = async () => {
    try {
      await Clipboard.setStringAsync(paymentPayload);
      toast.show({
        title: "Código Pix copiado para a área de transferência!",
        backgroundColor: colors.green[500],
      });
    } catch (error) {
      console.error("Erro ao copiar código Pix:", error);
      toast.show({
        title: "Erro ao copiar código Pix.",
        backgroundColor: colors.red[500],
      });
    }
  };

  const goToHome = async () => {
    try {
      const userType = await AsyncStorage.getItem("userType");

      if (userType === "1") {
        navigation.navigate("HomePlayer");
      } else if (userType === "2") {
        navigation.navigate("HomeAdm");
      } else {
        navigation.navigate("Inicial");
      }
    } catch (error) {
      console.error("Erro ao obter userType:", error);
      navigation.navigate("Inicial");
    }
  };

  return (
    <ScrollView flex={1} bg={colors.white} p={4}>
      <VStack alignItems="center" mb={6}>
        <Text fontSize={fontSizes.lg} fontWeight="bold" mt={2}>
          Pagamento da Inscrição
        </Text>
      </VStack>

      {loading ? (
        <Center flex={1}>
          <Spinner size="lg" color={colors.blue[500]} />
          <Text mt={4}>Gerando pagamento...</Text>
        </Center>
      ) : (
        <VStack space={4} alignItems="center">
          {paymentPayload ? (
            <Box p={4} bg={colors.gray[100]} borderRadius={10} mb={4}>
              <QRCode value={paymentPayload} size={200} />
            </Box>
          ) : (
            <Text color={colors.red[500]}>Erro ao obter QR Code ou código Pix.</Text>
          )}

          {paymentPayload && (
            <>
              <Button bg={colors.green[500]} onPress={copyPixCode}>
                Copiar código Pix
              </Button>
            </>
          )}

          <Button
            mt={4}
            bg={colors.blue[500]}
            onPress={goToHome}
          >
            Voltar para Home
          </Button>
        </VStack>
      )}
    </ScrollView>
  );
}
