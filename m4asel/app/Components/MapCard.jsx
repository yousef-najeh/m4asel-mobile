import { 
    Text,
    Dimensions,
    StyleSheet,
    Pressable,
    View,
    TouchableOpacity
} from "react-native";
import { router } from 'expo-router';
import { Rating, AirbnbRating } from 'react-native-elements';
import { Icon } from 'react-native-elements';

const { width: WINDOW_WIDTH } = Dimensions.get("window");
    const CARD_WIDTH = WINDOW_WIDTH * 0.8;

function MapCard({item}) {
    return ( 
        <Pressable 
            style={styles.card}
            onPress={() => router.push('/Login')}
        >
        <Text style={styles.cardTitle}>{item.name} </Text>
        <View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent:"flex-end"   
                        }}>
                    <Icon
                        name="star"
                        type="font-awesome"
                        color="#FFD700"
                        size={22}
                    />
                    <Text style={{ fontSize: 18, color: "#222", marginLeft: 6 }}>
                        {item.rating} 
                    </Text>
                </View>

                <View
                    style={{
                    width: 1,
                    height: 18,      // same height as text
                    backgroundColor: "#888",
                    marginHorizontal: 8,
                    }}
                />
                <Text style={{ fontSize: 18, color: "#666", textAlign: "right", marginTop: 4 }}>
                كم  1.2  
                </Text> 
            </View>
            <View style={{ flexDirection: "row", 
                            alignItems: "center", 
                            marginTop: 8, 
                            justifyContent:"flex-end",
                            gap: 6 
                        }}>
                <Text style={styles.cardLocation}>{item.location}</Text>
                <Icon
                    name="map-marker"      // name of the location icon
                    type="font-awesome"     // from FontAwesome
                    color="#888"            // gray color like your screenshot
                    size={18}               // adjust size to match text
                />
            </View>
            <View style={{ flexDirection: "row", 
                            alignItems: "center", 
                            marginTop: 8,
                            justifyContent:"flex-end",
                            gap: 6 
                        }}>
                <Text style={{ fontSize: 16, color: "#666", textAlign: "right", marginTop: 4 }}>
                        اقرب وقت اليوم 2:30
                </Text> 
                <Icon
                    name="clock-o"      // name of the clock icon
                    type="font-awesome" // from FontAwesome
                    color="#888"        // gray color
                    size={18}           // adjust size to match text
                />
                
            </View>
            <View>
                <View style={{ marginTop: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#222", marginBottom: 4, textAlign: "right" }}>
                        الخدمات المتوفرة:
                    </Text>
                    <Text style={{ fontSize: 16, color: "#666", textAlign: "right" }}>
                        {Array.isArray(item.services) ? item.services.join(", ") : "لا توجد خدمات"}
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#007AFF",
                        paddingVertical: 14,
                        borderRadius: 12,
                        marginTop: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}
                    onPress={() => console.log("Book Now pressed")}
                    >
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                        احجز الان
                    </Text>
                </TouchableOpacity>
            </View>

        </View>

        </Pressable>
    );
}

const styles = StyleSheet.create({
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
    cardLocation: {

        fontSize: 16,
        color: "#666",
        textAlign: "right",
    },
});


export default MapCard;