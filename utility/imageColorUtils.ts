import ImageColors from "react-native-image-colors";
import { Colors } from "@/constants/Colors";

export const isColorDark = (hex: string) => {
  const rgb = parseInt(hex.substring(1), 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 128;
};

export const detectBackgroundDarkness = async (
  imageUrl: string,
  fallbackColor = Colors.brand.base
): Promise<boolean> => {
  try {
    const result = await ImageColors.getColors(imageUrl, {
      fallback: fallbackColor,
      cache: true,
      key: imageUrl,
    });

    const dominantColor =
      result.platform === "android" ? result.dominant : fallbackColor;

    return isColorDark(dominantColor ?? fallbackColor);
  } catch (error) {
    console.warn("Failed to get image colors:", error);
    return false;
  }
};

export const getOverlayStyle = (isDark: boolean, isIcon?: boolean) => {
  if (isIcon) {
    return {
      color: isDark ? Colors.ui.buttonFill : Colors.ui.backgroundLight,
    };
  }

  return {
    backgroundColor: isDark ? Colors.ui.overlayLight : Colors.ui.overlayDark,
    borderColor: isDark ? Colors.ui.buttonFill : "transparent",
    borderWidth: 1.5,
  };
};
