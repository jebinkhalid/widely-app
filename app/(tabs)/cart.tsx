import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageProvider";

export default function CartScreen() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const { lang, t } = useLanguage();
  const router = useRouter();

  const handleAppCheckout = async () => {
    if (cart.length === 0) return;

    try {
      // 1. Check if there are any saved addresses
      const saved = await AsyncStorage.getItem("user_addresses");
      const list = saved ? JSON.parse(saved) : [];

      if (list.length > 0) {
        // CASE A: User HAS an address. Go straight to Payment.
        router.push("/checkout/payment");
      } else {
        // CASE B: First-time user. Start the Address Flow.
        router.push({
          pathname: "/checkout/location",
          params: { from: "checkout" },
        });
      }
    } catch (error) {
      console.error("Error checking addresses", error);
      // Fallback: send to location if something fails
      router.push("/checkout/location");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity
        style={styles.itemPressArea}
        onPress={() => router.push(`/product/${item.id}`)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text
            style={[
              styles.itemName,
              { textAlign: lang === "ar" ? "right" : "left" },
            ]}
          >
            {lang === "ar" ? item.nameAr : item.nameEn}
          </Text>
          <View
            style={[
              styles.priceRow,
              { flexDirection: lang === "ar" ? "row-reverse" : "row" },
            ]}
          >
            <Text style={styles.itemPrice}>{item.price} SAR</Text>
            <Text style={styles.itemQty}> x {item.quantity}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => removeFromCart(item.id)}
        style={styles.deleteBtn}
      >
        <Ionicons name="trash-outline" size={22} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t("My Cart", "سلة المشتريات")}</Text>
        <Text style={styles.itemCount}>
          {cart.length} {t("Items", "منتجات")}
        </Text>
      </View>
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={60} color="#DDD" />
          </View>
          <Text style={styles.emptyText}>
            {t("Your cart is empty", "سلتك فارغة حالياً")}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.footer}>
            <View style={styles.divider} />
            <View
              style={[
                styles.totalRow,
                { flexDirection: lang === "ar" ? "row-reverse" : "row" },
              ]}
            >
              <Text style={styles.totalLabel}>
                {t("Total Amount", "الإجمالي الكلي")}
              </Text>
              <Text style={styles.totalValue}>{totalPrice.toFixed(2)} SAR</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleAppCheckout}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutText}>
                {t("Confirm Order", "تأكيد الطلب الآن")}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#000" },
  itemCount: { fontSize: 14, color: "#888", fontWeight: "600" },
  listContent: { padding: 20, paddingBottom: 40 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: { fontSize: 16, color: "#AAA", fontWeight: "500" },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  itemPressArea: { flex: 1, flexDirection: "row", alignItems: "center" },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  itemDetails: { flex: 1, paddingHorizontal: 15 },
  itemName: { fontSize: 16, fontWeight: "700", color: "#222", marginBottom: 5 },
  priceRow: { alignItems: "center" },
  itemPrice: { fontSize: 15, fontWeight: "800", color: "#000" },
  itemQty: { fontSize: 14, color: "#888" },
  deleteBtn: { padding: 5 },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginBottom: 15 },
  totalRow: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: { fontSize: 14, color: "#888", fontWeight: "600" },
  totalValue: { fontSize: 22, fontWeight: "900", color: "#000" },
  checkoutBtn: {
    backgroundColor: "#000",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutText: { color: "#FFD700", fontSize: 18, fontWeight: "bold" },
});
