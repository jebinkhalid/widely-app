import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useLanguage } from "../../context/LanguageProvider";

const MAX_CONTENT_WIDTH = 1200;

export default function HomeScreen() {
  const { lang, toggleLang, t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { width: screenWidth } = useWindowDimensions();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. SEARCH SECTION */}
      <View
        style={[styles.searchSection, { width: "100%", alignItems: "center" }]}
      >
        <View
          style={[
            styles.contentWrapper,
            { direction: lang === "ar" ? "rtl" : "ltr" },
          ]}
        >
          <TouchableOpacity
            onPress={toggleLang}
            style={{
              alignSelf: lang === "ar" ? "flex-start" : "flex-end",
              marginBottom: 10,
            }}
          >
            <ThemedText style={{ color: "#ffee00", fontWeight: "bold" }}>
              {lang === "en" ? "العربية" : "English"}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <TextInput
              placeholder={t("🔍 Search Widely...", "🔍 ابحث في وايدلي...")}
              placeholderTextColor="#888"
              style={[
                { flex: 1, paddingHorizontal: 20 },
                { textAlign: lang === "ar" ? "right" : "left" },
                { outlineStyle: "none" } as any,
              ]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                if (searchQuery.trim().length > 0) {
                  router.push({
                    pathname: "/search-results",
                    params: { q: searchQuery },
                  });
                }
              }}
              returnKeyType="search"
            />
          </View>
        </View>
      </View>

      {/* 2. BODY SECTION */}
      <View
        style={[
          styles.contentWrapper,
          { direction: lang === "ar" ? "rtl" : "ltr" },
        ]}
      >
        <View style={styles.banner}>
          <ThemedText style={styles.bannerTitle}>
            {t("GRAND SALES", "تخفيضات كبرى")}
          </ThemedText>
          <ThemedText style={styles.bannerSub}>
            {t("UP TO 90% OFF", "خصم يصل إلى 90%")}
          </ThemedText>
        </View>

        {/* 3. CATEGORIES ROW */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catRow}
          contentContainerStyle={{
            flexDirection: lang === "ar" ? "row-reverse" : "row",
            paddingRight: 20,
          }}
        >
          {[
            { en: "Women", ar: "نساء" },
            { en: "Men", ar: "رجال" },
            { en: "Home", ar: "منزل" },
            { en: "Fashion", ar: "موضة" },
          ].map((cat) => (
            <View key={cat.en} style={styles.catItem}>
              <View style={styles.catCircle} />
              <ThemedText style={styles.catText}>
                {t(cat.en, cat.ar)}
              </ThemedText>
            </View>
          ))}
        </ScrollView>

        {/* 4. PRODUCT GRID */}
        <View
          style={[
            styles.grid,
            { flexDirection: lang === "ar" ? "row-reverse" : "row" },
          ]}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View
              key={item}
              style={[
                styles.productCard,
                { width: screenWidth > 768 ? "23%" : "46%" },
              ]}
            >
              <ThemedText>{t(`Item ${item}`, `منتج ${item}`)}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ... styles remain the same as you provided
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentWrapper: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    paddingHorizontal: 15,
  },
  searchSection: { backgroundColor: "#000", paddingTop: 60, paddingBottom: 25 },
  searchBar: {
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
  },
  banner: {
    backgroundColor: "#ffee00",
    marginTop: 20,
    marginBottom: 25,
    height: 180,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  bannerTitle: { fontSize: 32, fontWeight: "900", color: "#000" },
  bannerSub: { fontSize: 20, color: "#000", marginTop: 5 },
  catRow: { marginBottom: 30 },
  catItem: { alignItems: "center", marginRight: 25 },
  catCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  catText: { fontSize: 13, fontWeight: "600", color: "#333" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 15,
    paddingBottom: 40,
  },
  productCard: {
    height: 220,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#efefef",
  },
});
