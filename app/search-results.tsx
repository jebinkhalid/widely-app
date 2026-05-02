import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageProvider";
import { MOCK_PRODUCTS } from "../data/products";
// 1. IMPORT WISHLIST CONTEXT
import { useWishlist } from "../context/WishlistProvider";

const MAX_CONTENT_WIDTH = 1200;
const MIN_CARD_WIDTH = 180;

export default function SearchResultsScreen() {
  const { q } = useLocalSearchParams();
  const { lang, t } = useLanguage();
  const { cart, addToCart, removeFromCart } = useCart();

  // 2. ACCESS GLOBAL WISHLIST
  const { wishlist, toggleWishlist } = useWishlist();

  const router = useRouter();
  const { width } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState(q?.toString() || "");

  const numColumns = useMemo(() => {
    const availableWidth = Math.min(width, MAX_CONTENT_WIDTH);
    const cols = Math.floor(availableWidth / MIN_CARD_WIDTH);
    return cols < 2 ? 2 : cols;
  }, [width]);

  const results = MOCK_PRODUCTS.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      product.en.toLowerCase().includes(query) || product.ar.includes(query)
    );
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: t("Search Products", "البحث عن المنتجات"),
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* 🔍 SEARCH BAR SECTION */}
      <View style={styles.searchBarWrapper}>
        <View
          style={[
            styles.searchContainer,
            { flexDirection: lang === "ar" ? "row-reverse" : "row" },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { textAlign: lang === "ar" ? "right" : "left" },
            ]}
            placeholder={t(
              "Search for chargers, cables...",
              "ابحث عن شواحن، كابلات...",
            )}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
            //@ts-ignore
            outlineStyle="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#CCC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.centeredWrapper}>
        <FlatList
          key={numColumns}
          data={results}
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

            // 3. CHECK IF PRODUCT IS IN GLOBAL WISHLIST
            const isFav = wishlist.some((fav) => fav.id === item.id.toString());

            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.productCard,
                  {
                    width:
                      (Math.min(width, MAX_CONTENT_WIDTH) - 40) / numColumns,
                  },
                ]}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.img }} style={styles.image} />

                  {/* 4. UPDATED FAVORITE BUTTON */}
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

                  {/* QUICK ADD BUTTON */}
                  <TouchableOpacity
                    style={[
                      styles.floatingAddBtn,
                      { backgroundColor: isInCart ? "#000" : "#fff" }, // Black theme consistency
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

                  <View style={styles.priceBadge}>
                    <Text style={styles.priceBadgeText}>
                      {item.price} {t("SAR", "ر.س")}
                    </Text>
                  </View>
                </View>

                <View style={styles.info}>
                  <Text
                    style={[
                      styles.productTitle,
                      { textAlign: lang === "ar" ? "right" : "left" },
                    ]}
                    numberOfLines={2}
                  >
                    {lang === "ar" ? item.ar : item.en}
                  </Text>

                  <View
                    style={[
                      styles.moqContainer,
                      { alignSelf: lang === "ar" ? "flex-end" : "flex-start" },
                    ]}
                  >
                    <Text style={styles.moqText}>
                      {t("MOQ:", "أقل طلب:")} {item.minQty} {t("pcs", "قطعة")}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View
                    style={[
                      styles.footer,
                      { flexDirection: lang === "ar" ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text style={styles.viewDetailsText}>
                      {t("View Details", "عرض التفاصيل")}
                    </Text>
                    <Ionicons
                      name={lang === "ar" ? "chevron-back" : "chevron-forward"}
                      size={14}
                      color="black"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={80} color="#DDD" />
              <Text style={styles.emptyText}>
                {t("No results found", "لا توجد نتائج")}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

// ... Styles (remain unchanged)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  centeredWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
  },
  searchBarWrapper: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  searchContainer: {
    backgroundColor: "#F1F3F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    alignItems: "center",
  },
  searchIcon: { marginHorizontal: 5 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    height: "100%",
  },
  listContent: { padding: 10, paddingBottom: 40 },
  productCard: {
    margin: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
      web: { boxShadow: "0px 4px 15px rgba(0,0,0,0.1)" },
    }),
  },
  imageContainer: { width: "100%", aspectRatio: 1.1, backgroundColor: "#fff" },
  image: { width: "100%", height: "100%", resizeMode: "contain" },

  // 🟢 BUTTON STYLES
  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  floatingAddBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    ...Platform.select({
      web: { boxShadow: "0px 2px 5px rgba(0,0,0,0.2)" },
      android: { elevation: 4 },
      ios: {
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },

  priceBadge: {
    position: "absolute",
    top: 15,
    left: 0,
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  priceBadgeText: { color: "#FFD700", fontWeight: "900", fontSize: 14 },
  info: { padding: 15 },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    height: 40,
  },
  moqContainer: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  moqText: { color: "#000", fontSize: 12, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginBottom: 10 },
  footer: { alignItems: "center", justifyContent: "center" },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginHorizontal: 5,
  },
  emptyContainer: { flex: 1, alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 20, color: "#999", fontSize: 16 },
});
