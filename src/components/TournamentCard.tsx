import { Box, Button, HStack, IconButton, Text, VStack, useTheme, Tooltip } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import GenericModal from "./modals/GenericModal";
import { TournamentService } from "../api/tournament/tournamentService";

interface Props {
  id: number;
  tournamentName: string;
  onEdit: () => void;
  onInsertResult: () => void;
  onDeleted: () => void;
}

export default function TournamentCard({
  id,
  tournamentName,
  onEdit,
  onInsertResult,
  onDeleted,
}: Props) {
  const { colors, fontSizes } = useTheme();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDelete = async () => {
    try {
      await TournamentService.deleteTournament(id);
      onDeleted();
    } catch (error) {
      console.error("Erro ao excluir torneio:", error);
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <Box
        w="100%"
        bg={colors.gray[200]}
        p={4}
        borderRadius={12}
        shadow={1}
        alignItems="center"
      >
        <VStack space={4} alignItems="center" w="100%">
          <Tooltip
            label={tournamentName}
            placement="top"
            openDelay={300}
            bg={colors.gray[300]}
            _text={{ color: colors.black }}
          >
            <Text
              fontSize={fontSizes.lg}
              fontWeight="bold"
              textAlign="center"
              isTruncated
              w="100%"
              maxW="350"
            >
              {tournamentName}
            </Text>
          </Tooltip>

          <HStack space={4} alignItems="center">
            <Button
              px={5}
              py={2}
              bg={colors.blue[500]}
              borderRadius={12}
              onPress={onInsertResult}
              _text={{ fontSize: fontSizes.md, fontWeight: "bold" }}
            >
              Inserir Resultados
            </Button>

            <IconButton
              icon={<MaterialIcons name="edit" size={28} color="black" />}
              onPress={onEdit}
              aria-label="Editar"
            />

            <IconButton
              icon={<MaterialIcons name="delete" size={28} color="black" />}
              onPress={() => setShowConfirmModal(true)}
              aria-label="Excluir"
            />
          </HStack>
        </VStack>
      </Box>

      <GenericModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmação"
        body={
          <Text textAlign="center">
            Deseja realmente excluir o torneio "{tournamentName}"?
          </Text>
        }
        confirmText="Confirmar"
        onConfirm={handleDelete}
        variant="confirm-delete"
      />
    </>
  );
}
