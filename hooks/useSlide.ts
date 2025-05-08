import { useEffect, useRef, useState } from "react";
import { Animated, StatusBar } from "react-native";

export function useSlide(isVisible: boolean) {
  const translateY = useRef(new Animated.Value(300)).current;
  const [shouldRender, setShouldRender] = useState(isVisible);
  const cancelUnmount = useRef(false);

  useEffect(() => {
    const initialY = StatusBar.currentHeight || 100;

    if (isVisible) {
      cancelUnmount.current = true;
      setShouldRender(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      cancelUnmount.current = false;
      Animated.spring(translateY, {
        toValue: initialY + 100,
        useNativeDriver: true,
      }).start(() => {
        if (!cancelUnmount.current) {
          setShouldRender(false);
        }
      });
    }
  }, [isVisible]);

  return { translateY, shouldRender };
}
