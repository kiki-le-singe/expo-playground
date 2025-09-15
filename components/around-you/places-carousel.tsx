import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import PlaceCard from "./place-card";
import { Place } from "./types";

type Props = {
  places: Place[];
  selectedPlaceId?: string | null;
  sidePeek?: number; // px of adjacent card visible
  cardSpacing?: number; // space between cards
  onCenteredItemChange?: (place: Place, index: number) => void;
  onCardPrimaryPress?: (place: Place) => void;
  scrollToIndex?: number | null; // externally forced scroll (e.g., tapping a marker)
};

export default function PlacesCarousel({
  places,
  selectedPlaceId,
  sidePeek = 16,
  cardSpacing = 8,
  onCenteredItemChange,
  onCardPrimaryPress,
  scrollToIndex = null,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get("window");
  const availableWidth = screenWidth - insets.left - insets.right;

  const CARD_WIDTH = availableWidth - 2 * (sidePeek + cardSpacing);
  const ITEM_LENGTH = CARD_WIDTH + cardSpacing;
  const SIDE_SPACER = sidePeek + cardSpacing / 2;

  const flatRef = useRef<FlatList<Place>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const offsets = useMemo(
    () => places.map((_, i) => i * ITEM_LENGTH),
    [places, ITEM_LENGTH]
  );

  // External scroll (e.g., via map marker)
  useEffect(() => {
    if (scrollToIndex == null) return;
    if (scrollToIndex < 0 || scrollToIndex >= places.length) return;
    if (scrollToIndex === currentIndex) return;
    flatRef.current?.scrollToIndex({ index: scrollToIndex, animated: true });
  }, [scrollToIndex, places.length, currentIndex]);

  const renderItem = ({ item, index }: { item: Place; index: number }) => (
    <PlaceCard
      place={item}
      width={CARD_WIDTH}
      spacing={cardSpacing}
      isSelected={selectedPlaceId === item.id}
      onPress={() => {
        if (index !== currentIndex) {
          flatRef.current?.scrollToIndex({ index, animated: true });
        } else {
          onCardPrimaryPress?.(item);
        }
      }}
    />
  );

  return (
    <FlatList
      ref={flatRef}
      data={places}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      style={tw`overflow-visible`}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: SIDE_SPACER }}
      snapToOffsets={offsets}
      decelerationRate="fast"
      snapToAlignment="start"
      pagingEnabled={false}
      bounces={false}
      overScrollMode="never"
      contentInsetAdjustmentBehavior="never"
      automaticallyAdjustContentInsets={false}
      contentInset={{ left: 0, right: 0 }}
      removeClippedSubviews={false}
      scrollEventThrottle={16}
      onMomentumScrollEnd={(e) => {
        const x = e.nativeEvent.contentOffset.x;
        const idx = Math.max(0, Math.round(x / ITEM_LENGTH));
        setCurrentIndex(idx);
        const place = places[idx];
        if (place && onCenteredItemChange) onCenteredItemChange(place, idx);
      }}
      getItemLayout={(_, index) => ({
        length: ITEM_LENGTH,
        offset: ITEM_LENGTH * index,
        index,
      })}
    />
  );
}
