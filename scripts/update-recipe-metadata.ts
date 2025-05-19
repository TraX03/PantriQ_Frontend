import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { fetchAllDocuments, updateDocument } from "@/services/appwrite";
import { detectBackgroundDarkness } from "@/utility/imageUtils";

export const updateRecipeMetadata = async () => {
  try {
    const recipes = await fetchAllDocuments(
      AppwriteConfig.RECIPES_COLLECTION_ID
    );

    for (const recipe of recipes) {
      const { $id, image: images = [] } = recipe;
      if (!Array.isArray(images) || images.length === 0) continue;

      const metadata = {
        images: await Promise.all(
          images.map(async (uri: string) => {
            try {
              return { isDark: await detectBackgroundDarkness(uri) };
            } catch {
              return { isDark: false };
            }
          })
        ),
      };

      await updateDocument(AppwriteConfig.RECIPES_COLLECTION_ID, $id, {
        metadata: JSON.stringify(metadata),
      });

      console.log(`Updated metadata for recipe ${$id}`);
    }

    console.log("Finished updating all recipes.");
  } catch (err) {
    console.error("Failed to update recipe metadata:", err);
  }
};
