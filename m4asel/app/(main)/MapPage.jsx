import React, { useRef, useState } from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    FlatList,
    } from "react-native";
    import MapView, { Marker } from "react-native-maps";
    import MapCard from "../Components/MapCard";

    const { width: WINDOW_WIDTH } = Dimensions.get("window");
    const CARD_WIDTH = WINDOW_WIDTH * 0.8;
    const SPACING_FOR_CARD = (WINDOW_WIDTH - CARD_WIDTH) / 2; 

    const MapPage = () => {
    const mapRef = useRef(null);
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // welcome -> can pass-> but cant book (also map appears)
    // version manager (on front end) if app version is less that newest->update(force update)
    

    const moveMapToLocation = (index) => {
        const location = locations[index]?.coordinate;
        if (!location) return;

        mapRef.current?.animateToRegion(
        {
            ...location,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        },
        1000
        );
    };

    const onScrollEnd = (e) => {
        const contentOffset = e.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / CARD_WIDTH);
        setCurrentIndex(index);
        moveMapToLocation(index);
    };

    const scrollToIndex = (index) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setCurrentIndex(index);
        moveMapToLocation(index);
    };

    return (
        <View style={styles.container}>
        {/* MAP */}
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
                latitude: locations[0].coordinate.latitude,
                longitude: locations[0].coordinate.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            }}
        >
            {locations.map((loc, index) => (
            <Marker
                key={loc.id}
                coordinate={loc.coordinate}
                onPress={() => scrollToIndex(index)}
            />
            ))}
        </MapView>

        {/* CENTERED CAROUSEL */}
        <View style={styles.carouselContainer}>
            <FlatList
            ref={flatListRef}
            data={locations}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            pagingEnabled={true} // We'll control snapping manually via snapToInterval
            snapToInterval={CARD_WIDTH}
            snapToAlignment="center"
            decelerationRate="fast"
            bounces={false}
            contentContainerStyle={{
                paddingHorizontal: SPACING_FOR_CARD-10, // This is the key!
            }}
            onMomentumScrollEnd={onScrollEnd}
            getItemLayout={(data, index) => ({
                length: CARD_WIDTH,
                offset: CARD_WIDTH * index,
                index,
            })}
            renderItem={({ item }) => (
                    <MapCard item={item} />
            )}
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
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    carouselContainer: {
        position: "absolute",
        bottom: 110,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    card: {
        width: CARD_WIDTH,
        padding: 24,
        backgroundColor: "white",
        borderRadius: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        textAlign: "center",
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 8,
        textAlign: "right",
    },
    cardDescription: {
        fontSize: 16,
        color: "#666",
        textAlign: "right",
    },
    });

    const locations = [
        {
        id: "1",
        name: "مغسلة الاستقلال",
        rating: 4.5,
        available_within:"2 :30",
        services: ["خارجي", "داخلي", "خارجي وداخلي"],
        location : "جمب السنسلة",
        coordinate: { latitude: 40.7128, longitude: -74.006 },
        },
        {
        id: "2",
        title: "Los Angeles",
        description: "City of Angels",
        coordinate: { latitude: 34.0522, longitude: -118.2437 },
        },
        {
        id: "3",
        title: "London",
        description: "Capital of England",
        coordinate: { latitude: 51.5074, longitude: -0.1278 },
        },
        {
        id: "4",
        title: "London",
        description: "Capital of England",
        coordinate: { latitude: 51.5074, longitude: -0.1278 },
        },
        {
        id: "5",
        title: "London",
        description: "Capital of England",
        coordinate: { latitude: 51.5074, longitude: -0.1278 },
        },
        {
        id: "6س",
        title: "London",
        description: "Capital of England",
        coordinate: { latitude: 51.5074, longitude: -0.1278 },
        },
    ];

    export default MapPage; 