import React from "react";
import {
    Modal,
    Button,
    Text,
    useTheme,
    VStack,
    IconButton,
    CloseIcon,
    Icon,
    Center
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

type ModalType = "info" | "success" | "error";
type ModalVariant = "info" | "success" | "error" | "confirm-delete" | "reset-password";

interface GenericModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    body: React.ReactNode;
    onConfirm?: () => void;
    confirmText?: string;
    isLoading?: boolean;
    type?: ModalType;
    variant?: ModalVariant;
}

export default function GenericModal({
    isOpen,
    onClose,
    title,
    body,
    onConfirm = () => {},
    confirmText = "Confirmar",
    isLoading = false,
    type = "info",
    variant = "info"
}: GenericModalProps) {
    const { colors } = useTheme();

    const getIconData = () => {
        switch (type) {
            case "success":
                return { name: "check-circle", color: "green.500" };
            case "error":
                return { name: "error", color: "red.500" };
            default:
                return { name: "info", color: "blue.500" };
        }
    };

    const iconData = getIconData();

    const renderFooter = () => {
        if (variant === "confirm-delete") {
            return (
                <VStack space={3} mt={6} w="100%">
                    <Button
                        bg={colors.blue[500]}
                        borderRadius={20}
                        onPress={onClose}
                        _pressed={{ opacity: 0.9 }}
                    >
                        <Text color="white" fontWeight="bold">Cancelar</Text>
                    </Button>
                    <Button
                        variant="outline"
                        borderColor={colors.gray[400]}
                        borderRadius={20}
                        onPress={onConfirm}
                    >
                        <Text color={colors.gray[600]} fontWeight="bold">{confirmText}</Text>
                    </Button>
                </VStack>
            );
        }

        if (variant === "reset-password") {
            return (
                <VStack space={3} mt={6} w="100%">
                    <Button
                        bg={colors.blue[500]}
                        borderRadius={20}
                        onPress={onConfirm}
                        isLoading={isLoading}
                        _pressed={{ opacity: 0.9 }}
                    >
                        <Text color="white" fontWeight="bold">{confirmText}</Text>
                    </Button>
                    <Button
                        variant="outline"
                        borderColor={colors.gray[400]}
                        borderRadius={20}
                        onPress={onClose}
                    >
                        <Text color={colors.gray[600]} fontWeight="bold">Cancelar</Text>
                    </Button>
                </VStack>
            );
        }

        // Default: apenas botão "Fechar"
        return (
            <Button
                mt={6}
                onPress={onClose}
                bg={colors.blue[500]}
                borderRadius={20}
                _pressed={{ opacity: 0.9 }}
            >
                <Text color="white" fontWeight="bold">Fechar</Text>
            </Button>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content
                bg="white"
                borderRadius="2xl"
                p={4}
                mx={4}
                _android={{ width: "95%" }}
                _ios={{ width: "90%" }}
            >
                <IconButton
                    icon={<CloseIcon size="3" color="gray.500" />}
                    borderRadius="full"
                    onPress={onClose}
                    position="absolute"
                    right={2}
                    top={2}
                    zIndex={1}
                />

                <Center mt={2}>
                    <Icon
                        as={MaterialIcons}
                        name={iconData.name}
                        size="3xl"
                        color={iconData.color}
                    />
                    <Text fontSize="xl" fontWeight="bold" mt={2} textAlign="center">
                        {title}
                    </Text>
                </Center>

                <VStack space={4} mt={4} alignItems="center">
                    {body}
                </VStack>

                {renderFooter()}
            </Modal.Content>
        </Modal>
    );
}
