import InputBox from "@/components/InputBox";
import { styles } from "@/utility/lists/styles";
import { styles as onboardingStyles } from "@/utility/onboarding/styles";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Props } from "./container";

export default function AmountModalComponent({
  lists,
  handleInventoryCheck,
}: Props) {
  const { setFieldState, setFields, amountText, amount, modalItem } = lists;

  if (!modalItem) return null;

  const closeModal = () => {
    setFieldState("showAmountModal", false);
    setFieldState("amount", 0);
    setFieldState("amountText", "");
  };

  return (
    <TouchableOpacity onPressOut={closeModal} style={styles.overlay}>
      <View style={styles.amountContainer}>
        <Text style={styles.label}>Enter Amount</Text>
        <Text className="mb-2 mt-2">
          {`Available: ${modalItem.quantityDisplay} ${modalItem.unit ?? ""}`}
        </Text>

        <InputBox
          keyboardType="decimal-pad"
          value={amountText ?? ""}
          onChangeText={(text) => {
            const parsed = parseFloat(text.replace(",", "."));
            setFields({
              amountText: text,
              amount: isNaN(parsed) ? undefined : parsed,
            });
          }}
          placeholder={"Amount"}
          containerStyle={[styles.inputContainer, { flex: 0 }]}
        />

        <View className="flex-row justify-between mt-4">
          <Pressable style={[styles.button]} onPress={closeModal}>
            <Text style={onboardingStyles.buttonText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.button]}
            onPress={() => {
              if (!amount) {
                alert("Please enter a valid number.");
                return;
              }
              const isRevert = (modalItem.checkedCount ?? 0) > 0;
              const finalUsed = isRevert ? -amount : amount;

              handleInventoryCheck(modalItem.id!, finalUsed);
              closeModal();
            }}
          >
            <Text style={onboardingStyles.buttonText}>Confirm</Text>
          </Pressable>
        </View>
      </View>
    </TouchableOpacity>
  );
}
