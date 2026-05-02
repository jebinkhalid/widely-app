import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Data Interface ---
interface Address {
  id: string;
  type: "Home" | "Work" | "Other";
  text: string;
  name: string;
  phone: string;
}

const STORAGE_KEY = "user_addresses";
const DEFAULT_KEY = "default_address_id";

export default function AddressBookScreen() {
  const router = useRouter();

  // --- State ---
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultId, setDefaultId] = useState<string | null>(null);

  // 1. LOAD DATA ON MOUNT
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const savedAddresses = await AsyncStorage.getItem(STORAGE_KEY);
        const savedDefault = await AsyncStorage.getItem(DEFAULT_KEY);

        if (savedAddresses) {
          const parsed = JSON.parse(savedAddresses);
          setAddresses(parsed);

          // Auto-fix default if there's only one address or previously saved
          if (parsed.length === 1) {
            setDefaultId(parsed[0].id);
          } else {
            setDefaultId(
              savedDefault || (parsed.length > 0 ? parsed[0].id : null),
            );
          }
        }
      } catch (e) {
        console.error("Failed to load addresses", e);
      }
    };
    loadPersistedData();
  }, []);

  // 2. SAVE DATA HELPER
  const persistData = async (
    newList: Address[],
    newDefaultId: string | null,
  ) => {
    try {
      setAddresses(newList);
      setDefaultId(newDefaultId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      if (newDefaultId) {
        await AsyncStorage.setItem(DEFAULT_KEY, newDefaultId);
      }
    } catch (e) {
      console.error("Failed to save data", e);
    }
  };

  // 3. SELECTION LOGIC
  const handleSelectDefault = (id: string) => {
    persistData(addresses, id);
  };

  // 4. DELETE LOGIC (Now Permanent)
  const handleDelete = () => {
    if (!selectedAddress) return;

    const performDelete = async () => {
      const newList = addresses.filter(
        (item) => item.id !== selectedAddress.id,
      );
      let nextDefault = defaultId;

      // If we deleted the current default, pick the first one available
      if (defaultId === selectedAddress.id) {
        nextDefault = newList.length > 0 ? newList[0].id : null;
      }

      await persistData(newList, nextDefault);
      setMenuVisible(false);
    };

    if (Platform.OS === "web") {
      if (confirm("Delete this address?")) performDelete();
    } else {
      Alert.alert("Delete Address", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: performDelete },
      ]);
    }
  };

// 5. EDIT LOGIC
const handleEdit = () => {
  if (!selectedAddress) return;
  setMenuVisible(false);
  router.push({
    pathname: "/checkout/address",
    params: { id: selectedAddress.id },
  });
};

  const handleShare = async (address?: Address) => {
    const target = address || selectedAddress;
    if (!target) return;
    setMenuVisible(false);
    try {
      await Share.share({ message: `Address: ${target.text}` });
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address Book</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <TextInput
            placeholder="Search addresses..."
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/checkout/location")}
        >
          <View style={styles.row}>
            <Ionicons name="add" size={26} color="#2B57CC" />
            <Text style={styles.addButtonText}>Add new address</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2B57CC" />
        </TouchableOpacity>

        {addresses.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() => handleSelectDefault(item.id)}
            style={[styles.card, defaultId === item.id && styles.defaultCard]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.row}>
                <Ionicons
                  name={item.type === "Home" ? "home" : "briefcase"}
                  size={18}
                  color={defaultId === item.id ? "#2B57CC" : "#666"}
                />
                <Text
                  style={[
                    styles.cardTitle,
                    defaultId === item.id && { color: "#2B57CC" },
                  ]}
                >
                  {item.type}
                </Text>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => handleShare(item)}
                  style={styles.iconBtn}
                >
                  <Ionicons name="share-outline" size={22} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedAddress(item);
                    setMenuVisible(true);
                  }}
                  style={styles.iconBtn}
                >
                  <Ionicons name="ellipsis-vertical" size={22} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.addressText}>{item.text}</Text>
            <View style={styles.userInfo}>
              <Text style={styles.userText}>
                {item.name}, {item.phone}
              </Text>
              {defaultId === item.id && (
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={menuVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Ionicons name="pencil-outline" size={22} />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleShare()}
            >
              <Ionicons name="share-outline" size={22} />
              <Text style={styles.menuText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={22} color="#FF3B30" />
              <Text style={[styles.menuText, { color: "#FF3B30" }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  content: { padding: 16 },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 15,
  },
  searchInput: { marginLeft: 10, flex: 1 },
  addButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  addButtonText: { color: "#2B57CC", fontWeight: "bold", marginLeft: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  defaultCard: {
    borderColor: "#2B57CC",
    borderWidth: 2,
    backgroundColor: "#F8FAFF",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: { fontWeight: "700", marginLeft: 8 },
  iconBtn: { marginLeft: 18 },
  addressText: { color: "#475569", marginBottom: 12, fontSize: 14 },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  userText: { color: "#64748B", fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuText: { fontSize: 17, marginLeft: 16, fontWeight: "500" },
});
