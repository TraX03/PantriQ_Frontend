import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { RecipeState } from "./controller";
import { useFieldState } from "@/hooks/useFieldState";
import ErrorScreen from "@/components/ErrorScreen";
import { router } from "expo-router";
import { getOverlayStyle } from "@/utility/imageColorUtils";
import BottomSheetModal from "@/components/BottomSheetModal";
import FullscreenImageViewer from "@/components/FullscreenImageViewer";

type Props = {
  recipe: ReturnType<typeof useFieldState<RecipeState>>;
  deleteRecipeById: (recipeId: string) => Promise<void>;
};

export default function RecipeComponent({ recipe, deleteRecipeById }: Props) {
  const {
    recipeData,
    setFieldState,
    isBackgroundDark,
    showModal,
    fullscreenImage,
  } = recipe;
  const { width } = Dimensions.get("window");

  if (!recipeData) {
    return <ErrorScreen message="Recipe not found or is invalid." />;
  }

  return (
    <>
      <FullscreenImageViewer
        imageUri={fullscreenImage}
        onClose={() => setFieldState("fullscreenImage", null)}
      />
      <BottomSheetModal
        isVisible={showModal}
        onClose={() => setFieldState("showModal", false)}
        modalStyle={{
          marginBottom: -5,
          width: "100%",
          borderRadius: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingVertical: 20,
          elevation: 8,
        }}
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

      <GestureHandlerRootView>
        <ScrollView style={{ flex: 1, backgroundColor: Colors.brand.accent }}>
          <View style={{ position: "relative" }}>
            <FlatList
              data={recipeData.images}
              keyExtractor={(item, index) => `${item}-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setFieldState("imageIndex", index);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width, height: 320 }}
                  resizeMode="cover"
                />
              )}
            />

            <View
              style={{
                position: "absolute",
                bottom: 25,
                left: 0,
                right: 0,
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {recipeData.images.map((_, idx) => (
                <View
                  key={`dot-${idx}`}
                  style={[
                    {
                      width: 8,
                      height: 8,
                      borderRadius: 4,
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

            <View
              style={{
                position: "absolute",
                top: 70,
                left: 0,
                right: 0,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                className="rounded-full p-1.5 justify-center items-center"
                style={[
                  getOverlayStyle(isBackgroundDark),
                  { borderWidth: 1.5 },
                ]}
              >
                <IconSymbol
                  name="chevron.left"
                  size={24}
                  color={
                    isBackgroundDark
                      ? Colors.ui.buttonFill
                      : Colors.ui.backgroundLight
                  }
                />
              </TouchableOpacity>

              <View style={{ flexDirection: "row", gap: 16 }}>
                <TouchableOpacity
                  className="rounded-full p-1.5 justify-center items-center"
                  style={[
                    getOverlayStyle(isBackgroundDark),
                    { borderWidth: 1.5 },
                  ]}
                  onPress={() =>
                    setFieldState(
                      "fullscreenImage",
                      recipeData.images[recipe.imageIndex]
                    )
                  }
                >
                  <IconSymbol
                    name="arrow.up.left.and.arrow.down.right"
                    size={24}
                    color={
                      isBackgroundDark
                        ? Colors.ui.buttonFill
                        : Colors.ui.backgroundLight
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFieldState("showModal", !recipe.showModal)}
                  className="rounded-full p-1.5 justify-center items-center"
                  style={[
                    getOverlayStyle(isBackgroundDark),
                    { borderWidth: 1.5 },
                  ]}
                >
                  <IconSymbol
                    name="ellipsis.circle"
                    size={24}
                    color={
                      isBackgroundDark
                        ? Colors.ui.buttonFill
                        : Colors.ui.backgroundLight
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Info Container */}
          <View style={{ backgroundColor: "white", padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {recipeData.title}
                </Text>
                <Text style={{ color: "gray", marginTop: 4 }}>
                  by {recipeData.author}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity>
                    <IconSymbol name="heart" color={Colors.brand.main} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <IconSymbol name="bookmark" color={Colors.brand.main} />
                  </TouchableOpacity>
                </View>
                <Text style={{ color: "gray", fontSize: 12, marginTop: 4 }}>
                  ⭐ {recipeData.rating.toFixed(1)} | 💬{" "}
                  {recipeData.commentCount}
                </Text>
              </View>
            </View>

            {/* Ingredients */}
            <View style={{ marginTop: 24 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}
              >
                Ingredients
              </Text>
              {recipeData.ingredients.map((item, index) => (
                <Text key={index} style={{ marginBottom: 4, color: "#333" }}>
                  • {item}
                </Text>
              ))}
            </View>

            {/* Instructions */}
            <View style={{ marginTop: 24 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}
              >
                Instructions
              </Text>
              <Text style={{ color: "#333", lineHeight: 22 }}>
                {recipeData.instructions}
              </Text>
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
}
