import React, { FC, useMemo } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ImageData } from "../utils/frameAPI";
import FastImage from "react-native-fast-image";

const keyExtractor = (item: ImageData, index: number) => {
  return index.toString();
};
const ImageGridDisplay: FC<{
  images: ImageData[];
  deleteImages: boolean;
  viewImage: (i: ImageData) => void;
  toggleImageDelete: (i: number) => void;
}> = React.memo(({ images, deleteImages, viewImage, toggleImageDelete }) => {
  const RenderItem = useMemo(
    () => renderItem(viewImage, toggleImageDelete, deleteImages),
    [deleteImages]
  );

  return (
    <FlatList
      keyExtractor={keyExtractor}
      numColumns={3}
      data={images}
      renderItem={RenderItem}
    />
  );
});

const renderItem = (
  viewImage: (i: ImageData) => void,
  toggleImageDelete: (i: number) => void,
  deleteImages: boolean
): ListRenderItem<ImageData> => {
  return ({ item, index }) => {
    return (
      <ImageDisplay
        key={item.fileName}
        index={index}
        deleteImages={deleteImages}
        image={item}
        toDeleteImage={item.toDelete}
        toggleImageDelete={toggleImageDelete}
        viewImage={viewImage}
      />
    );
  };
};

const ImageDisplay: FC<{
  index: number;
  image: ImageData;
  toDeleteImage: boolean;
  toggleImageDelete: (i: number) => void;
  viewImage: (i: ImageData) => void;
  deleteImages: boolean;
}> = React.memo(
  ({
    index,
    image,
    toggleImageDelete,
    viewImage,
    deleteImages,
    toDeleteImage,
  }) => {
    const toggleDelete = () => {
      toggleImageDelete(index);
    };

    const viewThisImage = () => {
      viewImage(image);
    };

    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={deleteImages ? toggleDelete : viewThisImage}
      >
        <FastImage
          style={styles.image}
          source={{
            uri: image.uri,
          }}
        />
        {deleteImages && (
          <Feather
            style={styles.deleteIcon}
            name={toDeleteImage ? "check-circle" : "circle"}
            size={24}
            color={toDeleteImage ? "red" : "black"}
          />
        )}
      </TouchableOpacity>
    );
  },
  (prev, next) => {
    if (prev.toDeleteImage != next.toDeleteImage) {
      return false;
    }
    if (prev.deleteImages != next.deleteImages) {
      return false;
    }
    return true;
  }
);

const styles = StyleSheet.create({
  deleteIcon: {
    position: "absolute",
    right: 10,
    top: 10,
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
    borderRadius: 10,
  },
});

export default ImageGridDisplay;
