import { Button, Text, IButtonProps } from "native-base";

interface GoPlayButtonProps extends IButtonProps {
    text: string;
    bgColor: string;
    textColor?: string;
    fontSize?: number;
}

export function GoPlayButton({
    text,
    bgColor,
    textColor = "#fff",
    fontSize = 16,
    ...rest
}: GoPlayButtonProps) {
    return (
        <Button
            w="80%"
            borderRadius={20}
            py={3}
            bg={bgColor}
            _pressed={{ opacity: 0.8 }}
            {...rest}
        >
            <Text fontSize={fontSize} color={textColor} fontWeight="bold">
                {text}
            </Text>
        </Button>
    );
}
