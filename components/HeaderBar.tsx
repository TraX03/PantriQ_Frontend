import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "./ui/IconSymbol";

type Props = {
  title: string;
};

const HeaderBar = ({ title }: Props) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center px-4 py-3">
      <TouchableOpacity onPress={() => router.back()}>
        <IconSymbol name="chevron.left" color={Colors.brand.dark} size={30} />
      </TouchableOpacity>
      <Text className="text-xl font-semibold ml-4">{title}</Text>
    </View>
  );
};

export default HeaderBar;
