import React from "react";
import { StyleSheet, View } from "react-native";

export default function UniversalMap({ region }: any) {
  const lat = region?.latitude || 21.4858;
  const lng = region?.longitude || 39.1925;
  // Inside UniversalMap.tsx
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <View style={styles.container}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, borderRadius: 15 }}
        allowFullScreen
        loading="lazy"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    overflow: "hidden",
  },
});
