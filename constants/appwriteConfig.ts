/* Below are the Appwrite configuration values used in the app. */

export const AppwriteConfig = {
  ENDPOINT: "https://cloud.appwrite.io/v1",
  PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  USERS_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  BUCKET_ID: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
  POSTS_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
  COMMUNITIES_COLLECTION_ID:
    process.env.EXPO_PUBLIC_APPWRITE_COMMUNITIES_COLLECTION_ID!,
  RECIPES_COLLECTION_ID:
    process.env.EXPO_PUBLIC_APPWRITE_RECIPES_COLLECTION_ID!,
  INTERACTIONS_COLLECTION_ID:
    process.env.EXPO_PUBLIC_APPWRITE_INTERACTIONS_COLLECTION_ID!,
  MEALPLAN_COLLECTION_ID:
    process.env.EXPO_PUBLIC_APPWRITE_MEALPLAN_COLLECTION_ID!,
  LISTS_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_LISTS_COLLECTION_ID!,
  COMMENTS_COLLECTION_ID:
    process.env.EXPO_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID!,
  NOTIFICATIONS_COLLECTION_ID:
    process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID!,
};
