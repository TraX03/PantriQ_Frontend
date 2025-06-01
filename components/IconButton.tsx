import { Colors } from "@/constants/Colors";
import { getOverlayStyle } from "@/utility/imageUtils";
import { TouchableOpacity, ViewStyle } from "react-native";
import { IconSymbol, IconSymbolName } from "./ui/IconSymbol";

type IconButtonProps = {
  name: IconSymbolName;
  onPress: () => void;
  isBackgroundDark: boolean;
  iconSize?: number;
  containerClassName?: string;
  containerStyle?: ViewStyle | ViewStyle[];
};

const IconButton = ({
  name,
  onPress,
  isBackgroundDark,
  iconSize = 24,
  containerClassName = "rounded-full p-1.5 justify-center items-center",
  containerStyle = {},
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={containerClassName}
      style={[
        getOverlayStyle(isBackgroundDark),
        { borderWidth: 1.5 },
        containerStyle,
      ]}
    >
      <IconSymbol
        name={name}
        size={iconSize}
        color={
          isBackgroundDark ? Colors.surface.buttonPrimary : Colors.surface.backgroundSoft
        }
      />
    </TouchableOpacity>
  );
};

export default IconButton;
