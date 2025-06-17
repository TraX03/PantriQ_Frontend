import { subTabs } from "@/app/profile/component";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { useFieldState } from "@/hooks/useFieldState";
import { getDocumentById } from "@/services/appwrite";
import { getImageUrl } from "@/utility/imageUtils";
import { parseMetadata } from "@/utility/metadataUtils";

interface Community {
  name: string;
  description: string;
  creatorId: string;
  membersCount: number;
  image: string;
  recipesCount: number;
}

export interface CommunityState {
  communityData: Community | null;
  metadata: any;
  activeTab: (typeof subTabs)[number];
}

export const useCommunityController = () => {
  const community = useFieldState<CommunityState>({
    communityData: null,
    metadata: null,
    activeTab: "Recipe",
  });

  const getCommunity = async (communityId: string) => {
    if (!communityId) return;

    try {
      const doc = await getDocumentById(
        AppwriteConfig.COMMUNITIES_COLLECTION_ID,
        communityId
      );

      community.setFields({
        communityData: {
          name: doc.name,
          description: doc.description,
          creatorId: doc.creator_id,
          membersCount: doc.members_count ?? 0,
          image: getImageUrl(doc.image),
          recipesCount: doc.recipes_count ?? 0,
        },
        metadata: parseMetadata(doc.metadata),
      });
    } catch (error) {
      console.error("Failed to fetch community:", error);
    }
  };

  return { community, getCommunity };
};

export default useCommunityController;
