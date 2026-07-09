import { useWishlist } from "@/context/WishlistProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageProvider";
import api from "../../services/api"; // Centralized secure Axios instance

export default function AccountScreen() {
  const { lang, setLang, t } = useLanguage();
  const { wishlist } = useWishlist();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [country, setCountry] = useState({
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
  });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  // Sync Live Production Orders safely using Auth state
  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          console.log(
            `📡 Fetching live production orders for user ID: ${user.id}`,
          );
          const response = await api.get(`/api/my-orders/${user.id}`);

          if (Array.isArray(response.data)) {
            setOrdersCount(response.data.length);
          }
        } catch (error) {
          console.error("❌ Live backend order sync failed:", error);
          setOrdersCount(0); // Fallback gracefully on network/auth errors
        }
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (e) {
        console.error("Error signing out", e);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(t("Are you sure?", "هل أنت متأكد؟"))) performLogout();
    } else {
      Alert.alert(
        t("Sign Out", "تسجيل الخروج"),
        t("Are you sure you want to sign out?", "هل أنت متأكد؟"),
        [
          { text: t("Cancel", "إلغاء"), style: "cancel" },
          {
            text: t("Sign Out", "تسجيل الخروج"),
            style: "destructive",
            onPress: performLogout,
          },
        ],
      );
    }
  };

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  const isRTL = lang === "ar";

  const countries = [
    { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
    { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
    { name: "Kuwait", code: "KW", flag: "🇰🇼" },
  ];

  const languages = [
    { label: "English", value: "en" },
    { label: "العربية", value: "ar" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View
          style={[
            styles.profileHeader,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View
            style={[
              styles.profileInfo,
              { alignItems: isRTL ? "flex-end" : "flex-start" },
            ]}
          >
            <Text style={styles.userName}>{user?.name || "Guest"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "No email linked"}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>{t("Edit", "تعديل")}</Text>
          </TouchableOpacity>
        </View>

        {/* Action Grid */}
        <View style={styles.gridContainer}>
          <View
            style={[
              styles.gridRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <GridItem
              icon="gift-outline"
              title={t("Orders", "الطلبات")}
              sub={
                ordersCount === null
                  ? "..."
                  : `${ordersCount} ${t("items", "عناصر")}`
              }
              onPress={() => router.push("/orders-list")}
              isRTL={isRTL}
            />
            <GridItem
              icon="refresh-outline"
              title={t("Returns", "المرتجعات")}
              sub={t("0 requests", "0 طلبات")}
              isRTL={isRTL}
            />
          </View>
          <View
            style={[
              styles.gridRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <GridItem
              icon="wallet-outline"
              title={t("Credits", "رصيد")}
              sub="SAR 0.00"
              isRTL={isRTL}
            />
            <GridItem
              icon="heart-outline"
              title={t("Wishlist", "الأمنيات")}
              sub={`${wishlist.length} ${t("items", "عناصر")}`}
              onPress={() => router.push("/wishlist")}
              isRTL={isRTL}
            />
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {t("Settings", "الإعدادات")}
          </Text>
          <ListItem
            icon="location-outline"
            title={t("Addresses", "العناوين")}
            onPress={() => router.push("/checkout/address-book")}
            isRTL={isRTL}
          />
          <ListItem
            icon="card-outline"
            title={t("Payment", "الدفع")}
            isRTL={isRTL}
          />
          <ListItem
            icon="globe-outline"
            title={t("Country", "البلد")}
            value={country.flag}
            onPress={() => setShowCountryModal(true)}
            isRTL={isRTL}
          />
          <ListItem
            icon="language-outline"
            title={t("Language", "اللغة")}
            value={isRTL ? "العربية" : "English"}
            onPress={() => setShowLangModal(true)}
            isRTL={isRTL}
            isLast
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.signOutBox} onPress={handleLogout}>
          <Ionicons name="power-outline" size={22} color="#d9534f" />
          <Text style={[styles.signOutText, { color: "#d9534f" }]}>
            {t("Sign Out", "تسجيل الخروج")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Country Selection Modal */}
      <SelectionModal
        visible={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        data={countries}
        onSelect={(item: any) => {
          setCountry(item);
          setShowCountryModal(false);
        }}
        title={t("Select Country", "اختر البلد")}
      />

      {/* Language Selection Modal */}
      <SelectionModal
        visible={showLangModal}
        onClose={() => setShowLangModal(false)}
        data={languages}
        onSelect={(item: any) => {
          setLang(item.value);
          setShowLangModal(false);
        }}
        title={t("Select Language", "اختر اللغة")}
      />
    </SafeAreaView>
  );
}

// --- SAFE SUB COMPONENTS ---
const GridItem = ({ icon, title, sub, isRTL, onPress }: any) => (
  <TouchableOpacity style={styles.gridItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#333" />
    <Text style={[styles.gridTitle, { textAlign: isRTL ? "right" : "left" }]}>
      {title}
    </Text>
    <Text style={[styles.gridSub, { textAlign: isRTL ? "right" : "left" }]}>
      {sub}
    </Text>
  </TouchableOpacity>
);

const ListItem = ({ icon, title, value, isRTL, onPress, isLast }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.listItem, isLast && { borderBottomWidth: 0 }]}
  >
    <View
      style={{
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
      }}
    >
      <Ionicons name={icon} size={22} color="#333" />
      <Text style={[styles.listTitle, { marginHorizontal: 15 }]}>{title}</Text>
    </View>
    <View
      style={{
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
      }}
    >
      {value && <Text style={styles.listValue}>{value}</Text>}
      <Ionicons
        name={isRTL ? "chevron-back" : "chevron-forward"}
        size={18}
        color="#ccc"
      />
    </View>
  </TouchableOpacity>
);

const SelectionModal = ({ visible, onClose, data, onSelect, title }: any) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        {data.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.modalItem}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.modalItemText}>
              {item.flag ? `${item.flag} ${item.name}` : item.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.closeModal} onPress={onClose}>
          <Text style={{ color: "#d9534f", fontWeight: "bold" }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f9" },
  profileHeader: { padding: 25, backgroundColor: "#fff", alignItems: "center" },
  avatarCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 22, fontWeight: "bold", color: "#FFD700" },
  profileInfo: { flex: 1, marginHorizontal: 20 },
  userName: { fontSize: 20, fontWeight: "bold", color: "#000" },
  userEmail: { fontSize: 13, color: "#666", marginTop: 2 },
  editButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editButtonText: { fontSize: 12, fontWeight: "600", color: "#333" },
  gridContainer: { paddingHorizontal: 15 },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gridTitle: { fontSize: 14, fontWeight: "bold", marginTop: 12 },
  gridSub: { fontSize: 12, color: "#888", marginTop: 4 },
  section: { backgroundColor: "#fff", marginTop: 15, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 18,
    color: "#333",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  listTitle: { fontSize: 15, color: "#333" },
  listValue: {
    fontSize: 15,
    color: "#888",
    fontWeight: "600",
    marginHorizontal: 8,
  },
  signOutBox: {
    marginTop: 25,
    backgroundColor: "#fff",
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signOutText: { marginLeft: 10, fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: "50%",
  },
  modalTitle: { fontSize: 19, fontWeight: "bold", marginBottom: 20 },
  modalItem: {
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  modalItemText: { fontSize: 16, color: "#333" },
  closeModal: { marginTop: 20, padding: 10, alignItems: "center" },
});
