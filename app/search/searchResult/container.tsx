import { Post } from "@/components/PostCard";
import { useReduxSelectors } from "@/hooks/useReduxSelectors";
import { User } from "@/utility/fetchUtils";
import { isEqual } from "lodash";
import { useEffect } from "react";
import SearchResultComponent from "./component";
import useSearchResultController from "./controller";

interface Props {
  allFilteredPosts: Post[];
  filteredUsers: User[];
  postLoading: boolean;
}

export default function SearchResultContainer({
  allFilteredPosts,
  filteredUsers,
  postLoading,
}: Props) {
  const { searchResult, getFilteredPostsByTab } =
    useSearchResultController(allFilteredPosts);
  const { interactionVersion } = useReduxSelectors();

  useEffect(() => {
    const filtered = getFilteredPostsByTab();
    if (!isEqual(filtered, allFilteredPosts)) {
      searchResult.setFieldState("filteredPosts", filtered);
    }
  }, [searchResult.activeTab, postLoading]);

  return (
    <SearchResultComponent
      searchResult={searchResult}
      filteredUsers={filteredUsers}
      interactionVersion={interactionVersion}
      postLoading={postLoading}
    />
  );
}
