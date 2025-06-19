import React, { useState } from "react";
import {
    Avatar,
    Box,
    IconButton,
    Pressable,
    Text,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { UserService } from "../api/user/userService";

interface Props {
    userId: string;
    name: string;
    initialProfileUrl?: string;
}

export default function ProfilePictureUploader({ userId, name, initialProfileUrl }: Props) {
    const [profileUrl, setProfileUrl] = useState<string | undefined>(initialProfileUrl);
    const [uploading, setUploading] = useState(false);

    const getInitials = (fullName: string) => {
        return fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

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
                const fileName = fileUri.split("/").pop() || "profile.jpg";

                const formData = new FormData();
                formData.append("file", {
                    uri: fileUri,
                    name: fileName,
                    type: "image/jpeg",
                } as any);

                const uploadedUrl = await UserService.uploadProfilePicture(userId, formData);

                setProfileUrl(uploadedUrl);
                alert("Foto enviada com sucesso!");
            } catch (error) {
                alert("Erro ao enviar a imagem.");
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
                    source={profileUrl ? { uri: profileUrl } : undefined}
                >
                    {!profileUrl && (
                        <Text fontSize="2xl" color="white">
                            {getInitials(name)}
                        </Text>
                    )}
                </Avatar>

                {/* Botão de troca de imagem */}
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
