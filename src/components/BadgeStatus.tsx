import { Box, Text, useTheme } from "native-base";

interface BadgeStatusProps {
  label: string;
  bgColor?: string;
  textColor?: string;
  fontWeight?: string; // NOVO!
}

export default function BadgeStatus({ label, bgColor, textColor, fontWeight }: BadgeStatusProps) {
  const { colors } = useTheme();

  return (
    <Box
      bg={bgColor || colors.gray[100]}
      px={2}
      py={1}
      marginBottom={1}
      marginTop={1}
      borderRadius={5}
      alignSelf="flex-start"
    >
      <Text
        fontSize="10"
        color={textColor || colors.black}
        fontWeight={fontWeight || "normal"}
      >
        {label}
      </Text>
    </Box>
  );
}
