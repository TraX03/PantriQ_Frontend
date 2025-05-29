import { Text, View } from "react-native";
import styles from "./styles";

type Props = {
  text1?: string;
  text2?: string;
};

export default function CustomToast({ text1, text2 }: Props) {
  return (
    <View style={styles.toastContainer}>
      <Text style={styles.toastText}>{text1}</Text>
      {text2 ? <Text style={styles.toastSubText}>{text2}</Text> : null}
    </View>
  );
}
