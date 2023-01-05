import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageData, useLokiFrameAPI } from "../utils/frameAPI";
import { Feather } from "@expo/vector-icons";
import React, { FC, useCallback, useMemo, useState } from "react";
import ImageViewer from "./ImageViewer";

import ImageGridDisplay from "./ImageList";

const ImageListView: FC = () => {
  const {
    images,
    uploadNewImages,
    toggleImageDelete,
    resetImages,
    confirmDelete,
    isLoading,
  } = useLokiFrameAPI();
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
    if (!res.canceled) {
      await uploadNewImages(res.assets);
    }
  };

  const removeSelectedImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

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
              disabled={isLoading}
              name={deleteImages ? "x" : "trash"}
              size={25}
              color={deleteImages ? "black" : "red"}
            />
          </TouchableOpacity>
        </View>
        <ImageGridDisplay
          images={images}
          deleteImages={deleteImages}
          toggleImageDelete={toggleImageDelete}
          viewImage={setSelectedImage}
        />
        <View style={styles.bottomView}>
          {deleteImages ? (
            <Button
              title="Remove"
              color="red"
              disabled={!images.some((image) => image.toDelete)}
              onPress={() => {
                setdeleteImages(!deleteImages);
                confirmDelete();
              }}
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
    marginBottom: 15,
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
});

export default ImageListView;
