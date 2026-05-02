import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const BASE_URL =
  Platform.OS === "web" ? "http://127.0.0.1:5000" : "http://172.20.10.3:5000";

interface Order {
  _id: string;
  item: string;
  price: number;
  status: string;
  createdAt: string;
}

export default function OrdersListScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // NOTE: Make sure your backend has app.get('/api/my-orders/:username')
      const res = await axios.get(`${BASE_URL}/api/my-orders/rashid_21`);
      setOrders(res.data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        console.log("❌ Error 404: The route was not found on the server.");
      } else {
        console.log("❌ Error fetching orders:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="gift-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No orders found yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 15 }}
          renderItem={({ item }) => (
            <View style={styles.wishlistCard}>
              <View style={styles.imageContainer}>
                <Ionicons name="cube-outline" size={30} color="#ccc" />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.itemTitle}>{item.item}</Text>
                <Text style={styles.itemPrice}>{item.price} SAR</Text>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          item.status === "Delivered" ? "#28a745" : "#FFD700",
                      },
                    ]}
                  />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  wishlistCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  imageContainer: {
    width: 65,
    height: 65,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  itemPrice: { fontSize: 14, fontWeight: "bold", color: "#000", marginTop: 2 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 5 },
  statusText: { fontSize: 12, color: "#777" },
  emptyText: { marginTop: 10, color: "#888", fontSize: 16 },
});
