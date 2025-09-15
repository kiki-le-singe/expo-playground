import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { TextInput, View } from "react-native";
import tw from "twrnc";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
};

export default function SearchBar({ value, onChangeText }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        tw`absolute z-50 rounded-full px-1 py-1`,
        { top: 50, left: 16, right: 16 },
      ]}
    >
      <TextInput
        style={[
          tw`h-11 rounded-full px-4 text-base border`,
          {
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.tabIconDefault,
          },
        ]}
        placeholder="Rechercher un lieu..."
        placeholderTextColor={colors.tabIconDefault}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
