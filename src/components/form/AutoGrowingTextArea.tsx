import React, { useState } from "react";
import { TextArea, useTheme, VStack, Text } from "native-base";
import { NativeSyntheticEvent, TextInputContentSizeChangeEventData } from "react-native";

interface AutoGrowingTextAreaProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  maxHeight?: number;
  minHeight?: number;
  label?: string;
}

export default function AutoGrowingTextArea({
  value,
  placeholder = "Digite aqui...",
  onChange,
  maxHeight = 200,
  minHeight = 100,
  label = "Descrição",
}: AutoGrowingTextAreaProps) {
  const { colors } = useTheme();
  const [height, setHeight] = useState(minHeight);

  const textAreaProps = {
    placeholder,
    value,
    onChange: (e: any) => onChange(e.nativeEvent.text),
    onContentSizeChange: (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const newHeight = e.nativeEvent.contentSize.height;
      setHeight(Math.min(newHeight, maxHeight));
    },
    bg: colors.gray[100],
    borderRadius: 10,
    fontSize: "md",
    variant: "filled",
    h: height,
    textAlignVertical: "top",
    overflow: "scroll",
  };

  return (
    <VStack space={1}>
      <Text fontWeight="medium" fontSize="sm" color={colors.gray[600]}>
        {label}
      </Text>
      <TextArea {...(textAreaProps as any)} />
    </VStack>
  );
}
