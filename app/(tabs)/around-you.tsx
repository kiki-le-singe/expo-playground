import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import MapView, { Marker, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlacesCarousel from "@/components/around-you/places-carousel";
import SearchBar from "@/components/around-you/search-bar";
import { Place } from "@/components/around-you/types";

// Données factices pour Marseille, Paris et Lyon
const FAKE_PLACES: Place[] = [
  // Marseille
  {
    id: "1",
    name: "Vieux-Port de Marseille",
    description: "Port historique au cœur de Marseille",
    city: "Marseille",
    latitude: 43.2945,
    longitude: 5.375,
    category: "Monument",
  },
  {
    id: "2",
    name: "Basilique Notre-Dame de la Garde",
    description: "Basilique emblématique surplombant Marseille",
    city: "Marseille",
    latitude: 43.2842,
    longitude: 5.3714,
    category: "Monument",
  },
  {
    id: "3",
    name: "Calanques de Marseille",
    description: "Parc national des Calanques",
    city: "Marseille",
    latitude: 43.212,
    longitude: 5.438,
    category: "Nature",
  },

  // Paris
  {
    id: "4",
    name: "Tour Eiffel",
    description: "Monument emblématique de Paris",
    city: "Paris",
    latitude: 48.8584,
    longitude: 2.2945,
    category: "Monument",
  },
  {
    id: "5",
    name: "Musée du Louvre",
    description: "Plus grand musée d'art du monde",
    city: "Paris",
    latitude: 48.8606,
    longitude: 2.3376,
    category: "Musée",
  },
  {
    id: "6",
    name: "Arc de Triomphe",
    description: "Monument commémoratif sur les Champs-Élysées",
    city: "Paris",
    latitude: 48.8738,
    longitude: 2.295,
    category: "Monument",
  },

  // Lyon
  {
    id: "7",
    name: "Basilique Notre-Dame de Fourvière",
    description: "Basilique surplombant Lyon",
    city: "Lyon",
    latitude: 45.7624,
    longitude: 4.8223,
    category: "Monument",
  },
  {
    id: "8",
    name: "Vieux Lyon",
    description: "Quartier Renaissance classé UNESCO",
    city: "Lyon",
    latitude: 45.764,
    longitude: 4.827,
    category: "Quartier",
  },
  {
    id: "9",
    name: "Parc de la Tête d'Or",
    description: "Grand parc urbain de Lyon",
    city: "Lyon",
    latitude: 45.7772,
    longitude: 4.857,
    category: "Nature",
  },
];

const INITIAL_REGION: Region = {
  latitude: 46.2276, // Centre de la France
  longitude: 2.2137,
  latitudeDelta: 8.0,
  longitudeDelta: 8.0,
};

export default function AroundYouScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [places] = useState<Place[]>(FAKE_PLACES);
  const mapRef = useRef<MapView>(null);
  // Réglages du carousel (transmis au composant)
  const SIDE_PEEK = 16; // portion visible de la carte adjacente
  const CARD_SPACING = 8; // espace entre cartes

  // Filtrer les lieux selon la recherche
  const q = searchQuery.trim().toLowerCase();
  const filteredPlaces = q.length === 0
    ? places
    : places.filter((place) =>
        place.name.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q) ||
        place.category.toLowerCase().includes(q) ||
        place.city.toLowerCase().includes(q)
      );

  // Fonction pour se déplacer vers un lieu sur la carte
  const moveToPlace = (place: Place) => {
    setSelectedPlace(place);
    mapRef.current?.animateToRegion(
      {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000
    );
  };

  // Fonction appelée quand on appuie sur un marker
  const [carouselTarget, setCarouselTarget] = useState<number | null>(null);
  const onMarkerPress = (place: Place) => {
    setSelectedPlace(place);
    const index = filteredPlaces.findIndex((p) => p.id === place.id);
    if (index !== -1) setCarouselTarget(index);
  };

  // plus de FlatList ici: délégué au composant PlacesCarousel

  return (
    <View style={tw`flex-1`}>
      {/* Barre de recherche en overlay */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Carte en plein écran */}
      <MapView
        ref={mapRef}
        style={tw`flex-1 w-full h-full`}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.description}
            onPress={() => onMarkerPress(place)}
            pinColor={selectedPlace?.id === place.id ? colors.tint : "red"}
          />
        ))}
      </MapView>

      {/* Liste horizontale en overlay en bas */}
      <View
        style={[
          tw`absolute bottom-0 left-0 right-0 pt-5`,
          { left: insets.left, right: insets.right, paddingBottom: 20 + insets.bottom, backgroundColor: "transparent", overflow: "visible" },
        ]}
      >
        <PlacesCarousel
          places={filteredPlaces}
          selectedPlaceId={selectedPlace?.id ?? null}
          sidePeek={SIDE_PEEK}
          cardSpacing={CARD_SPACING}
          scrollToIndex={carouselTarget}
          onCenteredItemChange={(place) => {
            setSelectedPlace(place);
            moveToPlace(place);
            if (carouselTarget != null) setCarouselTarget(null);
          }}
          onCardPrimaryPress={(place) => moveToPlace(place)}
        />
      </View>
    </View>
  );
}
