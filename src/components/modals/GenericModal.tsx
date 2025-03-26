import React from "react";
import { Modal, Button, Text } from "native-base";
import { ReactNode } from "react";

interface GenericModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    body: ReactNode;
    onConfirm?: () => void;
    confirmText?: string;
}

export default function GenericModal({
    isOpen,
    onClose,
    title,
    body,
    onConfirm,
    confirmText = "Fechar",
}: GenericModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{title}</Modal.Header>
                <Modal.Body>
                    <Text>{body}</Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={onConfirm || onClose}>
                        {confirmText}
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}
