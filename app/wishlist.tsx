import { useLanguage } from "@/context/LanguageProvider";
import { useWishlist } from "@/context/WishlistProvider";
import { Ionicons } from "@expo/vector-icons";
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

export default function WishlistScreen() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { lang, t } = useLanguage();
  const router = useRouter();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.card,
        { flexDirection: lang === "ar" ? "row-reverse" : "row" },
      ]}
      // UPDATED NAVIGATION PATH TO MATCH YOUR PROJECT STRUCTURE
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View
        style={[
          styles.details,
          { alignItems: lang === "ar" ? "flex-end" : "flex-start" },
        ]}
      >
        <Text
          style={[styles.name, { textAlign: lang === "ar" ? "right" : "left" }]}
          numberOfLines={2}
        >
          {lang === "ar" ? item.nameAr || item.name : item.name}
        </Text>
        <Text style={styles.price}>{item.price} SAR</Text>

        <TouchableOpacity
          style={[
            styles.removeBtn,
            { flexDirection: lang === "ar" ? "row-reverse" : "row" },
          ]}
          onPress={() => toggleWishlist(item)}
        >
          <Ionicons name="trash-outline" size={18} color="#d9534f" />
          <Text
            style={[
              styles.removeText,
              lang === "ar" ? { marginRight: 5 } : { marginLeft: 5 },
            ]}
          >
            {t("Remove", "حذف")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ADDED A SMALL ARROW FOR BETTER UX */}
      <Ionicons
        name={lang === "ar" ? "chevron-back" : "chevron-forward"}
        size={20}
        color="#ccc"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>
              {t("Your wishlist is empty", "قائمة أمنياتك فارغة")}
            </Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={styles.shopBtnText}>
                {t("Start Shopping", "ابدأ التسوق")}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f9" },
  listContent: { padding: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: { width: 80, height: 80, borderRadius: 8, resizeMode: "contain" },
  details: { flex: 1, marginHorizontal: 15 },
  name: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "bold", color: "#000" },
  removeBtn: { alignItems: "center", marginTop: 8 },
  removeText: {
    color: "#d9534f",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { fontSize: 16, color: "#888", marginTop: 20 },
  shopBtn: {
    marginTop: 20,
    backgroundColor: "#000", // Changed to black to match your branding
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  shopBtnText: { color: "#FFD700", fontWeight: "bold" }, // Changed to gold to match branding
});
