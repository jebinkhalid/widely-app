import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity, View, ScrollView, TextInput } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
<ScrollView style={styles.container}>
      {/* 1. SEARCH BAR AREA */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <ThemedText style={{color: '#888'}}>🔍 Search Widely...</ThemedText>
        </View>
      </View>

      {/* 2. PROMO BANNER */}
      <View style={styles.banner}>
        <ThemedText style={styles.bannerTitle}>GRAND SALES</ThemedText>
        <ThemedText style={styles.bannerSub}>UP TO 90% OFF</ThemedText>
      </View>

      {/* 3. CATEGORIES ROW */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
        {['Women', 'Men', 'Home', 'Fashion', 'Tech'].map((cat) => (
          <View key={cat} style={styles.catItem}>
            <View style={styles.catCircle} />
            <ThemedText style={styles.catText}>{cat}</ThemedText>
          </View>
        ))}
      </ScrollView>

      {/* 4. PRODUCT GRID (Example) */}
      <View style={styles.grid}>
        <View style={styles.productCard}><ThemedText>Item 1</ThemedText></View>
        <View style={styles.productCard}><ThemedText>Item 2</ThemedText></View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
  },
  searchSection: {
    backgroundColor: '#000', // Black Header
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  searchBar: {
    backgroundColor: '#fff',
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  banner: {
    backgroundColor: '#ffee00', // Your Yellow
    margin: 15,
    height: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
  },
  bannerSub: {
    fontSize: 18,
    color: '#000',
  },
  catRow: {
    paddingLeft: 15,
    marginBottom: 20,
  },
  catItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  catCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#000', // Black circles
    marginBottom: 5,
  },
  catText: {
    fontSize: 12,
    color: '#000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  productCard: {
    width: '45%',
    height: 200,
    backgroundColor: '#f2f2f2',
    marginBottom: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
});
