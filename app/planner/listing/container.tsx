import { useReduxSelectors } from "@/hooks/useReduxSelectors";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import ListingComponent from "./component";
import useListingController from "./controller";

export default function ListingContainer() {
  const { type, communityId, mealtime } = useLocalSearchParams();
  const { currentUserId, interactionVersion } = useReduxSelectors();
  const {
    listing,
    fetchCreatedRecipe,
    fetchInteractedRecipes,
    handleListingSearch,
    resetSearchResults,
  } = useListingController();

  useEffect(() => {
    async function fetchData() {
      if (!currentUserId) return;
      listing.setFieldState("showLoading", true);
      if (type === "created") {
        await fetchCreatedRecipe(currentUserId);
      } else if (type === "interactions") {
        await fetchInteractedRecipes(currentUserId);
      }
      listing.setFieldState("showLoading", false);
    }

    fetchData();
  }, [type]);

  return (
    <ListingComponent
      type={type as string}
      mealtime={mealtime as string}
      communityId={communityId as string}
      listing={listing}
      interactionVersion={interactionVersion}
      handleListingSearch={handleListingSearch}
      resetSearchResults={resetSearchResults}
    />
  );
}
