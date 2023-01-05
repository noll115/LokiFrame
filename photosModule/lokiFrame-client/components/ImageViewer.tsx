import { BlurView } from "expo-blur";
import { FC, useState } from "react";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ImageData } from "../utils/frameAPI";
import FastImage from "react-native-fast-image";

const ImageViewer: FC<{
  selectedImage: ImageData | null;
  removeViewedImage: () => void;
}> = ({ selectedImage, removeViewedImage }) => {
  const [height, setHeight] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const showStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(loaded ? 1 : 0),
    };
  }, [loaded]);

  if (!selectedImage) {
    return null;
  }

  Image.getSize(selectedImage.uri, (width, height) => {
    setHeight(height);
  });

  if (!height) {
    return null;
  }

  return (
    <Modal transparent animationType="fade">
      <BlurView>
        <SafeAreaView style={styles.viewImageInnerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => {
                setLoaded(false);
                removeViewedImage();
              }}
            >
              <Feather name="x" size={25} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FastImage
              resizeMode="contain"
              style={[styles.image]}
              onLoad={() => {
                console.log("load", selectedImage.fileName);
                setLoaded(true);
              }}
              source={{ uri: selectedImage.uri }}
            />
            {!loaded && (
              <ActivityIndicator
                size="large"
                color="black"
                style={{ position: "absolute" }}
              />
            )}
          </View>
        </SafeAreaView>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  viewImageContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  image: {
    width: "95%",
    height: "100%",
  },
  viewImageInnerContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    height: 45,
  },
  headerIcon: {
    position: "absolute",
    right: 17,
  },
});

export default ImageViewer;
