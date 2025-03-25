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
    const [showCalendar, setShowCalendar] = useState(false); // Android
    const [tempDate, setTempDate] = useState(date);

    const formattedDate = tempDate.toLocaleDateString('pt-BR');

    const handleConfirm = () => {
        onChange(tempDate);
        setShowModal(false);
    };

    const handleOpen = () => {
        if (Platform.OS === 'android') {
            setShowCalendar(true);
        } else {
            setShowModal(true);
        }
    };

    return (
        <>
            <FormControl w="100%">
                <FormControl.Label>Data de Nascimento</FormControl.Label>
                <TouchableOpacity onPress={handleOpen}>
                    <Input
                        isReadOnly
                        value={formattedDate}
                        placeholder="Selecionar data"
                        InputRightElement={
                            <Icon as={CalendarIcon} size={5} mr="2" color="gray.400" />
                        }
                    />
                </TouchableOpacity>
            </FormControl>

            {/* Android Date Picker */}
            {Platform.OS === 'android' && showCalendar && (
                <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="calendar"
                    onChange={(event, selectedDate) => {
                        setShowCalendar(false);
                        if (selectedDate) {
                            setTempDate(selectedDate);
                            onChange(selectedDate);
                        }
                    }}
                />
            )}

            {/* iOS Modal Date Picker */}
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
                                if (selectedDate) setTempDate(selectedDate);
                            }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onPress={handleConfirm}>Confirmar</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
}
