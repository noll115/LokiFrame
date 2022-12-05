import { BlurView } from "expo-blur";
import { FC, useState } from "react";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ImageData } from "../utils/frameAPI";

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

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
    <AnimatedBlur entering={FadeIn} style={styles.viewImageContainer}>
      <SafeAreaView style={styles.viewImageInnerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => {
              setLoaded(false);
              removeViewedImage();
            }}
          >
            <Feather name={"x"} size={24} color={"black"} />
          </TouchableOpacity>
        </View>
        <Animated.Image
          resizeMode="center"
          style={[styles.viewImage, showStyle]}
          onLoad={() => setLoaded(true)}
          source={{ uri: selectedImage.uri }}
        />
      </SafeAreaView>
    </AnimatedBlur>
  );
};

const styles = StyleSheet.create({
  viewImageContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  viewImage: {
    width: "80%",
    height: "80%",
  },
  viewImageInnerContainer: {
    width: "100%",
    height: "100%",
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
});

export default ImageViewer;
