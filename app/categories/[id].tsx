import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageProvider";
import { MOCK_PRODUCTS } from "../../data/products";
// 1. IMPORT THE GLOBAL WISHLIST CONTEXT
import { useWishlist } from "../../context/WishlistProvider";

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
  const { cart, addToCart, removeFromCart } = useCart();

  // 2. USE GLOBAL WISHLIST HOOK INSTEAD OF LOCAL STATE
  const { wishlist, toggleWishlist } = useWishlist();

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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: categoryName,
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: Platform.OS === "ios" ? 0 : 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* SEARCH SECTION ... (unchanged) */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchBar,
            { flexDirection: lang === "ar" ? "row-reverse" : "row" },
          ]}
        >
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={[
              styles.searchInput,
              { textAlign: lang === "ar" ? "right" : "left" },
            ]}
            placeholder={`${t("Search in", "بحث في")} ${categoryName}`}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            //@ts-ignore
            outlineStyle="none"
            underlineColorAndroid="transparent"
            selectionColor="#FFD700"
          />
        </View>
      </View>

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
          renderItem={({ item }) => {
            const isInCart = cart.some((c) => c.id === item.id);

            // 3. CHECK GLOBAL WISHLIST FOR THIS ITEM
            const isFav = wishlist.some((fav) => fav.id === item.id.toString());

            return (
              <TouchableOpacity
                activeOpacity={0.9}
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

                  {/* 4. UPDATED FAVORITE BUTTON LOGIC */}
                  <TouchableOpacity
                    style={styles.favBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleWishlist({
                        id: item.id.toString(),
                        name: item.en,
                        nameAr: item.ar,
                        price: item.price,
                        image: item.img,
                      });
                    }}
                  >
                    <Ionicons
                      name={isFav ? "heart" : "heart-outline"}
                      size={20}
                      color={isFav ? "#ff4444" : "#666"}
                    />
                  </TouchableOpacity>

                  {/* QUICK ADD BUTTON ... (unchanged) */}
                  <TouchableOpacity
                    style={[
                      styles.floatingAddBtn,
                      { backgroundColor: isInCart ? "#000" : "#fff" },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      if (isInCart) {
                        removeFromCart(item.id);
                      } else {
                        addToCart({
                          id: item.id.toString(),
                          nameEn: item.en,
                          nameAr: item.ar,
                          price: item.price,
                          quantity: 1,
                          image: item.img,
                        });
                      }
                    }}
                  >
                    <Ionicons
                      name={isInCart ? "checkmark" : "add"}
                      size={24}
                      color={isInCart ? "#FFD700" : "#000"}
                    />
                  </TouchableOpacity>

                  <View style={styles.priceTag}>
                    <Text style={styles.priceTagText}>{item.price} SAR</Text>
                  </View>
                </View>

                {/* PRODUCT INFO SECTION ... (unchanged) */}
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
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

// ... Styles remain the same

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  contentWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
  },
  searchSection: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  searchBar: {
    backgroundColor: "#F1F3F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingHorizontal: 10,
    height: "100%",
    backgroundColor: "transparent",
    //@ts-ignore
    outlineWidth: 0,
  },
  listContent: { padding: 10, paddingBottom: 50 },
  productCard: {
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
      web: { boxShadow: "0px 2px 8px rgba(0,0,0,0.1)" },
    }),
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1.1,
    backgroundColor: "#fff",
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  favBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  floatingAddBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    ...Platform.select({
      web: { boxShadow: "0px 2px 4px rgba(0,0,0,0.2)" },
      android: { elevation: 4 },
      ios: {
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },
  priceTag: {
    position: "absolute",
    top: 12,
    left: 0,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  priceTagText: { color: "#FFD700", fontWeight: "900", fontSize: 13 },
  productInfo: { padding: 12 },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    height: 40,
    lineHeight: 20,
  },
  moqBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginVertical: 8,
  },
  moqText: { fontSize: 11, color: "#000", fontWeight: "900" },
  quickOrderBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
    paddingTop: 10,
  },
  quickOrderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    marginHorizontal: 4,
  },
  emptyState: { marginTop: 100, alignItems: "center" },
  infoText: { fontSize: 16, color: "#666", fontWeight: "bold", marginTop: 15 },
});
