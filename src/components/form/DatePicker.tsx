// src/components/form/DatePicker.tsx
import React, { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { Input, FormControl, Modal, Button, Text, Icon } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar as CalendarIcon } from 'lucide-react-native';

interface Props {
    date: Date;
    onChange: (date: Date) => void;
}

export default function DatePicker({ date, onChange }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [showPicker, setShowPicker] = useState(false); // Android
    const [tempDate, setTempDate] = useState(date);

    const formattedDate = tempDate.toLocaleDateString('pt-BR');

    const openDatePicker = () => {
        if (Platform.OS === 'android') {
            setShowPicker(true);
        } else {
            setShowModal(true);
        }
    };

    const confirmIOSDate = () => {
        onChange(tempDate);
        setShowModal(false);
    };

    return (
        <>
            <FormControl w="100%">
                <FormControl.Label>Data de Nascimento</FormControl.Label>
                <TouchableOpacity onPress={openDatePicker}>
                    <Input
                        isReadOnly
                        value={formattedDate}
                        placeholder="Selecionar data"
                        bg="gray.100"
                        borderColor="blue.800"
                        borderWidth={1}
                        borderRadius={10}
                        InputRightElement={
                            <TouchableOpacity onPress={openDatePicker}>
                                <Icon as={CalendarIcon} size={5} mr="2" color="gray.300" />
                            </TouchableOpacity>
                        }
                    />
                </TouchableOpacity>
            </FormControl>

            {/* Android Picker */}
            {Platform.OS === 'android' && showPicker && (
                <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) {
                            setTempDate(selectedDate);
                            onChange(selectedDate);
                        }
                    }}
                />
            )}

            {/* iOS Modal Picker */}
            {Platform.OS === 'ios' && (
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content>
                        <Modal.CloseButton />
                        <Modal.Header>Selecione a data</Modal.Header>
                        <Modal.Body>
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="spinner"
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) {
                                        setTempDate(selectedDate);
                                    }
                                }}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onPress={confirmIOSDate}>Confirmar</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            )}
        </>
    );
}
