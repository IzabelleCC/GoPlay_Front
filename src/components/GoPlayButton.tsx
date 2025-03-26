import { Button, Text } from "native-base";

interface GoPlayButtonProps {
    text: string;
    bgColor: string;
    textColor: string;
    fontSize: number;
    fontFamily: string;
    height?: number;
    onPress: () => void;
}

export function GoPlayButton({
    text,
    bgColor,
    textColor,
    fontSize,
    fontFamily,
    height = 12,
    onPress,
}: GoPlayButtonProps) {
    return (
        <Button
            w="100%"
            h={height}
            bg={bgColor}
            justifyContent="center"
            alignItems="center"
            borderRadius={20}
            _pressed={{ opacity: 0.8 }}
            onPress={onPress}
        >
            <Text
                color={textColor}
                fontSize={fontSize}
                fontFamily={fontFamily}
                textAlign="center"
            >
                {text}
            </Text>
        </Button>
    );
}
