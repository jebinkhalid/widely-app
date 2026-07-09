import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageProvider";
import api from "../services/api";

interface OrderSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  orderItem?: string;
  orderPrice?: number;
}

export default function OrderSuccessModal({
  visible,
  onClose,
  orderItem = "Product",
  orderPrice = 0,
}: OrderSuccessModalProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { cart } = useCart();

  // Compute textual display overview strings for the modal card text overlay
  const displayItemName =
    cart && cart.length > 0
      ? cart.length > 1
        ? `${(cart[0] as any)?.title || (cart[0] as any)?.name || "Item"} + ${cart.length - 1} ${t("more items", "قطع أخرى")}`
        : (cart[0] as any)?.title || (cart[0] as any)?.name || orderItem
      : orderItem;

  const displayTotalPrice =
    cart && cart.length > 0
      ? cart.reduce(
          (sum: number, item: any) =>
            sum + Number(item.price || 0) * (item.quantity || 1),
          0,
        )
      : orderPrice;

  async function playSuccessSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/orderplaced.mp4"),
      );
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Sound error:", error);
    }
  }

  // 🎯 FIXED DATA TRANSFER: Directly maps titles and images to match your Order History screen
  async function saveOrderToDatabase() {
    if (!user?.id) {
      console.warn("⚠️ Cannot save order: No user id found.");
      return;
    }

    try {
      const activeUser = user as any;
      console.log(
        `🛫 Transmitting checkout mapping directly to backend for user: ${activeUser.id}`,
      );

      if (cart && cart.length > 0) {
        // Send each individual item to your api endpoint with its real parameters!
        const orderPromises = cart.map((cartItem: any) => {
          return api.post("/api/place-order", {
            userId: activeUser.id,
            item: cartItem.title || cartItem.name || "Product", // 👈 Sends exact item name
            price: Number(cartItem.price || 0), // 👈 Sends real individual unit cost
            image: cartItem.image || "", // 👈 Sends product picture URL
            address: "Default Checkout Address",
            paymentMethod: "Prepaid",
            status: "Placed",
          });
        });
        await Promise.all(orderPromises);
      } else {
        // Single fallback if the user checked out directly bypasses a global cart array
        const orderPayload = {
          userId: activeUser.id,
          item: displayItemName,
          price: Number(displayTotalPrice),
          image: "",
          address: "Default Checkout Address",
          paymentMethod: "Prepaid",
          status: "Placed",
        };
        await api.post("/api/place-order", orderPayload);
      }

      console.log("✅ Production database tracking successfully synchronized!");
    } catch (error) {
      console.error(
        "❌ Failed to register purchase to backend databases:",
        error,
      );
    }
  }

  useEffect(() => {
    if (visible) {
      playSuccessSound();
      saveOrderToDatabase();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <LottieView
            autoPlay
            loop={false}
            style={styles.lottie}
            source={require("../assets/animations/success_check.json")}
          />

          <Text style={styles.title}>
            {t("Order Placed!", "تم الطلب بنجاح!")}
          </Text>

          <Text style={styles.subtitle}>
            {t("Your", "طلبك")}{" "}
            <Text style={styles.boldText}>{displayItemName}</Text>{" "}
            {t("is on its way for", "في طريقه إليك بقيمة")}
            <Text style={styles.boldText}>
              {" "}
              {displayTotalPrice} {t("SAR", "ر.س")}
            </Text>
            .
          </Text>

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => {
              onClose();
              router.replace("/orders-list");
            }}
          >
            <Text style={styles.doneBtnText}>
              {t("View Order History", "عرض سجل الطلبات")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#FFD700",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  lottie: { width: 180, height: 180 },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24,
    marginBottom: 30,
  },
  boldText: { fontWeight: "800" },
  doneBtn: {
    backgroundColor: "#000",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  doneBtnText: {
    color: "#FFD700",
    fontWeight: "900",
    fontSize: 15,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
