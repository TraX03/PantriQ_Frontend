/* Below are the Appwrite configuration values used in the app. */

export const AppwriteConfig = {
  PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  USERS_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  BUCKET_ID: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
  POSTS_COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
};
