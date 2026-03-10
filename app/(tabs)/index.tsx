import { ThemedText } from "@/components/themed-text";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
// 1. You MUST import useLanguage to use the global state
import { useLanguage } from "../../context/LanguageProvider";

export default function HomeScreen() {
  // 2. Pull the global state and the 't' helper from your context
  const { lang, toggleLang, t } = useLanguage();

  return (
    <ScrollView
      style={[styles.container, { direction: lang === "ar" ? "rtl" : "ltr" }]}
    >
      {/* 1. SEARCH BAR AREA */}
      <View style={styles.searchSection}>
        <TouchableOpacity
          onPress={toggleLang}
          style={{ alignSelf: "flex-end", marginBottom: 10 }}
        >
          <ThemedText style={{ color: "#ffee00", fontWeight: "bold" }}>
            {lang === "en" ? "العربية" : "English"}
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <ThemedText style={{ color: "#888" }}>
            {t("🔍 Search Widely...", "🔍 ابحث في وايدلي...")}
          </ThemedText>
        </View>
      </View>

      {/* 2. PROMO BANNER */}
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
      >
        {/* We use an array of objects to handle translations easily */}
        {[
          { en: "Women", ar: "نساء" },
          { en: "Men", ar: "رجال" },
          { en: "Home", ar: "منزل" },
          { en: "Fashion", ar: "موضة" },
          { en: "Tech", ar: "تقنية" },
        ].map((cat) => (
          <View key={cat.en} style={styles.catItem}>
            <View style={styles.catCircle} />
            <ThemedText style={styles.catText}>{t(cat.en, cat.ar)}</ThemedText>
          </View>
        ))}
      </ScrollView>

      {/* 4. PRODUCT GRID */}
      <View style={styles.grid}>
        <View style={styles.productCard}>
          <ThemedText>{t("Item 1", "منتج ١")}</ThemedText>
        </View>
        <View style={styles.productCard}>
          <ThemedText>{t("Item 2", "منتج ٢")}</ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchSection: {
    backgroundColor: "#000",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  searchBar: {
    backgroundColor: "#fff",
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  banner: {
    backgroundColor: "#ffee00",
    margin: 15,
    height: 150,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000",
  },
  bannerSub: {
    fontSize: 18,
    color: "#000",
  },
  catRow: {
    paddingLeft: 15,
    marginBottom: 20,
  },
  catItem: {
    alignItems: "center",
    marginRight: 20,
  },
  catCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#000",
    marginBottom: 5,
  },
  catText: {
    fontSize: 12,
    color: "#000",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productCard: {
    width: "45%",
    height: 200,
    backgroundColor: "#f2f2f2",
    marginBottom: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
});
