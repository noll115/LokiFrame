import {
  Button,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageData, useLokiFrameAPI } from "../utils/frameAPI";
import { Feather } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import ImageViewer from "./ImageViewer";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const ImageListView: FC = () => {
  const {
    images,
    uploadNewImages,
    toggleImageDelete,
    resetImages,
    confirmDelete,
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

  const viewImage = (index: number) => {
    return () => {
      setSelectedImage(images[index]);
    };
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const renderItem: ListRenderItem<ImageData> = ({ item, index }) => (
    <ImageDisplay
      key={item.fileName}
      deleteImages={deleteImages}
      image={item}
      toggleImageDelete={toggleImageDelete(index)}
      viewImage={viewImage(index)}
    />
  );

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
              size={25}
              color={deleteImages ? "black" : "red"}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          initialNumToRender={18}
          data={images}
          renderItem={renderItem}
          numColumns={3}
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

const ImageDisplay: FC<{
  image: ImageData;
  toggleImageDelete: () => void;
  viewImage: () => void;
  deleteImages: boolean;
}> = ({ image, toggleImageDelete, viewImage, deleteImages }) => {
  const [loaded, setLoaded] = useState(false);

  const fadeInStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(loaded ? 1 : 0),
    };
  }, [loaded]);

  console.log(image.fileName, loaded);

  return (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={deleteImages ? toggleImageDelete : viewImage}
    >
      <Animated.Image
        style={[styles.image, fadeInStyle]}
        onLoad={() => setLoaded(true)}
        source={{
          uri: image.uri,
        }}
      />
      {deleteImages && (
        <Feather
          style={styles.deleteIcon}
          name={image.toDelete ? "check-circle" : "circle"}
          size={24}
          color={image.toDelete ? "red" : "black"}
        />
      )}
    </TouchableOpacity>
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
