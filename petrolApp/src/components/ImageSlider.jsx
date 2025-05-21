import { View, Image, FlatList, Dimensions } from "react-native";
import { useRef, useState, useEffect, useCallback } from "react";

const images = [
  require("@/assets/images/promotion1.png"),
  require("@/assets/images/promotion2.png"),
  require("@/assets/images/promotion4.png"),
];

const { width } = Dimensions.get("window");

const ImageSlider = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const scrollToIndex = useCallback((index) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  }, []);

  useEffect(() => {
    if (isUserInteracting) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
      scrollToIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, scrollToIndex, isUserInteracting]);

  return (
    <View style={{ borderRadius: 15, overflow: "hidden" }}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        snapToInterval={width}
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={{ width, height: 140, padding: 30 }}
            resizeMode="stretch"
          />
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
        onTouchStart={() => setIsUserInteracting(true)}
        onTouchEnd={() => setIsUserInteracting(false)}
        onScrollBeginDrag={() => setIsUserInteracting(true)}
        onScrollEndDrag={() => setIsUserInteracting(false)}
      />
    </View>
  );
};

export default ImageSlider;
