import React, { useState } from "react";
import {
    Avatar,
    Box,
    IconButton,
    Text,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { TournamentService } from "../api/tournament/tournamentService";

interface Props {
    tournamentId: number;
    initialImageUrl?: string;
}

export default function TournamentPictureUploader({ tournamentId, initialImageUrl }: Props) {
    const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
    const [uploading, setUploading] = useState(false);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Permissão para acessar a galeria é necessária.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            try {
                setUploading(true);
                const image = result.assets[0];

                const fileUri = image.uri;
                const fileName = fileUri.split("/").pop() || "tournament.jpg";

                const formData = new FormData();
                formData.append("file", {
                    uri: fileUri,
                    name: fileName,
                    type: "image/jpeg",
                } as any);

                const uploadedUrl = await TournamentService.uploadTournamentPicture(tournamentId, formData);
                setImageUrl(uploadedUrl);
                alert("Imagem do torneio enviada com sucesso!");
            } catch (error) {
                alert("Erro ao enviar a imagem do torneio.");
                console.error(error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <Box alignItems="center" mt={4}>
            <Box position="relative">
                <Avatar
                    bg="blue.500"
                    size="xl"
                    source={imageUrl ? { uri: imageUrl } : undefined}
                />

                <IconButton
                    onPress={handlePickImage}
                    icon={<MaterialIcons name="photo-camera" size={20} color="black" />}
                    borderRadius="full"
                    bg="gray.300"
                    size="sm"
                    isDisabled={uploading}
                    position="absolute"
                    bottom={0}
                    right={0}
                    zIndex={1}
                />
            </Box>
        </Box>
    );
}
