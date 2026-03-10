import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";

export default function NewScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ThemedText>Screen Coming Soon!</ThemedText>
    </View>
  );
}
