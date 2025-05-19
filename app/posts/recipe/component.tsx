import BottomSheetModal from "@/components/BottomSheetModal";
import ErrorScreen from "@/components/ErrorScreen";
import FullscreenImageViewer from "@/components/FullscreenImageViewer";
import IconButton from "@/components/IconButton";
import RecipeStep from "@/components/RecipeStep";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { styles } from "@/utility/posts/styles";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RecipeState } from "./controller";

type Props = {
  recipe: ReturnType<typeof useFieldState<RecipeState>>;
  deleteRecipeById: (recipeId: string) => Promise<void>;
  toggleInteraction: (type: "like" | "bookmark") => Promise<void>;
};

export default function RecipeComponent({
  recipe,
  deleteRecipeById,
  toggleInteraction,
}: Props) {
  const {
    recipeData,
    setFieldState,
    showModal,
    fullscreenImage,
    imageIndex,
    metadata,
    showStepsModal,
    isInstructionsOverflow: instructionsOverflow,
  } = recipe;
  const { width } = Dimensions.get("window");

  if (!recipeData) {
    return <ErrorScreen message="Recipe not found or is invalid." />;
  }

  const isBackgroundDark = metadata.images?.[imageIndex]?.isDark ?? false;

  return (
    <>
      <FullscreenImageViewer
        imageUri={fullscreenImage}
        onClose={() => setFieldState("fullscreenImage", null)}
      />

      <BottomSheetModal
        isVisible={showModal}
        onClose={() => setFieldState("showModal", false)}
        modalStyle={styles.postSettings}
        zIndex={10}
        options={[
          {
            key: "delete",
            label: "Delete Post",
            onPress: () => {
              setFieldState("showModal", false);
              setTimeout(() => {
                Alert.alert(
                  "Delete Recipe",
                  "Are you sure you want to delete this recipe?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deleteRecipeById(recipeData.id),
                    },
                  ]
                );
              }, 300);
            },
          },
          {
            key: "logout",
            label: "Log Out",
            onPress: () => {
              setFieldState("showModal", false);
            },
          },
        ]}
      />

      <BottomSheetModal
        isVisible={showStepsModal}
        onClose={() => setFieldState("showStepsModal", false)}
        modalStyle={styles.instructionModal}
        zIndex={10}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalHeader}>All Steps</Text>
          {recipeData.instructions.filter(Boolean).map((step, index) => (
            <RecipeStep key={index} index={index} step={step} />
          ))}
        </ScrollView>
      </BottomSheetModal>

      <GestureHandlerRootView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="relative">
            <FlatList
              data={recipeData.images}
              keyExtractor={(item, index) => `${item}-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) =>
                setFieldState(
                  "imageIndex",
                  Math.round(e.nativeEvent.contentOffset.x / width)
                )
              }
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width, height: 320 }}
                  resizeMode="cover"
                />
              )}
            />
            {recipeData.images.length > 1 && (
              <View style={styles.indicatorContainer}>
                {recipeData.images.map((_, idx) => (
                  <View
                    key={`dot-${idx}`}
                    className="w-2.5 h-2.5 rounded-full"
                    style={[
                      {
                        backgroundColor: isBackgroundDark
                          ? recipe.imageIndex === idx
                            ? Colors.brand.accent
                            : Colors.ui.whiteOverlay
                          : recipe.imageIndex === idx
                          ? Colors.ui.inactive
                          : Colors.ui.overlayLight,
                      },
                    ]}
                  />
                ))}
              </View>
            )}

            <View style={styles.overlayContainer}>
              <IconButton
                name="chevron.left"
                onPress={router.back}
                isBackgroundDark={isBackgroundDark}
              />
              <View className="flex-row gap-4">
                <IconButton
                  name="arrow.up.left.and.arrow.down.right"
                  onPress={() =>
                    setFieldState(
                      "fullscreenImage",
                      recipeData.images[recipe.imageIndex]
                    )
                  }
                  isBackgroundDark={isBackgroundDark}
                />
                <IconButton
                  name="ellipsis"
                  onPress={() => setFieldState("showModal", !recipe.showModal)}
                  isBackgroundDark={isBackgroundDark}
                />
              </View>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View className="flex-row justify-between items-end">
              <View className="flex-1 pr-3">
                <Text style={styles.recipeTitle}>{recipeData.title}</Text>
                <Text style={styles.authorText}>
                  by <Text style={styles.authorName}>{recipeData.author}</Text>
                </Text>
              </View>
              <View className="items-end">
                <View className="flex-row gap-1.5">
                  <TouchableOpacity onPress={() => toggleInteraction("like")}>
                    <IconSymbol
                      name={recipe.isLiked ? "heart.fill" : "heart"}
                      color={Colors.brand.main}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleInteraction("bookmark")}
                  >
                    <IconSymbol
                      name={recipe.isBookmarked ? "bookmark.fill" : "bookmark"}
                      color={Colors.brand.main}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.statsText}>
                  {recipeData.rating.toFixed(1)} Rating |{" "}
                  {recipeData.commentCount} Comment
                </Text>
              </View>
            </View>

            <View className="mt-7">
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {recipeData.ingredients.map((item, index) => {
                const [name, quantity] = item.split("-").map((s) => s.trim());
                return (
                  <View key={index} className="flex-row justify-between mb-1.5">
                    <Text style={styles.ingredientName}>{name}</Text>
                    <Text style={styles.quantityName}>{quantity}</Text>
                  </View>
                );
              })}
            </View>

            <View className="mt-7">
              <Text style={styles.sectionTitle}>Instructions</Text>
              <View style={{ maxHeight: 350 }}>
                <ScrollView
                  scrollEnabled={false}
                  onContentSizeChange={(w, h) => {
                    setFieldState("isInstructionsOverflow", h > 350);
                  }}
                >
                  {recipeData.instructions
                    .filter(Boolean)
                    .map((step, index) => (
                      <RecipeStep key={index} index={index} step={step} />
                    ))}
                </ScrollView>
              </View>
              {instructionsOverflow && (
                <TouchableOpacity
                  onPress={() => setFieldState("showStepsModal", true)}
                  className="mt-4 self-center"
                >
                  <Text style={styles.buttonText}>See All Steps</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
}
