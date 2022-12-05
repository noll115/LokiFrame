import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import ImageListView from "./components/ImageListView";

export default function App() {
  return (
    <View style={styles.container}>
      <ImageListView />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    flex: 1,
  },
});
