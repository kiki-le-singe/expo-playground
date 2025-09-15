import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Place } from "./types";

type Props = {
  place: Place;
  width: number;
  spacing: number;
  isSelected?: boolean;
  onPress?: () => void;
};

export default function PlaceCard({ place, width, spacing, isSelected, onPress }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      style={[
        { width, marginHorizontal: spacing / 2 },
        tw`rounded-2xl p-5 shadow-lg`,
        // Background adapts to color scheme
        tw`bg-white/95 dark:bg-zinc-900/95`,
        // Border style with dynamic tint color
        isSelected ? [tw`border-2`, { borderColor: colors.tint }] : [tw`border`, { borderColor: colors.tabIconDefault }],
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-semibold mb-1`} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={[tw`text-sm opacity-70 mb-2`, { minHeight: 36 }]} numberOfLines={2}>
          {place.description}
        </Text>
        <View style={[tw`self-start px-2 py-1 rounded`, { backgroundColor: colors.tint + "20" }]}>
          <Text style={[tw`text-xs font-medium`, { color: colors.tint }]}>{place.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
