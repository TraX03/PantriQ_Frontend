import BottomSheetModal from "@/components/BottomSheetModal";
import ErrorScreen from "@/components/ErrorScreen";
import FullscreenImageViewer from "@/components/FullscreenImageViewer";
import IconButton from "@/components/IconButton";
import { PostType } from "@/components/PostCard";
import RecipeStep from "@/components/RecipeStep";
import ScreenWrapper from "@/components/ScreenWrapper";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useFieldState } from "@/hooks/useFieldState";
import { useInteraction } from "@/hooks/useInteraction";
import { styles } from "@/utility/content/posts/styles";
import { router } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PostState, RecipePost } from "./controller";
import ForumContainer from "./forum/container";
import RecipeContainer from "./recipe/container";
import RatingModalContainer from "./recipe/ratingModal/container";

type Props = {
  post: ReturnType<typeof useFieldState<PostState>>;
  deletePost: () => void;
  postType: PostType;
  handleAuthorPress: (postAuthorId: string) => void;
};

export default function PostComponent({
  post,
  deletePost,
  postType,
  handleAuthorPress,
}: Props) {
  const {
    postData,
    showStepsModal,
    showRatingModal,
    fullscreenImage,
    imageIndex,
    showModal,
    metadata,
    setFieldState,
    keyboardVisible,
    interactionState,
  } = post;

  if (!postData) return <ErrorScreen message="Post not found or invalid." />;

  const { isLiked, isBookmarked, toggleLike, toggleBookmark } = useInteraction(
    postData.id,
    interactionState
  );

  const { width } = Dimensions.get("window");
  const isDark = metadata.images?.[imageIndex]?.isDark ?? false;
  const recipeData = postType === "recipe" ? (postData as RecipePost) : null;

  const handleImageScroll = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setFieldState("imageIndex", newIndex);
  };

  const renderImages = () => (
    <View className="relative">
      <FlatList
        data={postData.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => `${i}`}
        onMomentumScrollEnd={handleImageScroll}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height: 320 }}
            resizeMode="cover"
          />
        )}
      />
      {postData.images.length > 1 && (
        <View style={styles.indicatorContainer}>
          {postData.images.map((_, idx) => (
            <View
              key={idx}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: isDark
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
          isBackgroundDark={isDark}
        />
        <View className="flex-row gap-4">
          <IconButton
            name="arrow.up.left.and.arrow.down.right"
            onPress={() =>
              setFieldState("fullscreenImage", postData.images[imageIndex])
            }
            isBackgroundDark={isDark}
          />
          <IconButton
            name="ellipsis"
            onPress={() => setFieldState("showModal", !showModal)}
            isBackgroundDark={isDark}
          />
        </View>
      </View>
    </View>
  );

  const renderAuthor = () => (
    <Text style={styles.authorText}>
      by{" "}
      <Text
        style={styles.authorName}
        onPress={() => handleAuthorPress(postData.authorId)}
      >
        {postData.author}
      </Text>
    </Text>
  );

  const renderStats = () => (
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
        {recipeData
          ? `${recipeData.rating?.toFixed(1)} Rating | ${
              recipeData.commentCount
            } Comment`
          : `${postData.commentCount} Comment`}
      </Text>
    </View>
  );

  const renderSpecificContent = () => {
    if (recipeData) return <RecipeContainer post={post} />;
    if (postType === "tips" || postType === "discussion")
      return <ForumContainer post={post} />;
    return null;
  };

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
          { key: "delete", label: "Delete Post", onPress: deletePost },
          {
            key: "cancel",
            label: "Cancel",
            onPress: () => setFieldState("showModal", false),
          },
        ]}
      />

      {postType === "recipe" && (
        <>
          <BottomSheetModal
            isVisible={showStepsModal}
            onClose={() => setFieldState("showStepsModal", false)}
            modalStyle={styles.instructionModal}
            zIndex={10}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalHeader}>All Steps</Text>
              {recipeData?.instructions?.filter(Boolean).map((step, index) => (
                <RecipeStep key={index} index={index} step={step} />
              ))}
            </ScrollView>
          </BottomSheetModal>

          <BottomSheetModal
            isVisible={showRatingModal}
            onClose={() => setFieldState("showRatingModal", false)}
            modalStyle={[
              styles.instructionModal,
              keyboardVisible ? { flex: 1 } : { height: "80%" },
            ]}
            zIndex={10}
          >
            <RatingModalContainer postData={postData} post={post} />
          </BottomSheetModal>
        </>
      )}

      <GestureHandlerRootView>
        <ScreenWrapper>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={[
              styles.container,
              { backgroundColor: Colors.surface.background },
            ]}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {renderImages()}

            <View style={styles.contentContainer}>
              {postType !== "recipe" && (
                <Text style={styles.recipeTitle}>{postData.title}</Text>
              )}

              <View
                className={`flex-row justify-between ${
                  postType === "recipe" ? "items-end" : "items-center"
                }`}
              >
                <View className="flex-1 pr-3">
                  {postType === "recipe" && (
                    <Text style={styles.recipeTitle}>{postData.title}</Text>
                  )}
                  {renderAuthor()}
                </View>
                {renderStats()}
              </View>
            </View>

            {renderSpecificContent()}
          </ScrollView>
        </ScreenWrapper>
      </GestureHandlerRootView>
    </>
  );
}
