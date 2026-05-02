import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import UniversalMap from "../../components/map/UniversalMap";

export default function LocationPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  const [addressInfo, setAddressInfo] = useState({
    shortCode: "...",
    district: "Locating...",
    city: "Jeddah",
  });

  const currentCoords = useRef({
    latitude: 21.4858,
    longitude: 39.1925,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [mapRegion, setMapRegion] = useState(currentCoords.current);

  const fetchAddressDetails = async (lat: number, lng: number) => {
    // REMOVED: The Platform.OS === "web" check that was forcing Jeddah Central.
    // This now allows the web version to perform reverse geocoding just like mobile.

    try {
      let result = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      if (result.length > 0) {
        const addr = result[0];
        setAddressInfo({
          shortCode: addr.name || "N/A",
          district: addr.district || "Jeddah",
          city: addr.city || "Jeddah",
        });
      }
    } catch (error) {
      console.log("Geocoding error:", error);
    }
  };

  useEffect(() => {
    const getInitialLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoading(false);
          return;
        }

        let current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const initialRegion = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        currentCoords.current = initialRegion;
        setMapRegion(initialRegion);
        fetchAddressDetails(initialRegion.latitude, initialRegion.longitude);
      } catch (e) {
        console.log("Location error");
      } finally {
        setLoading(false);
      }
    };
    getInitialLocation();
  }, []);

  const handleRegionChange = (region: any) => {
    currentCoords.current = region;
    fetchAddressDetails(region.latitude, region.longitude);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={{ marginRight: 10 }}
          />
          <TextInput
            placeholder="Search for your building, area..."
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.mapWrapper}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2B57CC" />
            <Text style={styles.loadingText}>Accessing Map...</Text>
          </View>
        ) : (
          <UniversalMap
            region={mapRegion}
            onRegionChange={handleRegionChange}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>
          Center the pin on your warehouse entrance
        </Text>

        <View style={styles.addressCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="location-sharp" size={24} color="black" />
          </View>
          <View style={styles.addressTextContainer}>
            <Text style={styles.shortCodeText}>
              {`${addressInfo.shortCode} - ${addressInfo.district}`}
            </Text>
            <Text style={styles.subAddressText}>
              {`${addressInfo.district} - ${addressInfo.city} - Saudi Arabia`}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            router.push({
              pathname: "/checkout/address",
              params: {
                lat: currentCoords.current.latitude,
                lng: currentCoords.current.longitude,
                shortCode: addressInfo.shortCode,
                district: addressInfo.district,
                from: params.from, // <--- Add this line to forward the "checkout" flag
              },
            })
          }
        >
          <Text style={styles.btnText}>Add address details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  searchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 25,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    elevation: 5,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    elevation: 5,
  },
  searchInput: { flex: 1, fontSize: 14 },
  mapWrapper: { flex: 1 },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#666" },
  footer: {
    padding: 25,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
  },
  hint: {
    color: "#64748B",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 12,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconCircle: {
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  addressTextContainer: { flex: 1 },
  shortCodeText: { fontSize: 16, fontWeight: "bold", color: "#0F172A" },
  subAddressText: { fontSize: 13, color: "#64748B", marginTop: 2 },
  btn: {
    backgroundColor: "#2B57CC",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
