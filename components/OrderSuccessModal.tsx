import axios from "axios";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BASE_URL =
  Platform.OS === "web" ? "http://127.0.0.1:5000" : "http://172.20.10.3:5000";

interface OrderSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  orderItem: string;
  orderPrice: number;
}

export default function OrderSuccessModal({
  visible,
  onClose,
  orderItem,
  orderPrice,
}: OrderSuccessModalProps) {
  const router = useRouter();

  // SAVE ORDER
  const saveOrderToDatabase = async () => {
    console.log("🔥 FUNCTION CALLED");

    try {
      const orderData = {
        userId: "rashid_21",
        item: orderItem,
        price: orderPrice,
        status: "Placed",
      };

      console.log("🚀 Sending:", orderData);

      const res = await axios.post(`${BASE_URL}/api/place-order`, orderData);

      console.log("✅ Saved:", res.data);
    } catch (error: any) {
      console.log("❌ ERROR:", error.message);
    }
  };

  // SOUND
  async function playSuccessSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/orderplaced.mp4"),
      );
      await sound.playAsync();
    } catch (error) {
      console.log("Sound error:", error);
    }
  }

  useEffect(() => {
    console.log("🔥 FORCE SAVE TRIGGER");
    saveOrderToDatabase();
  }, []);

  const handleDone = () => {
    onClose();
    router.replace("/");
  };

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

          <Text style={styles.title}>Order Placed!</Text>

          <Text style={styles.subtitle}>
            Your {orderItem} is on its way for {orderPrice} SAR. Check your
            email for details.
          </Text>

          <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
            <Text style={styles.doneBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
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
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#000",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
    marginBottom: 25,
  },
  doneBtn: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  doneBtnText: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 16,
  },
});
