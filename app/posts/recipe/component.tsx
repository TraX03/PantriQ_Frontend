import BottomSheetModal from "@/components/BottomSheetModal";
import ErrorScreen from "@/components/ErrorScreen";
import FullscreenImageViewer from "@/components/FullscreenImageViewer";
import IconButton from "@/components/IconButton";
import { RecipeStep } from "@/components/RecipeStep";
import ScoreCircle from "@/components/ScoreCircle";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { Routes } from "@/constants/Routes";
import { useFieldState } from "@/hooks/useFieldState";
import { useInteraction } from "@/hooks/useInteraction";
import { styles } from "@/utility/posts/styles";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RecipeState } from "./controller";

type Props = {
  recipe: ReturnType<typeof useFieldState<RecipeState>>;
  handleDelete: () => void;
  getNutritionEntry: (
    data: any,
    key: "nutrients" | "properties",
    name: string
  ) => {
    amount: number;
    unit: string;
  };
  currentUserId: string | undefined;
};

export default function RecipeComponent({
  recipe,
  handleDelete,
  getNutritionEntry,
  currentUserId,
}: Props) {
  const {
    recipeData,
    setFieldState,
    showModal,
    fullscreenImage,
    imageIndex,
    metadata,
    showStepsModal,
    isInstructionsOverflow,
    nutritionData,
    expanded,
    interactionState,
  } = recipe;

  const { width } = Dimensions.get("window");

  if (!recipeData)
    return <ErrorScreen message="Recipe not found or is invalid." />;

  const { isLiked, isBookmarked, toggleLike, toggleBookmark } = useInteraction(
    recipeData.id,
    interactionState
  );

  const isBackgroundDark = metadata.images?.[imageIndex]?.isDark ?? false;

  const nutrients = {
    calories: getNutritionEntry(nutritionData, "nutrients", "Calories"),
    fat: getNutritionEntry(nutritionData, "nutrients", "Fat"),
    carbs: getNutritionEntry(nutritionData, "nutrients", "Carbohydrates"),
  };

  const calories = Math.round(nutrients.calories.amount);
  const fat = Math.round(nutrients.fat.amount);
  const carbs = Math.round(nutrients.carbs.amount);

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
          { key: "delete", label: "Delete Post", onPress: handleDelete },
          {
            key: "logout",
            label: "Log Out",
            onPress: () => setFieldState("showModal", false),
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
        <ScreenWrapper>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View className="relative">
              <FlatList
                data={recipeData.images}
                keyExtractor={(_, index) => `${index}`}
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
                      key={idx}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: isBackgroundDark
                          ? imageIndex === idx
                            ? Colors.brand.onPrimary
                            : Colors.overlay.white
                          : imageIndex === idx
                          ? Colors.surface.disabled
                          : Colors.overlay.light,
                      }}
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
                        recipeData.images[imageIndex]
                      )
                    }
                    isBackgroundDark={isBackgroundDark}
                  />
                  <IconButton
                    name="ellipsis"
                    onPress={() => setFieldState("showModal", !showModal)}
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
                    by{" "}
                    <Text
                      style={styles.authorName}
                      onPress={() => {
                        if (recipeData.authorId === currentUserId) {
                          router.push(Routes.ProfileTab);
                        } else {
                          router.push({
                            pathname: Routes.userDetail,
                            params: { id: recipeData.authorId },
                          });
                        }
                      }}
                    >
                      {recipeData.author}
                    </Text>
                  </Text>
                </View>

                <View className="items-end">
                  <View className="flex-row gap-1.5">
                    <Pressable onPress={toggleLike}>
                      <IconSymbol
                        name={isLiked ? "heart.fill" : "heart"}
                        color={Colors.brand.primary}
                      />
                    </Pressable>

                    <Pressable onPress={toggleBookmark}>
                      <IconSymbol
                        name={isBookmarked ? "bookmark.fill" : "bookmark"}
                        color={Colors.brand.primary}
                      />
                    </Pressable>
                  </View>

                  <Text style={styles.statsText}>
                    {recipeData.rating.toFixed(1)} Rating |{" "}
                    {recipeData.commentCount} Comment
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.nutrientContainer}
              onPress={() =>
                router.push({
                  pathname: Routes.Nutrition,
                  params: { recipeId: recipeData.id },
                })
              }
            >
              <View className="flex-1 flex-row items-center px-7">
                <ScoreCircle score={nutritionData?.healthScore ?? 0} />

                <View className="ml-8 gap-3">
                  <View className="items-center mx-2">
                    <Text className="text-[15px]">
                      {calories} {nutrients.calories.unit}
                    </Text>
                    <Text style={styles.nutrientLabel}>Calories</Text>
                  </View>

                  <View className="flex-row gap-4">
                    {[
                      {
                        label: "Carbs",
                        value: `${carbs} ${nutrients.carbs.unit}`,
                      },
                      { label: "Fat", value: `${fat} ${nutrients.fat.unit}` },
                    ].map(({ label, value }) => (
                      <View key={label} className="items-center mx-2">
                        <Text className="text-[15px]">{value}</Text>
                        <Text style={styles.nutrientLabel}>{label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <IconSymbol
                name="chevron.right"
                color={Colors.overlay.base}
                size={25}
              />
            </TouchableOpacity>

            <View style={styles.contentContainer}>
              <Text style={styles.sectionTitle}>Ingredients</Text>

              <View
                style={
                  !expanded ? { maxHeight: 150, overflow: "hidden" } : undefined
                }
              >
                {recipeData.ingredients.map((item, index) => {
                  const { name, quantity } = item;
                  return (
                    <View
                      key={index}
                      className="flex-row justify-between mb-1.5"
                    >
                      <Text style={styles.ingredientName}>{name}</Text>
                      <Text style={styles.quantityName}>{quantity}</Text>
                    </View>
                  );
                })}
              </View>

              {recipeData.ingredients.length > 5 && (
                <TouchableOpacity
                  onPress={() => setFieldState("expanded", !expanded)}
                  className="mt-3 self-end"
                >
                  <Text style={styles.buttonText}>
                    {expanded ? "View Less" : "View More"}
                  </Text>
                </TouchableOpacity>
              )}

              <View className="mt-7">
                <Text style={styles.sectionTitle}>Instructions</Text>
                <View style={{ maxHeight: 270 }}>
                  <ScrollView
                    scrollEnabled={false}
                    onContentSizeChange={(_, h) =>
                      setFieldState("isInstructionsOverflow", h > 270)
                    }
                  >
                    {recipeData.instructions
                      .filter(Boolean)
                      .map((step, index) => (
                        <RecipeStep key={index} index={index} step={step} />
                      ))}
                  </ScrollView>
                </View>
                {isInstructionsOverflow && (
                  <TouchableOpacity
                    onPress={() => setFieldState("showStepsModal", true)}
                    className="mt-4 self-end"
                  >
                    <Text style={styles.buttonText}>View All Steps</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </ScreenWrapper>
      </GestureHandlerRootView>
    </>
  );
}
