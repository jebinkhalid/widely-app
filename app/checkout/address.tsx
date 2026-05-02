import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddressDetailsPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // --- Form States ---
  const [addressType, setAddressType] = useState("Home");
  const [aptNo, setAptNo] = useState("");

  // NEW FIELDS & EDITABLE LOCATION DATA
  const [buildingName, setBuildingName] = useState("");
  const [directions, setDirections] = useState("");
  const [nickname, setNickname] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Sync location data to state ONLY on initial load
  // 1. Sync data on load: If editing, find the existing address and fill the fields
  useEffect(() => {
    const loadExistingData = async () => {
      // If there is an ID in params, we are in "Edit Mode"
      if (params.id) {
        const saved = await AsyncStorage.getItem("user_addresses");
        if (saved) {
          const list = JSON.parse(saved);
          const existing = list.find((item: any) => item.id === params.id);

          if (existing) {
            // Fill your states with the existing data so it's not empty
            setAddressType(existing.type || "Home");
            setFirstName(existing.name.split(" ")[0] || "");
            setLastName(existing.name.split(" ")[1] || "");
            setPhone(existing.phone.replace("+966", ""));
            setNickname(existing.nickname || "");
            setDirections(existing.directions || "");
            // Split the text to recover buildingName and aptNo if needed
            // or better yet, store them as separate keys in the object
          }
        }
      } else {
        // "New Mode": Just set the building name from the map
        const initialLocation = (params.shortCode ||
          params.buildingName ||
          "") as string;
        setBuildingName(initialLocation);
      }
    };
    loadExistingData();
  }, [params.id]);

  // --- Validation Logic ---
  const isFormValid =
    aptNo.trim() !== "" &&
    buildingName.trim() !== "" &&
    firstName.trim() !== "" &&
    phone.length >= 9;

  const handleSave = async () => {
    if (!isFormValid) return;

    try {
      const saved = await AsyncStorage.getItem("user_addresses");
      let list = saved ? JSON.parse(saved) : [];

      const addressData = {
        id: (params.id as string) || Date.now().toString(),
        type: addressType,
        text: `${aptNo}, ${buildingName}, ${params.district || "Jeddah"}`,
        directions: directions,
        nickname: nickname,
        name: `${firstName} ${lastName}`,
        phone: `+966${phone}`,
      };

      if (params.id) {
        // Edit existing
        list = list.map((item: any) =>
          item.id === params.id ? addressData : item,
        );
      } else {
        // Add new
        list.push(addressData);

        // Auto-default if it's the first one
        if (list.length === 1) {
          await AsyncStorage.setItem("default_address_id", addressData.id);
        }
      }

      await AsyncStorage.setItem("user_addresses", JSON.stringify(list));

      // --- THE NAVIGATION FIX ---
      if (params.from === "checkout") {
        // If coming from Cart -> Map -> Here, go to Payment
        router.replace("/checkout/payment");
      } else {
        // Otherwise, go back to the Address Book list (for Profile management)
        router.replace("/checkout/address-book");
      }
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainWrapper}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>Address Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Location Summary (Top Card) */}
        <View style={styles.addressSummaryCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="location-sharp" size={24} color="#2B57CC" />
          </View>
          <View style={styles.addressInfo}>
            <Text style={styles.shortCodeTitle}>
              {buildingName || "Selected Location"}
            </Text>
            <Text style={styles.fullAddressSub}>
              {params.district || "Mishrifah"} - Jeddah - Saudi Arabia
            </Text>
          </View>
        </View>

        {/* Address Type Selector */}
        <Text style={styles.sectionLabel}>Save address as</Text>
        <View style={styles.typeSelector}>
          {["Home", "Work", "Other"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeBtn,
                addressType === type && styles.typeBtnActive,
              ]}
              onPress={() => setAddressType(type)}
            >
              <Ionicons
                name={
                  type === "Home"
                    ? "home"
                    : type === "Work"
                      ? "briefcase"
                      : "location"
                }
                size={18}
                color={addressType === type ? "white" : "#1E293B"}
              />
              <Text
                style={[
                  styles.typeText,
                  addressType === type && styles.typeTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Form Section */}
        <View style={styles.formSection}>
          {/* 1. Apt & Floor */}
          <Text style={styles.inputLabel}>Apt & Floor No. / Villa No. *</Text>
          <TextInput
            style={[styles.input, aptNo === "" && styles.inputError]}
            placeholder="e.g. Apt 4, Floor 2"
            value={aptNo}
            onChangeText={setAptNo}
          />
          {aptNo === "" && (
            <Text style={styles.errorText}>This field is required</Text>
          )}

          {/* 2. National Address / Building (Editable) */}
          <Text style={styles.inputLabel}>
            National address / Building name *
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Address here"
            value={buildingName}
            onChangeText={setBuildingName} // Allows manual override
          />

          {/* 3. Directions (Optional) */}
          <Text style={styles.inputLabel}>Directions to reach (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Near the main entrance"
            value={directions}
            onChangeText={setDirections}
          />

          {/* 4. Nickname (Optional) */}
          <Text style={styles.inputLabel}>Address nickname (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mom's House"
            value={nickname}
            onChangeText={setNickname}
          />

          {/* Receiver Details */}
          <Text style={styles.sectionTitle}>Receiver details</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="First name *"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryText}>+966</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="5X XXX XXXX"
              keyboardType="phone-pad"
              maxLength={9}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            !isFormValid && { backgroundColor: "#A5B4FC", shadowOpacity: 0 },
          ]}
          onPress={handleSave}
          disabled={!isFormValid}
        >
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: "white" },
  scrollContainer: { padding: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 15,
  },
  backBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitleText: { fontSize: 20, fontWeight: "bold", color: "#0F172A" },
  addressSummaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconCircle: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    marginRight: 12,
  },
  addressInfo: { flex: 1 },
  shortCodeTitle: { fontWeight: "700", fontSize: 15 },
  fullAddressSub: { fontSize: 12, color: "#64748B" },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 12,
  },
  typeSelector: { flexDirection: "row", marginBottom: 25 },
  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 10,
    backgroundColor: "#F8FAFC",
  },
  typeBtnActive: { backgroundColor: "#1E293B", borderColor: "#1E293B" },
  typeText: { marginLeft: 8, fontWeight: "600", color: "#1E293B" },
  typeTextActive: { color: "white" },
  formSection: { marginBottom: 10 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    fontSize: 15,
    color: "#0F172A",
  },
  inputError: { borderWidth: 1, borderColor: "#EF4444" },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -14,
    marginBottom: 14,
    marginLeft: 6,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 15,
    color: "#0F172A",
  },
  row: { flexDirection: "row" },
  phoneInputContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    alignItems: "center",
  },
  countryCode: {
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    height: 55,
    justifyContent: "center",
  },
  countryText: { fontWeight: "bold", color: "#0F172A" },
  phoneInput: { flex: 1, padding: 16, fontSize: 15 },
  saveBtn: {
    backgroundColor: "#2B57CC",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
    elevation: 4,
    shadowColor: "#2B57CC",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
