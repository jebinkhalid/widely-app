import { useWishlist } from "@/context/WishlistProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Added Axios
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useLanguage } from "../../context/LanguageProvider";
const BASE_URL =
  Platform.OS === "web" ? "http://127.0.0.1:5000" : "http://172.20.10.3:5000";

export default function AccountScreen() {
  const { lang, setLang, t } = useLanguage();
  const router = useRouter();
  const { wishlist } = useWishlist();

  const [displayName, setDisplayName] = useState("User");
  const [ordersCount, setOrdersCount] = useState(0); // Store dynamic order count
  const [country, setCountry] = useState({
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
  });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  // 1. FETCH USERNAME AND ORDERS ON LOAD
  useEffect(() => {
    const getAccountData = async () => {
      // Get Username
      const storedName = await AsyncStorage.getItem("user_full_name");
      if (storedName) setDisplayName(storedName);

      // Fetch Orders from Backend
      try {
        const response = await axios.get(`${BASE_URL}/api/my-orders/rashid_21`);
        setOrdersCount(response.data.length);
      } catch (error) {
        console.log("❌ Failed to fetch orders:", error);
      }
    };

    getAccountData();
  }, []);
  // 1. FETCH USERNAME AND ORDERS ON LOAD
  useEffect(() => {
    const getAccountData = async () => {
      // Get Username
      const storedName = await AsyncStorage.getItem("user_full_name");
      if (storedName) setDisplayName(storedName);

      // Fetch Orders from Backend
      try {
        const response = await axios.get(
          "http://172.20.10.2:5000/api/my-orders/rashid_21",
        );

        // ADD THESE LOGS HERE 👇
        console.log("📡 API Response Status:", response.status);
        console.log("📦 Orders Data from DB:", response.data);

        if (Array.isArray(response.data)) {
          setOrdersCount(response.data.length);
        } else {
          console.log("⚠️ Warning: Data is not an array!");
        }
      } catch (error) {
        console.log("❌ Failed to fetch orders:", error);
      }
    };

    getAccountData();
  }, []);

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await AsyncStorage.removeItem("isLoggedIn");
        await AsyncStorage.removeItem("user_full_name");
        router.replace("/login");
      } catch (e) {
        console.error("Error signing out", e);
      }
    };

    if (Platform.OS === "web") {
      const confirmWeb = window.confirm(
        lang === "ar"
          ? "هل أنت متأكد من تسجيل الخروج؟"
          : "Are you sure you want to sign out?",
      );
      if (confirmWeb) performLogout();
    } else {
      Alert.alert(
        t("Sign Out", "تسجيل الخروج"),
        t(
          "Are you sure you want to sign out?",
          "هل أنت متأكد من تسجيل الخروج؟",
        ),
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
        {/* 1. TOP PROFILE HEADER */}
        <View
          style={[
            styles.profileHeader,
            { flexDirection: lang === "ar" ? "row-reverse" : "row" },
          ]}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          </View>
          <View
            style={[
              styles.profileInfo,
              { alignItems: lang === "ar" ? "flex-end" : "flex-start" },
            ]}
          >
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>rashidmohammed359862@gmail.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>{t("Edit", "تعديل")}</Text>
          </TouchableOpacity>
        </View>

        {/* 2. PRO PROMO BANNER */}
        <TouchableOpacity
          style={[
            styles.promoBanner,
            { flexDirection: lang === "ar" ? "row-reverse" : "row" },
          ]}
        >
          <Text style={styles.promoText}>
            {t("Unlimited free delivery", "توصيل مجاني غير محدود")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.tryFreeText}>
              {t("Try Free", "جرب مجاناً")}
            </Text>
            <View style={styles.oneBadge}>
              <Text style={styles.oneBadgeText}>one</Text>
            </View>
            <Ionicons
              name={lang === "ar" ? "chevron-back" : "chevron-forward"}
              size={16}
              color="#e91e63"
            />
          </View>
        </TouchableOpacity>

        {/* 3. QUICK ACTION GRID */}
        <View style={styles.gridContainer}>
          <View
            style={[
              styles.gridRow,
              { flexDirection: lang === "ar" ? "row-reverse" : "row" },
            ]}
          >
            {/* Dynamic Orders Grid Item */}
            <GridItem
              icon="gift-outline"
              title={t("Orders", "الطلبات")}
              sub={`${ordersCount} ${t("items", "عناصر")}`}
              lang={lang}
              onPress={() => router.push("/orders-list")}
            />
            <GridItem
              icon="refresh-outline"
              title={t("Returns", "المرتجعات")}
              sub={t("0 active requests", "0 طلبات نشطة")}
              lang={lang}
            />
          </View>
          <View
            style={[
              styles.gridRow,
              { flexDirection: lang === "ar" ? "row-reverse" : "row" },
            ]}
          >
            <GridItem
              icon="wallet-outline"
              title={t("Credits", "رصيد نون")}
              sub="SAR 0.00"
              lang={lang}
            />
            <GridItem
              icon="heart-outline"
              title={t("Wishlist", "قائمة الأمنيات")}
              sub={`${wishlist.length} ${t("items", "عناصر")}`}
              lang={lang}
              onPress={() => router.push("/wishlist")}
            />
          </View>
        </View>

        {/* 4. SETTINGS LIST */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { textAlign: lang === "ar" ? "right" : "left" },
            ]}
          >
            {t("Settings", "الإعدادات")}
          </Text>
          <ListItem
            icon="location-outline"
            title={t("Addresses", "العناوين")}
            lang={lang}
            onPress={() => router.push("/checkout/address-book")}
          />
          <ListItem
            icon="card-outline"
            title={t("Payment", "الدفع")}
            lang={lang}
          />
          <ListItem
            icon="globe-outline"
            title={t("Country", "البلد")}
            value={country.flag}
            onPress={() => setShowCountryModal(true)}
            lang={lang}
          />
          <ListItem
            icon="language-outline"
            title={t("Language", "اللغة")}
            value={lang === "ar" ? "العربية" : "English"}
            onPress={() => setShowLangModal(true)}
            lang={lang}
            isLast
          />
        </View>

        {/* 5. SIGN OUT BUTTON */}
        <TouchableOpacity style={styles.signOutBox} onPress={handleLogout}>
          <Ionicons name="power-outline" size={22} color="#d9534f" />
          <Text style={[styles.signOutText, { color: "#d9534f" }]}>
            {t("Sign Out", "تسجيل الخروج")}
          </Text>
        </TouchableOpacity>

        {/* 6. FOOTER LINKS */}
        <View style={styles.footer}>
          <Text style={styles.sellText}>{t("Sell with us", "بيع معنا")}</Text>
          <View style={styles.socialRow}>
            <Ionicons
              name="logo-facebook"
              size={20}
              color="#666"
              style={{ marginHorizontal: 10 }}
            />
            <Ionicons
              name="logo-instagram"
              size={20}
              color="#666"
              style={{ marginHorizontal: 10 }}
            />
            <Ionicons
              name="logo-twitter"
              size={20}
              color="#666"
              style={{ marginHorizontal: 10 }}
            />
          </View>
          <Text style={styles.versionText}>
            © 2026 noon.com. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* MODALS */}
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

      <TouchableOpacity style={styles.helpFab}>
        <Ionicons name="chatbubble-ellipses" size={24} color="black" />
        <Text style={styles.helpFabText}>{t("Need Help?", "مساعدة؟")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --- SUB COMPONENTS ---
const GridItem = ({ icon, title, sub, lang, onPress }: any) => (
  <TouchableOpacity style={styles.gridItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#333" />
    <Text
      style={[
        styles.gridTitle,
        { textAlign: lang === "ar" ? "right" : "left" },
      ]}
    >
      {title}
    </Text>
    <Text
      style={[styles.gridSub, { textAlign: lang === "ar" ? "right" : "left" }]}
    >
      {sub}
    </Text>
  </TouchableOpacity>
);

const ListItem = ({
  icon,
  title,
  value = null,
  onPress = () => {},
  lang,
  isLast = false,
}: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.listItem, isLast && { borderBottomWidth: 0 }]}
  >
    <View
      style={{
        flexDirection: lang === "ar" ? "row-reverse" : "row",
        alignItems: "center",
      }}
    >
      <Ionicons name={icon} size={22} color="#333" />
      <Text style={[styles.listTitle, { marginHorizontal: 15 }]}>{title}</Text>
    </View>
    <View
      style={{
        flexDirection: lang === "ar" ? "row-reverse" : "row",
        alignItems: "center",
      }}
    >
      {value ? <Text style={styles.listValue}>{value}</Text> : null}
      <Ionicons
        name={lang === "ar" ? "chevron-back" : "chevron-forward"}
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
          <Text style={{ color: "red", fontWeight: "bold" }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f9" },
  profileHeader: { padding: 20, backgroundColor: "#fff", alignItems: "center" },
  avatarCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "bold", color: "#555" },
  profileInfo: { flex: 1, marginHorizontal: 15 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { fontSize: 12, color: "#777" },
  editButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  editButtonText: { fontSize: 12, fontWeight: "600" },
  promoBanner: {
    margin: 15,
    padding: 15,
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  promoText: { fontSize: 13, fontWeight: "500" },
  tryFreeText: {
    fontSize: 13,
    color: "#e91e63",
    fontWeight: "bold",
    marginRight: 5,
  },
  oneBadge: {
    backgroundColor: "#ffeb3b",
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  oneBadgeText: { fontSize: 10, fontWeight: "bold" },
  gridContainer: { paddingHorizontal: 10 },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 1,
  },
  gridTitle: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  gridSub: { fontSize: 11, color: "#888", marginTop: 2 },
  section: { backgroundColor: "#fff", marginTop: 10, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", paddingVertical: 15 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  listTitle: { fontSize: 14, color: "#333" },
  listValue: {
    fontSize: 14,
    color: "#888",
    fontWeight: "bold",
    marginRight: 5,
  },
  signOutBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signOutText: { marginLeft: 10, fontSize: 15, fontWeight: "500" },
  footer: { padding: 40, alignItems: "center" },
  sellText: { color: "#3866df", fontWeight: "bold", marginBottom: 20 },
  socialRow: { flexDirection: "row", marginBottom: 20 },
  versionText: { fontSize: 11, color: "#aaa" },
  helpFab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ffeb3b",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
  },
  helpFabText: { marginLeft: 8, fontWeight: "bold", color: "#000" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  modalItemText: { fontSize: 16 },
  closeModal: { marginTop: 20, alignItems: "center" },
});
