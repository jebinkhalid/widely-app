import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions, // Added for dynamic width
} from "react-native";
import { useLanguage } from "../context/LanguageProvider";
import { MOCK_PRODUCTS } from "../data/products";

// ✅ Desktop constants
const MAX_CONTENT_WIDTH = 1200;
const MIN_CARD_WIDTH = 180;

export default function SearchResultsScreen() {
  const { q } = useLocalSearchParams();
  const { lang, t } = useLanguage();
  const router = useRouter();

  // ✅ Detect window width
  const { width } = useWindowDimensions();

  // ✅ Dynamic column calculation
  const numColumns = useMemo(() => {
    const availableWidth = Math.min(width, MAX_CONTENT_WIDTH);
    const cols = Math.floor(availableWidth / MIN_CARD_WIDTH);
    return cols < 2 ? 2 : cols; // Minimum 2 columns
  }, [width]);

  // Search Logic
  const results = MOCK_PRODUCTS.filter((product) => {
    const query = q?.toString().toLowerCase().trim() || "";
    const nameEn = product.en.toLowerCase();
    const nameAr = product.ar;
    const matchesEn =
      nameEn.includes(query) || nameEn.replace(/\s/g, "").includes(query);
    const matchesAr = nameAr.includes(query);
    return matchesEn || matchesAr;
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: `${t("Results for", "نتائج البحث عن")} "${q}"`,
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

      {/* ✅ Wrapper to center content on Desktop */}
      <View style={styles.centeredWrapper}>
        <FlatList
          key={numColumns} // Force re-render on grid change
          data={results}
          numColumns={numColumns}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={
            numColumns > 1
              ? { flexDirection: lang === "ar" ? "row-reverse" : "row" }
              : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.productCard,
                {
                  width: (Math.min(width, MAX_CONTENT_WIDTH) - 40) / numColumns,
                },
              ]}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.img }} style={styles.image} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {lang === "ar" ? item.ar : item.en}
                </Text>
                <Text style={styles.price}>
                  {item.price} {t("SAR", "ر.س")}
                </Text>
                <Text style={styles.minQty}>
                  {t("Min:", "أقل كمية:")} {item.minQty}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={80} color="#E0E0E0" />
              <Text style={styles.emptyText}>
                {t("No products found", "لم يتم العثور على منتجات")}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // ✅ Center content for web
  centeredWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
  },
  listContent: {
    padding: 10,
    paddingBottom: 40,
  },
  productCard: {
    margin: 5, // Simplified margin
    borderRadius: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1, // Keep images square
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    height: 40,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E63946",
    marginTop: 4,
  },
  minQty: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 20,
    color: "#999",
    fontSize: 16,
  },
});
