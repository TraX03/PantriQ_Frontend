import { Colors } from "@/constants/Colors";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import { IconSymbol } from "./ui/IconSymbol";

type CounterInputProps = {
  label: string;
  value?: number;
  onDecrement: () => void;
  onIncrement: () => void;
};

const CounterInput = ({
  label,
  value,
  onDecrement,
  onIncrement,
}: CounterInputProps) => (
  <View className="flex-row items-center gap-2 mt-2">
    <Text className="text-[15px]">{label}</Text>
    <Pressable onPress={onDecrement}>
      <IconSymbol
        name="minus.square.fill"
        color={Colors.brand.primaryDark}
        size={23}
      />
    </Pressable>
    <View style={styles.counterContainer}>
      <Text>{value}</Text>
    </View>
    <Pressable onPress={onIncrement}>
      <IconSymbol
        name="plus.square.fill"
        color={Colors.brand.primaryDark}
        size={23}
      />
    </Pressable>
  </View>
);

export default CounterInput;
