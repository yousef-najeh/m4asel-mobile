import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, FlatList, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapCard from "../Components/MapCard";
import * as Location from "expo-location";

const { width: WINDOW_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = WINDOW_WIDTH * 0.8;
const SPACING = 12;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;

const MapPage = () => {
  const mapRef = useRef(null);
  const flatListRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const focusOnMarker = (item) => {
    if (!item || !mapRef.current) return;
    setSelectedMarker(item.id);
    mapRef.current.animateToRegion({
      latitude: item.latitude - 0.002,
      longitude: item.longitude,
      latitudeDelta: 0.009,
      longitudeDelta: 0.009,
    }, 500);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].isViewable) {
      const item = viewableItems[0].item;
      focusOnMarker(item);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    const fetchWashers = async () => {
      try {
        // Get location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        // Get user location
        const location = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });

        // Center map on user location
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }, 1000);
        }

        // Fetch washers
        const url = `${apiUrl}/washers?lat=${latitude}&lng=${longitude}`;
        const response = await fetch(url);
        const data = await response.json();

        const washers = Array.isArray(data) ? data : (data.results || data.washers || []);
        setLocations(washers);

        // Select and zoom to first washer
        if (washers.length > 0 && mapRef.current) {
          const firstWasher = washers[0];
          setSelectedMarker(firstWasher.id);
          mapRef.current.animateToRegion({
            latitude: firstWasher.latitude - 0.002,
            longitude: firstWasher.longitude,
            latitudeDelta: 0.009,
            longitudeDelta: 0.009,
          }, 1000);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchWashers();
  }, [apiUrl]);

  const initialRegion = {
    latitude: userLocation?.latitude || 24.7136,
    longitude: userLocation?.longitude || 46.6753,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="mutedStandard"
        userInterfaceStyle="light"
      >
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            pinColor={selectedMarker === loc.id ? "#007AFF" : "#FF3B30"}
            
          />
        ))}
      </MapView>

      <View style={styles.cardsContainer}>
        <FlatList
          ref={flatListRef}
          data={locations}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MapCard item={item} />}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          pagingEnabled={false}
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="start"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  cardsContainer: {
    position: "absolute",
    bottom: 110,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 8,
  },
  separator: {
    width: 12,
  },
});

export default MapPage;
