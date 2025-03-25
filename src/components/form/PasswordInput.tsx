import { Input, Icon, IInputProps, Pressable } from "native-base";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";

interface PasswordInputProps extends IInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

export default function PasswordInput({ value, onChangeText, ...rest }: PasswordInputProps) {
    const [show, setShow] = useState(false);

    return (
        <Input
            type={show ? "text" : "password"}
            value={value}
            onChangeText={onChangeText}
            InputRightElement={
                <Pressable onPress={() => setShow(!show)} mr={3}>
                    <Icon as={show ? EyeOff : Eye} size={5} color="gray.400" />
                </Pressable>
            }
            w="100%"
            {...rest}
        />
    );
}
