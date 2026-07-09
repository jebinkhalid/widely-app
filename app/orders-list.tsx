import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageProvider";
import api from "../services/api";

// Define TypeScript structure based on your MongoDB Schema
interface Order {
  _id: string;
  item: string;
  price: number;
  image?: string;
  address?: string;
  paymentMethod?: string;
  status: string;
  createdAt: string;
}

export default function OrdersListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const isRTL = lang === "ar";

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user?.id) {
        console.warn("⚠️ No user ID found in auth context yet.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        console.log(`📡 Requesting database sync for user ID: ${user.id}`);

        // Hitting your freshly deployed endpoint
        const response = await api.get(`/api/my-orders/${user.id}`);

        if (Array.isArray(response.data)) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error("❌ Failed to pull live orders from MongoDB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [user]);

  // Design structure for individual purchase rows
  const renderOrderCard = ({ item }: { item: Order }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString(
      lang === "ar" ? "ar-SA" : "en-US",
      { year: "numeric", month: "short", day: "numeric" },
    );

    return (
      <View style={styles.orderCard}>
        {/* Card Header metadata */}
        <View
          style={[
            styles.cardHeader,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" }}
          >
            <Text style={styles.orderIdText}>
              {t("Order ID:", "رقم الطلب:")} #{item._id.slice(-6).toUpperCase()}
            </Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "Placed" ? "#eff6ff" : "#f0f0f0",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: item.status === "Placed" ? "#1e40af" : "#333" },
              ]}
            >
              {t(
                item.status,
                item.status === "Placed" ? "تم مراجعته" : item.status,
              )}
            </Text>
          </View>
        </View>

        {/* Product row item parameters */}
        <View
          style={[
            styles.productRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {/* Default icon box representing the purchase item type */}
          <View style={styles.iconPlaceholderBox}>
            <Ionicons name="cube-outline" size={24} color="#FFD700" />
          </View>

          <View
            style={[
              styles.productInfo,
              { alignItems: isRTL ? "flex-end" : "flex-start" },
            ]}
          >
            <Text numberOfLines={2} style={styles.productTitle}>
              {item.item}
            </Text>
            <Text style={styles.productPrice}>
              SAR {Number(item.price).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Dynamic Navigation Bar */}
      <View
        style={[
          styles.headerBar,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name={isRTL ? "arrow-forward" : "arrow-back"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("Order History", "سجل الطلبات")}
        </Text>
        <View style={{ width: 24 }} /> {/* Balancing box block */}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons
            name="gift-outline"
            size={80}
            color="#ccc"
            style={{ marginBottom: 15 }}
          />
          <Text style={styles.emptyText}>
            {t("No orders found yet", "لم يتم العثور على طلبات بعد")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f9" },
  headerBar: {
    height: 56,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: { fontSize: 16, color: "#888", fontWeight: "500" },
  listContent: { padding: 16 },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 12,
    marginBottom: 12,
  },
  orderIdText: { fontSize: 14, fontWeight: "700", color: "#111" },
  dateText: { fontSize: 12, color: "#888", marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  productRow: {
    alignItems: "center",
  },
  iconPlaceholderBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: { flex: 1, marginHorizontal: 12 },
  productTitle: { fontSize: 14, fontWeight: "600", color: "#333" },
  productPrice: {
    fontSize: 13,
    color: "#666",
    fontWeight: "bold",
    marginTop: 4,
  },
});
