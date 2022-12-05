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
import { ImageData, useLokiFrameAPI } from "../utils/frameAPI";
import { Feather } from "@expo/vector-icons";
import { FC, useState } from "react";
import ImageViewer from "./ImageViewer";

const ImageListView: FC = () => {
  const { images, uploadNewImages, toggleImageDelete, resetImages } =
    useLokiFrameAPI();
  const [deleteImages, setdeleteImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

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
      videoMaxDuration: 15,
      videoQuality:
        ImagePicker.UIImagePickerControllerQualityType.IFrame1280x720,
    });
    console.log(res);
    if (!res.canceled) {
      await uploadNewImages(res.assets);
    }
  };

  const viewImage = (index: number) => {
    return () => {
      setSelectedImage(images[index]);
    };
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleText}>Current Photos</Text>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => {
              if (deleteImages) {
                resetImages();
              }
              setdeleteImages(!deleteImages);
            }}
          >
            <Feather
              name={deleteImages ? "x" : "trash"}
              size={24}
              color={deleteImages ? "black" : "red"}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={images}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item.uri}
              style={styles.imageContainer}
              onPress={
                deleteImages ? toggleImageDelete(index) : viewImage(index)
              }
            >
              <Image
                style={styles.image}
                onLayout={(event) => {}}
                source={{
                  uri: item.uri,
                }}
              />
              {deleteImages && (
                <Feather
                  style={styles.deleteIcon}
                  name={item.toDelete ? "check-circle" : "circle"}
                  size={24}
                  color={item.toDelete ? "red" : "black"}
                />
              )}
            </TouchableOpacity>
          )}
          numColumns={3}
        />
        <View style={styles.bottomView}>
          {deleteImages ? (
            <Button
              title="Remove"
              color="red"
              disabled={!images.some((image) => image.toDelete)}
              onPress={pickImages}
            />
          ) : (
            <Button title="Add New Photos" onPress={pickImages} />
          )}
        </View>
      </SafeAreaView>
      <ImageViewer
        selectedImage={selectedImage}
        removeViewedImage={removeSelectedImage}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
  },
  headerIcon: {
    position: "absolute",
    right: 17,
  },
  titleText: {
    fontSize: 25,
  },
  bottomView: {
    paddingVertical: 7,
  },
  imageContainer: {
    width: 120,
    height: 120,
    padding: 2,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  deleteIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});

export default ImageListView;
