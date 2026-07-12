import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Linking, Pressable, Text, View, type ViewToken } from "react-native";
import { Icon } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import MapCard from "../components/MapCard";
import { SNAP_INTERVAL } from "../constants";
import { styles } from "../styles/MapScreen.styles";
import { washersService } from "@/src/features/washers/services/washers.service";
import type { Washer } from '@/types/api';

const MapPage = () => {
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList<Washer>>(null);
  const [locations, setLocations] = useState<Washer[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);

  const focusOnMarker = (item: Washer) => {
    if (!item || !mapRef.current) return;
    setSelectedMarker(item.id);
    mapRef.current.animateToRegion({
      latitude: item.latitude - 0.002,
      longitude: item.longitude,
      latitudeDelta: 0.009,
      longitudeDelta: 0.009,
    }, 500);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
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
      const washers = await washersService.nearby(latitude, longitude);
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
  }, []);

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

export default MapPage;
