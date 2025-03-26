import React from "react";
import {
    Modal,
    Button,
    Text,
    useTheme,
    VStack,
    HStack,
    CloseIcon,
    IconButton,
} from "native-base";

interface GenericModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    body: React.ReactNode;
    onConfirm: () => void;
    confirmText: string;
    isLoading?: boolean;
}

export default function GenericModal({
    isOpen,
    onClose,
    title,
    body,
    onConfirm,
    confirmText,
    isLoading = false,
}: GenericModalProps) {
    const { colors } = useTheme();

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
                <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="xl" fontWeight="bold" flex={1} textAlign="center">
                        {title}
                    </Text>
                    <IconButton
                        icon={<CloseIcon size="3" color="gray.500" />}
                        borderRadius="full"
                        onPress={onClose}
                        position="absolute"
                        right={0}
                        top={0}
                    />
                </HStack>

                <VStack space={4} mt={4}>
                    {body}
                </VStack>

                <Button
                    mt={6}
                    onPress={onConfirm}
                    isLoading={isLoading}
                    bg={colors.blue[500]}
                    borderRadius={20}
                    _pressed={{ opacity: 0.9 }}
                >
                    <Text color="white" fontWeight="bold" fontSize="md">
                        {confirmText}
                    </Text>
                </Button>
            </Modal.Content>
        </Modal>
    );
}
