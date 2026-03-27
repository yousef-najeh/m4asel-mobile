import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import MapCard from "../Components/MapCard";

const { width: WINDOW_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = WINDOW_WIDTH * 0.82;
const CARD_MARGIN = 6; // matches marginHorizontal in MapCard
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;
const CENTER_PADDING = (WINDOW_WIDTH - CARD_WIDTH) / 2 - CARD_MARGIN;

const MapPage = () => {
  const mapRef = useRef(null);
  const flatListRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [locating, setLocating] = useState(false);
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

  const getUserLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert(
          'تعذّر الوصول إلى موقعك',
          'يرجى تفعيل خدمات الموقع من الإعدادات.',
          [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'الإعدادات', onPress: () => Linking.openSettings() },
          ]
        );
        return null;
      }

      let location = await Location.getLastKnownPositionAsync();
      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        });
      }
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }, 1000);
      }

      return { latitude, longitude };
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'تعذّر تحديد موقعك',
        'تأكد من تفعيل خدمات الموقع وحاول مجدداً.',
        [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'الإعدادات', onPress: () => Linking.openSettings() },
        ]
      );
      return null;
    } finally {
      setLocating(false);
    }
  };

  const fetchWashers = async () => {
    try {
      const coords = await getUserLocation();
      if (!coords) return;

      const { latitude, longitude } = coords;
      const url = `${apiUrl}/washers?lat=${latitude}&lng=${longitude}`;
      const response = await fetch(url);
      const data = await response.json();

      const washers = Array.isArray(data) ? data : (data.results || data.washers || []);
      setLocations(washers);

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

  useEffect(() => {
    fetchWashers();
  }, [apiUrl]);

  if (!userLocation && !locating) {
    return (
      <View style={styles.noLocationContainer}>
        <View style={styles.noLocationCard}>
          <View style={styles.noLocationIconCircle}>
            <Icon name="location-off" type="material" size={36} color="#9CA3AF" />
          </View>
          <Text style={styles.noLocationTitle}>الموقع غير متاح</Text>
          <Text style={styles.noLocationSubtitle}>يرجى تفعيل خدمة الموقع لعرض المغاسل القريبة</Text>
          <Pressable style={styles.noLocationBtn} onPress={fetchWashers}>
            <Icon name="my-location" type="material" size={18} color="#FFFFFF" />
            <Text style={styles.noLocationBtnText}>تحديد موقعي</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={userLocation ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        } : undefined}
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

      <Pressable style={styles.locationButton} onPress={fetchWashers} disabled={locating}>
        {locating
          ? <ActivityIndicator size="small" color="#FFFFFF" />
          : <Icon name="my-location" type="material" size={22} color="#FFFFFF" />
        }
      </Pressable>

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

  // No location screen
  noLocationContainer: {
    flex: 1,
    backgroundColor: '#F0F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noLocationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  noLocationIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  noLocationTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  noLocationSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  noLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 28,
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  noLocationBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Location FAB
  locationButton: {
    position: 'absolute',
    top: 56,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  // Cards strip
  cardsContainer: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
  },
  listContent: {
    paddingHorizontal: CENTER_PADDING,
  },
  separator: {
    width: CARD_MARGIN * 2,
  },
});

export default MapPage;
