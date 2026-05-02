import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageProvider";
import { useWishlist } from "../../context/WishlistProvider";
import { MOCK_PRODUCTS } from "../../data/products";

const MAX_CONTENT_WIDTH = 1200;

const CATEGORIES = [
  { id: "1", en: "Mobile Accessories", ar: "ملحقات الجوال", icon: "📱" },
  { id: "2", en: "Electronics", ar: "إلكترونيات", icon: "💻" },
  { id: "3", en: "Market", ar: "سوق", icon: "🛒" },
  { id: "4", en: "Laptops", ar: "أجهزة الكمبيوتر", icon: "💻" },
  { id: "5", en: "Toys", ar: "ألعاب", icon: "🧸" },
];

export default function HomeScreen() {
  const { lang, toggleLang, t } = useLanguage();
  const { cart, addToCart, removeFromCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState("");

  // Professional Grid Logic: Ensure 2 columns on mobile
  const numColumns = useMemo(() => {
    if (width < 600) return 2;
    return Math.floor(Math.min(width, MAX_CONTENT_WIDTH) / 200);
  }, [width]);

  // Precise width to prevent overflow
  const cardWidth = useMemo(() => {
    const padding = 30; // total horizontal padding
    return (Math.min(width, MAX_CONTENT_WIDTH) - padding) / numColumns;
  }, [width, numColumns]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={toggleLang} style={styles.langBtn}>
            <Text style={styles.langText}>
              {lang === "en" ? "العربية" : "English"}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.searchContainer,
            { flexDirection: lang === "ar" ? "row-reverse" : "row" },
          ]}
        >
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={[
              styles.searchInput,
              { textAlign: lang === "ar" ? "right" : "left" },
            ]}
            placeholder={t("Search Widely...", "ابحث في وايدلي...")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>
      <View style={styles.centeredContent}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>
            {t("GRAND SALES", "تخفيضات كبرى")}
          </Text>
          <Text style={styles.bannerSub}>
            {t("UP TO 90% OFF", "خصم يصل إلى 90%")}
          </Text>
        </View>
        <ThemedText style={styles.sectionTitle}>
          {t("Categories", "الفئات")}
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.catItem}>
              <View style={styles.catCircle}>
                <Text style={{ fontSize: 24 }}>{cat.icon}</Text>
              </View>
              <Text style={styles.catLabel}>
                {lang === "en" ? cat.en : cat.ar}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ThemedText style={styles.sectionTitle}>
          {t("All Products", "جميع المنتجات")}
        </ThemedText>

        {/* Corrected Grid with flexWrap */}
        <View
          style={[
            styles.grid,
            { flexDirection: lang === "ar" ? "row-reverse" : "row" },
          ]}
        >
          {MOCK_PRODUCTS.filter((p) =>
            p.en.toLowerCase().includes(searchQuery.toLowerCase()),
          ).map((item) => {
            // Keep logic inside the map, but ensure the return is a single, clean component
            const isInCart = cart.some((c) => c.id === item.id.toString());
            const isFav = wishlist.some((fav) => fav.id === item.id.toString());

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                style={[styles.productCard, { width: cardWidth }]}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.img }} style={styles.image} />

                  <TouchableOpacity
                    style={styles.favBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleWishlist({
                        id: item.id.toString(),
                        name: item.en,
                        price: item.price,
                        image: item.img,
                      });
                    }}
                  >
                    <Ionicons
                      name={isFav ? "heart" : "heart-outline"}
                      size={18}
                      color={isFav ? "#ff4444" : "#666"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.floatingAddBtn,
                      { backgroundColor: isInCart ? "#000" : "#fff" },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      if (isInCart) {
                        removeFromCart(item.id.toString());
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
                      size={22}
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
                      size={12}
                      color="#000"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  headerSection: {
    backgroundColor: "#000",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  langBtn: { paddingVertical: 5 },
  langText: { color: "#FFD700", fontWeight: "bold" },
  searchContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    height: "100%",
    paddingHorizontal: 10,
  },
  centeredContent: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  banner: {
    backgroundColor: "#FFD700",
    marginTop: 20,
    marginBottom: 25,
    height: 160,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  bannerTitle: { fontSize: 28, fontWeight: "900", color: "#000" },
  bannerSub: { fontSize: 18, color: "#000", marginTop: 5 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#000",
    paddingHorizontal: 5,
  },
  catRow: { marginBottom: 20 },
  catItem: { alignItems: "center", width: 85, marginRight: 10 },
  catCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  catLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    height: 32,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap", // CRITICAL for 2-column view
    justifyContent: "space-between", // Ensures items spread to edges
  },
  productCard: {
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 3,
  },
  imageContainer: { width: "100%", aspectRatio: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  floatingAddBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  priceBadge: {
    position: "absolute",
    top: 15,
    left: 0,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  priceBadgeText: { color: "#FFD700", fontWeight: "900", fontSize: 12 },
  info: { padding: 12 },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    height: 38,
    marginBottom: 8,
  },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginBottom: 8 },
  footer: { alignItems: "center", justifyContent: "center" },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    marginHorizontal: 4,
  },
});
