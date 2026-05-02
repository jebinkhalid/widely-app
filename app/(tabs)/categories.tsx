import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../../context/LanguageProvider";

const MAX_CONTENT_WIDTH = 1200;
const MIN_CARD_WIDTH = 160;

const CATEGORIES = [
  {
    id: "1",
    en: "Mobile Accessories",
    ar: "ملحقات الجوال",
    img: require("../../assets/images/mob acccc.png"),
  },
  {
    id: "2",
    en: "Electronics",
    ar: "إلكترونيات",
    img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=300",
  },
  {
    id: "3",
    en: "Market",
    ar: "سوق",
    img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=300",
  },
  {
    id: "4",
    en: "laptop and accessories",
    ar: "أجهزة الكمبيوتر والملحقات",
    img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=300",
  },
  {
    id: "5",
    en: "Toys",
    ar: "ألعاب",
    img: "https://images.unsplash.com/photo-1532330393533-443990a51d10?q=80&w=300",
  },
  {
    id: "6",
    en: "watches",
    ar: "ساعات",
    img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=300",
  },
  {
    id: "7",
    en: "gaming",
    ar: "ألعاب الفيديو",
    img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=300",
  },
  {
    id: "8",
    en: "kitchen accessories",
    ar: "ملحقات المطبخ",
    img: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=300",
  },
  {
    id: "9",
    en: "Fresh",
    ar: "طازج",
    img: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=300",
  },
  {
    id: "10",
    en: "stationary",
    ar: "قرطاسية",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300",
  },
];

export default function CategoriesScreen() {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { width } = useWindowDimensions();

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      router.push({
        pathname: "/search-results",
        params: { q: searchQuery },
      });
    }
  };

  const numColumns = useMemo(() => {
    const availableWidth = Math.min(width, MAX_CONTENT_WIDTH);
    const cols = Math.floor(availableWidth / MIN_CARD_WIDTH);
    return cols < 2 ? 2 : cols;
  }, [width]);

  const filteredCategories = CATEGORIES.filter((item) => {
    const name = lang === "ar" ? item.ar : item.en;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // ✅ Updated Promo Banner with Yellow & Black Theme
  const PromoBanner = () => (
    <TouchableOpacity
      style={[
        styles.promoBanner,
        { flexDirection: lang === "ar" ? "row-reverse" : "row" },
      ]}
    >
      <View
        style={{
          flex: 1,
          alignItems: lang === "ar" ? "flex-end" : "flex-start",
        }}
      >
        <Text style={styles.promoTitle}>
          {t("Wholesale Deals >", "عروض الجملة >")}
        </Text>
        <Text style={styles.promoSub}>
          {t(
            "Get the best bulk prices on all categories",
            "احصل على أفضل أسعار الجملة لجميع الفئات",
          )}
        </Text>
      </View>
      <Ionicons name="flash" size={32} color="black" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: typeof CATEGORIES[number] }) => {
    const imageSource =
      typeof item.img === "string" ? { uri: item.img } : item.img;
    return (
      <TouchableOpacity
        onPress={() => router.push(`/categories/${item.id}`)}
        style={[
          styles.card,
          { width: (Math.min(width, MAX_CONTENT_WIDTH) - 40) / numColumns },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.categoryImage} />
        </View>
        <Text style={styles.categoryTitle} numberOfLines={2}>
          {lang === "ar" ? item.ar : item.en}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.headerContainer}>
          <View
            style={[
              styles.searchBar,
              { flexDirection: lang === "ar" ? "row-reverse" : "row" },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color="#000"
              style={{ marginHorizontal: 10 }}
            />
            <TextInput
              placeholder={t("Search items...", "بحث عن منتجات...")}
              style={[
                styles.searchInput,
                { textAlign: lang === "ar" ? "right" : "left" },
              ]}
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {/* ✅ Clear Button */}
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#888"
                  style={{ marginHorizontal: 10 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          key={numColumns}
          ListHeaderComponent={
            <>
              <Text
                style={[
                  styles.sectionTitle,
                  { textAlign: lang === "ar" ? "right" : "left" },
                ]}
              >
                {t("Browse Categories", "تصفح الفئات")}
              </Text>
              <PromoBanner />
            </>
          }
          data={filteredCategories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={
            numColumns > 1
              ? { flexDirection: lang === "ar" ? "row-reverse" : "row" }
              : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  contentWrapper: { width: "100%", maxWidth: MAX_CONTENT_WIDTH },
  headerContainer: { paddingHorizontal: 15, paddingVertical: 12 },
  searchBar: {
    backgroundColor: "#FFD700", // Yellow Search Bar
    borderRadius: 12,
    paddingHorizontal: 5,
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
    outlineStyle: "none" as any,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900", // Bolder for wholesale look
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    color: "#000",
  },
  promoBanner: {
    backgroundColor: "#000", // Black Banner
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  promoTitle: { fontSize: 20, fontWeight: "bold", color: "#FFD700" }, // Yellow Title
  promoSub: { fontSize: 13, color: "#fff", marginTop: 4, opacity: 0.9 },
  listContent: { paddingHorizontal: 10, paddingBottom: 30 },
  card: { marginBottom: 20, paddingHorizontal: 5, alignItems: "center" },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  categoryImage: { width: "100%", height: "100%", resizeMode: "contain" },
  categoryTitle: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
  },
});
