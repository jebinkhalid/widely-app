import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useLanguage } from "../../context/LanguageProvider";

export default function AccountScreen() {
  const { lang, setLang, t } = useLanguage();

  // Selection States
  const [country, setCountry] = useState({
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
  });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

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
            <Text style={styles.avatarText}>RM</Text>
          </View>
          <View
            style={[
              styles.profileInfo,
              { alignItems: lang === "ar" ? "flex-end" : "flex-start" },
            ]}
          >
            <Text style={styles.userName}>Hala Rashid</Text>
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
            <Ionicons name="chevron-forward" size={16} color="#e91e63" />
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
            <GridItem
              icon="gift-outline"
              title={t("Orders", "الطلبات")}
              sub={t("Manage & track", "إدارة وتتبع")}
              lang={lang}
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
              sub={t("10 saved items", "10 عناصر")}
              lang={lang}
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
          />
          <ListItem
            icon="card-outline"
            title={t("Payment", "الدفع")}
            lang={lang}
          />

          {/* Country Selector */}
          <ListItem
            icon="globe-outline"
            title={t("Country", "البلد")}
            value={country.flag}
            onPress={() => setShowCountryModal(true)}
            lang={lang}
          />

          {/* Language Selector */}
          <ListItem
            icon="language-outline"
            title={t("Language", "اللغة")}
            value={lang === "ar" ? "العربية" : "English"}
            onPress={() => setShowLangModal(true)}
            lang={lang}
            isLast
          />
        </View>

        {/* 5. SIGN OUT */}
        <TouchableOpacity style={styles.signOutBox}>
          <Ionicons name="power-outline" size={22} color="#555" />
          <Text style={styles.signOutText}>
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

      {/* MODALS FOR SELECTION */}
      <SelectionModal
        visible={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        data={countries}
        onSelect={(item) => {
          setCountry(item);
          setShowCountryModal(false);
        }}
        title={t("Select Country", "اختر البلد")}
      />

      <SelectionModal
        visible={showLangModal}
        onClose={() => setShowLangModal(false)}
        data={languages}
        onSelect={(item) => {
          setLang(item.value);
          setShowLangModal(false);
        }}
        title={t("Select Language", "اختر اللغة")}
      />

      {/* NEED HELP FLOATING BUTTON */}
      <TouchableOpacity style={styles.helpFab}>
        <Ionicons name="chatbubble-ellipses" size={24} color="black" />
        <Text style={styles.helpFabText}>{t("Need Help?", "مساعدة؟")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --- SUB COMPONENTS ---

const GridItem = ({ icon, title, sub, lang }) => (
  <TouchableOpacity style={styles.gridItem}>
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

const ListItem = ({ icon, title, value, onPress, lang, isLast }) => (
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
      {value && <Text style={styles.listValue}>{value}</Text>}
      <Ionicons
        name={lang === "ar" ? "chevron-back" : "chevron-forward"}
        size={18}
        color="#ccc"
      />
    </View>
  </TouchableOpacity>
);

const SelectionModal = ({ visible, onClose, data, onSelect, title }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.modalItem}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.modalItemText}>
              {item.flag ? `${item.flag}  ${item.name}` : item.label}
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
  gridRow: { justifyContent: "space-between", marginBottom: 10 },
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
  signOutText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },

  footer: { padding: 40, alignItems: "center" },
  sellText: { color: "#3866df", fontWeight: "bold", marginBottom: 20 },
  socialRow: { flexDirection: "row", marginBottom: 20 },
  versionText: { fontSize: 11, color: "#aaa" },

  helpFab: {
    position: "absolute",
    bottom: 100,
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
