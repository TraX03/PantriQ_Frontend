import { Colors } from "@/constants/Colors";
import { SuggestionType } from "@/hooks/useSuggestionList";
import { styles } from "@/utility/onboarding/styles";
import { styles as searchStyles } from "@/utility/search/styles";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import BottomSheetModal from "./BottomSheetModal";
import SearchWithSuggestion, { Mode } from "./SearchWithSuggestions";
import { IconSymbol } from "./ui/IconSymbol";

type OnboardingProps = {
  title: string;
  description: string;
  suggestions: string[];
  selectedItems: string[];
  onChange: (items: string[]) => void;
  mode: Mode;
  placeholder: string;
  suggestionType?: SuggestionType;
  customSuggestions: string[];
  onAddCustomSuggestion: (item: string) => void;
};

const OnboardingPage = ({
  title,
  description,
  suggestions,
  selectedItems,
  onChange,
  mode,
  placeholder,
  suggestionType,
  customSuggestions,
  onAddCustomSuggestion,
}: OnboardingProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const normalized = (text: string) => text.toLowerCase();
  const toggleItem = (item: string) => {
    const updatedItems = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];

    onChange(updatedItems);
  };

  const handleCustomSelect = (item: string) => {
    const normItem = normalized(item);
    const all = [...suggestions, ...customSuggestions].map(normalized);
    const selected = selectedItems.map(normalized);

    if (!all.includes(normItem)) {
      onAddCustomSuggestion(item);
    }

    if (!selected.includes(normItem)) {
      toggleItem(item);
    } else {
      Toast.show({
        type: "info",
        text1: `"${item}" is already selected`,
      });
    }

    setIsModalVisible(false);
  };

  const allSuggestions = Array.from(
    new Set([...suggestions, ...customSuggestions])
  );

  return (
    <>
      <BottomSheetModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        modalStyle={styles.optionModal}
        zIndex={10}
      >
        <SearchWithSuggestion
          onSelectItem={handleCustomSelect}
          mode={mode}
          placeholder={placeholder}
          suggestionType={suggestionType}
        />
      </BottomSheetModal>

      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View className="mt-7 flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex-row flex-wrap gap-2.5"
        >
          {allSuggestions.map((item) => {
            const isSelected = selectedItems.includes(item);

            return (
              <Pressable
                key={item}
                onPress={() => toggleItem(item)}
                style={[
                  searchStyles.itemContainer,
                  {
                    backgroundColor: isSelected
                      ? Colors.brand.primaryDark
                      : "transparent",
                    borderColor: isSelected
                      ? "transparent"
                      : Colors.text.primary,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: isSelected
                      ? Colors.brand.onPrimary
                      : Colors.brand.onBackground,
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            onPress={() => setIsModalVisible(true)}
            style={[searchStyles.itemContainer, { paddingHorizontal: 20 }]}
          >
            <IconSymbol name="plus" size={16} color={Colors.text.primary} />
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
};

export default OnboardingPage;
