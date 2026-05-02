import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageProvider";
import { useWishlist } from "../../context/WishlistProvider";
import { MOCK_PRODUCTS } from "../../data/products";

const MAX_CONTENT_WIDTH = 1200;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { lang, t } = useLanguage();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const product = MOCK_PRODUCTS.find((p) => p.id.toString() === id);
  const isFavorite = wishlist.some((item) => item.id.toString() === id);

  const [quantity, setQuantity] = useState(product?.minQty || 1);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => setShowSnackbar(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSnackbar]);

  if (!product) return <Text>Product not found</Text>;

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(
        `/search-results?q=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  };

  const handleAppOrder = () => {
    Alert.alert(
      t("Confirm Order", "تأكيد الطلب"),
      t(
        `Confirm wholesale order for ${quantity} units?`,
        `تأكيد طلب جملة لـ ${quantity} قطعة؟`,
      ),
      [
        { text: t("Cancel", "إلغاء"), style: "cancel" },
        {
          text: t("Confirm", "تأكيد"),
          onPress: () =>
            Alert.alert(
              t("Success", "تم"),
              t("Order sent!", "تم إرسال الطلب!"),
            ),
        },
      ],
    );
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(),
      nameEn: product.en,
      nameAr: product.ar,
      price: product.price,
      quantity: quantity,
      image: product.img,
    });
    setShowSnackbar(true);
  };

  const handleWhatsApp = () => {
    const msg = `Bulk Enquiry:\nProduct: ${product.en}\nQty: ${quantity}\nID: ${product.id}`;
    Linking.openURL(
      `whatsapp://send?phone=9665XXXXXXXX&text=${encodeURIComponent(msg)}`,
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBtn}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          // REMOVED headerRight to get rid of duplicate heart at the top
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.mainWrapper}>
          <View
            style={[
              styles.searchSection,
              isDesktop && { maxWidth: 600, alignSelf: "center" },
            ]}
          >
            <View
              style={[
                styles.searchBar,
                { flexDirection: lang === "ar" ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons name="search" size={20} color="#888" />
              <TextInput
                style={[
                  styles.searchInput,
                  { textAlign: lang === "ar" ? "right" : "left" },
                ]}
                placeholder={t("Search products...", "البحث عن منتجات...")}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchSubmit}
              />
            </View>
          </View>

          <View style={[styles.contentRow, isDesktop && styles.desktopRow]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setImageModalVisible(true)}
              style={[styles.imageSection, isDesktop && { flex: 1.2 }]}
            >
              <Image source={{ uri: product.img }} style={styles.mainImage} />

              <TouchableOpacity
                style={styles.floatingFav}
                onPress={() =>
                  toggleWishlist({
                    id: product.id.toString(),
                    name: product.en,
                    nameAr: product.ar,
                    price: product.price,
                    image: product.img,
                  })
                }
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={26}
                  color={isFavorite ? "#ff4757" : "#333"}
                />
              </TouchableOpacity>

              <View style={styles.zoomBadge}>
                <Ionicons name="expand-outline" size={16} color="black" />
                <Text style={styles.zoomText}>
                  {t("Tap to zoom", "اضغط للتكبير")}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.detailsSection, isDesktop && { flex: 1 }]}>
              <View style={styles.priceBanner}>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceLabel}>
                    {t("Wholesale Price", "سعر الجملة")}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>{product.price}</Text>
                    <Text style={styles.currency}>SAR</Text>
                  </View>
                </View>
                {/* FIXED: Changed View from div */}
                <View style={styles.moqBadge}>
                  <Text style={styles.moqLabel}>{t("MOQ", "أقل كمية")}</Text>
                  <Text style={styles.moqValue}>{product.minQty}</Text>
                </View>
              </View>

              <Text style={styles.productTitle}>
                {lang === "ar" ? product.ar : product.en}
              </Text>

              {/* FIXED: Ensure this is a View */}
              <View style={styles.divider} />

              <View style={styles.qtyRow}>
                <Text style={styles.sectionLabel}>
                  {t("Order Quantity", "كمية الطلب")}
                </Text>
                <View style={styles.qtyPicker}>
                  <TouchableOpacity
                    onPress={() =>
                      setQuantity((q) => Math.max(product.minQty, q - 1))
                    }
                    style={styles.qtyBtn}
                  >
                    <Ionicons name="remove" size={20} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{quantity}</Text>
                  <TouchableOpacity
                    onPress={() => setQuantity((q) => q + 1)}
                    style={styles.qtyBtn}
                  >
                    <Ionicons name="add" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>
                  {t("Estimated Total", "الإجمالي التقديري")}
                </Text>
                <Text style={styles.summaryTotal}>
                  {(quantity * product.price).toFixed(2)} SAR
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {showSnackbar && (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>
            {t("Item added to cart", "تم إضافة المنتج للسلة")}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
            <Text style={styles.snackbarAction}>
              {t("GO TO CART", "عرض السلة")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconAction} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={26} color="#25D366" />
          <Text style={styles.iconLabel}>{t("Chat", "محادثة")}</Text>
        </TouchableOpacity>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.whatsappBtn]}
            onPress={handleAddToCart}
          >
            <Text style={styles.btnTextBlack}>
              {t("Add to Cart", "أضف للسلة")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.orderBtn]}
            onPress={handleAppOrder}
          >
            <Text style={styles.btnTextWhite}>
              {t("Order Now", "اطلب الآن")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isImageModalVisible}
        transparent={false}
        animationType="fade"
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: product.img }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { paddingBottom: 100 },
  mainWrapper: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
  },
  // FIXED: Adjusted marginTop for mobile
  searchSection: { paddingHorizontal: 20, marginTop: 10, marginBottom: 10 },
  searchBar: {
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 10,
    height: "100%",
  },
  headerBtn: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 20,
    marginLeft: 15,
    marginTop: 5,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 100,
  },
  contentRow: { width: "100%" },
  desktopRow: {
    flexDirection: "row",
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  imageSection: {
    width: "100%",
    aspectRatio: 1.1,
    backgroundColor: "#fff",
    position: "relative",
  },
  mainImage: { width: "100%", height: "100%", resizeMode: "contain" },
  floatingFav: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  zoomBadge: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFD700",
    flexDirection: "row",
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  zoomText: { color: "black", fontSize: 12, fontWeight: "bold", marginLeft: 5 },
  detailsSection: { padding: 20 },
  priceBanner: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceInfo: { flex: 1 },
  priceLabel: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  priceRow: { flexDirection: "row", alignItems: "baseline" },
  priceText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  currency: { color: "#fff", fontSize: 14, marginLeft: 4 },
  moqBadge: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 80,
  },
  moqLabel: { color: "#000", fontSize: 10, fontWeight: "bold" },
  moqValue: { color: "#000", fontSize: 20, fontWeight: "900" },
  productTitle: { fontSize: 22, fontWeight: "700", color: "#222" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  qtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: { fontSize: 16, fontWeight: "bold" },
  qtyPicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    padding: 4,
  },
  qtyBtn: { padding: 10 },
  qtyText: { fontSize: 18, fontWeight: "bold", paddingHorizontal: 15 },
  summaryBox: {
    marginTop: 25,
    padding: 15,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#000",
  },
  summaryLabel: { fontSize: 14, color: "#666" },
  summaryTotal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },
  snackbar: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "#1A1A1A",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 10,
    zIndex: 999,
  },
  snackbarText: { color: "#FFF", fontSize: 14, fontWeight: "500" },
  snackbarAction: { color: "#FFD700", fontWeight: "bold", fontSize: 14 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  iconAction: { alignItems: "center", paddingHorizontal: 15 },
  iconLabel: { fontSize: 10, color: "#000", marginTop: 2, fontWeight: "600" },
  buttonGroup: {
    flex: 1,
    flexDirection: "row",
    height: 50,
    borderRadius: 12,
    overflow: "hidden",
  },
  actionBtn: { flex: 1, justifyContent: "center", alignItems: "center" },
  whatsappBtn: { backgroundColor: "#FFD700" },
  orderBtn: { backgroundColor: "#000" },
  btnTextBlack: { color: "#000", fontWeight: "bold", fontSize: 15 },
  btnTextWhite: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  closeBtn: { position: "absolute", top: 50, right: 20, zIndex: 10 },
  fullImage: { width: "100%", height: "80%" },
});
