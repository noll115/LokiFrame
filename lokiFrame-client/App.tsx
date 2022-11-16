import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useLokiFrameAPI } from "./utils/frameAPI";

export default function App() {
  const [imagesToUpload, setImagesToUpload] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const { imagesFromFrame, isLoading, uploadNewImages } = useLokiFrameAPI();

  const pickImages = async () => {
    const permission = await ImagePicker.getCameraPermissionsAsync();
    if (!permission) {
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
      exif: true,
      videoMaxDuration: 30,
      videoQuality:
        ImagePicker.UIImagePickerControllerQualityType.IFrame1280x720,
    });
    console.log(res);
    if (!res.canceled) {
      uploadNewImages(res.assets);
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        <Text style={styles.title}>Current Photos</Text>
        <FlatList
          data={imagesFromFrame}
          renderItem={({ item }) => (
            <TouchableOpacity key={item} style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{
                  uri: item,
                }}
              />
            </TouchableOpacity>
          )}
          numColumns={3}
        />
        <Button title="Add New Photos" onPress={pickImages} />
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    paddingVertical: 5,
  },
  imageContainer: {
    padding: 2,
  },
  image: {
    width: 110,
    height: 110,
  },
  bottomView: {
    backgroundColor: "#EEEE",
  },
});
