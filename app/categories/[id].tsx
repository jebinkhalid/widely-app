import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
import { MOCK_PRODUCTS } from "../../data/products";

const MAX_CONTENT_WIDTH = 1200;
const MIN_PRODUCT_CARD_WIDTH = 180;

const CATEGORIES = [
  { id: "1", en: "Mobile Accessories", ar: "ملحقات الجوال" },
  { id: "2", en: "Electronics", ar: "إلكترونيات" },
  { id: "3", en: "Market", ar: "سوق" },
  { id: "4", en: "laptop and accessories", ar: "أجهزة الكمبيوتر والملحقات" },
  { id: "5", en: "Toys", ar: "ألعاب" },
  { id: "6", en: "watches", ar: "ساعات" },
  { id: "7", en: "gaming", ar: "ألعاب الفيديو" },
  { id: "8", en: "kitchen accessories", ar: "ملحقات المطبخ" },
  { id: "9", en: "Fresh", ar: "طازج" },
  { id: "10", en: "stationary", ar: "قرطاسية" },
];

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { width: screenWidth } = useWindowDimensions();

  const numColumns = useMemo(() => {
    const availableWidth = Math.min(screenWidth, MAX_CONTENT_WIDTH);
    const cols = Math.floor(availableWidth / MIN_PRODUCT_CARD_WIDTH);
    return cols < 2 ? 2 : cols;
  }, [screenWidth]);

  const currentCategory = CATEGORIES.find((item) => item.id === id);
  const categoryName = currentCategory
    ? lang === "ar"
      ? currentCategory.ar
      : currentCategory.en
    : t("Category", "الفئة");

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const isInCategory = p.catId === id;
    const productName = lang === "ar" ? p.ar : p.en;
    return (
      isInCategory &&
      productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View
              style={[
                styles.headerSearchContainer,
                {
                  flexDirection: lang === "ar" ? "row-reverse" : "row",
                  width: Math.min(screenWidth * 0.7, 500),
                },
              ]}
            >
              <Ionicons
                name="search"
                size={16}
                color="black"
                style={{ marginHorizontal: 8 }}
              />
              <TextInput
                placeholder={`${t("Search in", "بحث في")} ${categoryName}`}
                style={[
                  styles.headerSearchInput,
                  { textAlign: lang === "ar" ? "right" : "left" },
                ]}
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                //@ts-ignore
                outlineStyle="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color="#444"
                    style={{ marginHorizontal: 5 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          ),
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
          headerTitleAlign: "center",
        }}
      />

      <View style={styles.contentWrapper}>
        <FlatList
          key={numColumns}
          data={filteredProducts}
          numColumns={numColumns}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={
            numColumns > 1
              ? { flexDirection: lang === "ar" ? "row-reverse" : "row" }
              : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.productCard,
                {
                  width:
                    (Math.min(screenWidth, MAX_CONTENT_WIDTH) - 40) /
                    numColumns,
                },
              ]}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <View style={styles.imagePlaceholder}>
                <Image source={{ uri: item.img }} style={styles.image} />
                <View style={styles.priceTag}>
                  <Text style={styles.priceTagText}>{item.price} SAR</Text>
                </View>
              </View>

              <View style={styles.productInfo}>
                <Text
                  style={[
                    styles.productName,
                    { textAlign: lang === "ar" ? "right" : "left" },
                  ]}
                  numberOfLines={2}
                >
                  {lang === "ar" ? item.ar : item.en}
                </Text>

                <View
                  style={[
                    styles.moqBadge,
                    { alignSelf: lang === "ar" ? "flex-end" : "flex-start" },
                  ]}
                >
                  <Text style={styles.moqText}>
                    {t("MOQ:", "جملة:")} {item.minQty} {t("pcs", "قطعة")}
                  </Text>
                </View>

                <View style={styles.quickOrderBtn}>
                  <Text style={styles.quickOrderText}>
                    {t("View Details", "التفاصيل")}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="black" />
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={60} color="#FFD700" />
              <Text style={styles.info}>
                {t("No products found here.", "لا توجد منتجات متوفرة.")}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  contentWrapper: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
  },
  headerSearchContainer: {
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: "#000",
    fontWeight: "600",
  },
  listContent: { padding: 10, paddingBottom: 50 },
  productCard: {
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  imagePlaceholder: { width: "100%", aspectRatio: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  priceTag: {
    position: "absolute",
    top: 10,
    left: 0,
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  priceTagText: { color: "#FFD700", fontWeight: "bold", fontSize: 12 },
  productInfo: { padding: 12 },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    height: 40,
    lineHeight: 20,
  },
  moqBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginVertical: 8,
  },
  moqText: { fontSize: 11, color: "#000", fontWeight: "900" },
  quickOrderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  quickOrderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    marginRight: 4,
  },
  emptyState: { marginTop: 100, alignItems: "center", width: "100%" },
  info: { fontSize: 16, color: "#444", fontWeight: "bold", marginTop: 15 },
});
