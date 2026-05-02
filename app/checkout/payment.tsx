import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 1. Import the new components
import OrderSuccessModal from "../../components/OrderSuccessModal";

export default function PaymentPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<any>(null);

  // 2. Add state for the Success Modal
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadDefaultAddress = async () => {
      try {
        const savedAddresses = await AsyncStorage.getItem("user_addresses");
        const defaultId = await AsyncStorage.getItem("default_address_id");

        if (savedAddresses && defaultId) {
          const list = JSON.parse(savedAddresses);
          const found = list.find((item: any) => item.id === defaultId);
          setDefaultAddress(found);
        } else if (savedAddresses) {
          const list = JSON.parse(savedAddresses);
          if (list.length > 0) setDefaultAddress(list[0]);
        }
      } catch (e) {
        console.error("Failed to load address", e);
      }
    };
    loadDefaultAddress();
  }, []);

  // 3. Create the Place Order Handler
  const handlePlaceOrder = () => {
    // You can add your backend API call here later
    setShowSuccess(true);
  };

  const paymentMethods = [
    {
      id: "apple",
      name: "Apple Pay",
      icon: "logo-apple",
      type: "ion",
      color: "#000",
    },
    {
      id: "card",
      name: "Debit/Credit Card",
      icon: "card-outline",
      type: "ion",
      extra: "+ Add New",
    },
    {
      id: "tabby",
      name: "Tabby",
      sub: "Split into 4 interest-free payments",
      brandColor: "#31F9B2",
    },
    {
      id: "tamara",
      name: "Tamara",
      sub: "Pay in 4 interest-free payments",
      brandColor: "#FFC700",
    },
    {
      id: "cod",
      name: "Cash On Delivery",
      icon: "cash-outline",
      type: "ion",
      sub: "Extra charges may be applied",
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen
        options={{
          headerTitle: "Checkout",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressTitle}>Address</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/checkout/address-book",
                  params: { from: "checkout" },
                })
              }
            >
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addressDisplayCard}
            onPress={() =>
              router.push({
                pathname: "/checkout/address-book",
                params: { from: "checkout" },
              })
            }
          >
            <View style={styles.locIconCircle}>
              <Ionicons name="location" size={20} color="#2B57CC" />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.deliverToText}>Deliver to</Text>
              <Text style={styles.fullAddressText} numberOfLines={1}>
                {defaultAddress ? defaultAddress.text : "No address selected"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Pay With</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            activeOpacity={0.7}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.methodRow}>
              <View style={styles.methodMain}>
                {method.icon ? (
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={method.icon as any}
                      size={24}
                      color="#0F172A"
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.brandBox,
                      { backgroundColor: method.brandColor },
                    ]}
                  >
                    <Text style={styles.brandInitial}>{method.name[0]}</Text>
                  </View>
                )}
                <View style={styles.methodTextContainer}>
                  <View style={styles.methodHeaderRow}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    {method.extra && (
                      <TouchableOpacity>
                        <Text style={styles.extraLink}>{method.extra}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {method.sub && (
                    <Text style={styles.methodSub}>{method.sub}</Text>
                  )}
                </View>
              </View>
              <View style={styles.radioCircle}>
                {selectedMethod === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Order Summary Section */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.oldPrice}>188.00</Text>
              <Text style={styles.priceValue}>68.00 SAR</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Fee</Text>
            <Text style={styles.freeText}>
              Free <Text style={styles.strikethroughText}>13.00 SAR</Text>
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>
              Total <Text style={styles.vatText}>(Incl. VAT)</Text>
            </Text>
            <Text style={styles.totalValue}>81.00 SAR</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <SafeAreaView style={styles.footerContainer}>
        <View style={styles.footer}>
          <View style={styles.footerPriceInfo}>
            <Text style={styles.footerItemCount}>1 Item</Text>
            <Text style={styles.footerTotalAmount}>81.00 SAR</Text>
          </View>
          <TouchableOpacity
            style={[styles.payBtn, !selectedMethod && styles.payBtnDisabled]}
            disabled={!selectedMethod}
            onPress={handlePlaceOrder} // 4. Updated press handler
          >
            <Text style={styles.payBtnText}>
              {selectedMethod ? "PLACE ORDER" : "SELECT PAYMENT"}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={selectedMethod ? "white" : "#94A3B8"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* 5. The Success Overlay */}
      <OrderSuccessModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        orderItem="Shoes"
        orderPrice={200}
      />
    </View>
  );
}

// ... existing styles ...

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingBottom: 120 },

  // New Address Styles
  addressSection: { marginBottom: 20 },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  addressTitle: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  changeBtnText: { color: "#2B57CC", fontWeight: "700", fontSize: 14 },
  addressDisplayCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  locIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addressInfo: { flex: 1 },
  deliverToText: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  fullAddressText: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0F172A",
  },
  methodCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "white",
    elevation: 2,
  },
  selectedCard: { borderColor: "#2B57CC", backgroundColor: "#F8FAFF" },
  methodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  methodMain: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: {
    width: 44,
    height: 44,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  brandBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  brandInitial: { color: "white", fontWeight: "bold", fontSize: 18 },
  methodTextContainer: { flex: 1 },
  methodHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  methodName: { fontWeight: "700", fontSize: 16, color: "#1E293B" },
  methodSub: { fontSize: 12, color: "#64748B", marginTop: 4 },
  extraLink: { color: "#2B57CC", fontSize: 13, fontWeight: "700" },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#2B57CC",
  },
  summaryCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 18,
    color: "#0F172A",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  summaryLabel: { color: "#64748B", fontSize: 14, fontWeight: "500" },
  priceContainer: { flexDirection: "row", alignItems: "center" },
  oldPrice: {
    color: "#94A3B8",
    textDecorationLine: "line-through",
    marginRight: 8,
    fontSize: 13,
  },
  priceValue: { fontWeight: "700", color: "#0F172A", fontSize: 14 },
  freeText: { color: "#10B981", fontWeight: "700" },
  strikethroughText: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
    fontSize: 12,
  },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 15 },
  totalLabel: { fontSize: 17, fontWeight: "800", color: "#0F172A" },
  vatText: { fontSize: 12, color: "#64748B", fontWeight: "400" },
  totalValue: { fontSize: 20, fontWeight: "900", color: "#2B57CC" },
  pointsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginTop: 15,
  },
  pointsInfo: { flexDirection: "row", alignItems: "center" },
  pointsIconBg: { padding: 8, backgroundColor: "#EEF2FF", borderRadius: 10 },
  pointsTitle: { fontWeight: "700", fontSize: 14, color: "#1E293B" },
  pointsSub: { fontSize: 12, color: "#64748B", marginTop: 2 },
  selectText: { color: "#2B57CC", fontWeight: "800", fontSize: 14 },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 10 : 20,
  },
  footerPriceInfo: { flex: 0.4 },
  footerItemCount: { fontSize: 12, color: "#64748B", fontWeight: "500" },
  footerTotalAmount: { fontSize: 18, fontWeight: "900", color: "#0F172A" },
  payBtn: {
    backgroundColor: "#2B57CC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    flex: 0.6,
  },
  payBtnDisabled: { backgroundColor: "#F1F5F9" },
  payBtnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    marginRight: 8,
  },
});
