import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { styles } from "./styles";
import { IconSymbol } from "./ui/IconSymbol";

type CustomPickerProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  iconColor?: string;
  includeEmptyOption?: boolean;
};

const CustomPicker = ({
  selectedValue,
  onValueChange,
  options,
  placeholder = "Unit",
  style,
  textStyle,
  iconColor,
  includeEmptyOption = true,
}: CustomPickerProps) => {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return (
    <>
      <TouchableOpacity
        onPress={open}
        style={[styles.pickerContainer, style]}
        className="flex-row items-center justify-between"
      >
        <Text
          style={[
            selectedValue ? styles.pickerText : styles.placeholder,
            textStyle,
          ]}
        >
          {selectedValue || placeholder}
        </Text>
        <IconSymbol
          name="arrowtriangle.down.fill"
          color={iconColor ? iconColor : Colors.text.disabled}
          size={10}
        />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={close}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={close}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={includeEmptyOption ? ["", ...options] : options}
              keyExtractor={(item) => item || "_empty"}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item);
                    close();
                  }}
                >
                  <Text style={[{ fontSize: 14 }, !item && styles.placeholder]}>
                    {item || placeholder}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default CustomPicker;
