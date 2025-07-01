import { Post } from "@/components/PostCard";
import { useReduxSelectors } from "@/hooks/useReduxSelectors";
import { User } from "@/utility/fetchUtils";
import { isEqual } from "lodash";
import { useEffect } from "react";
import SearchResultComponent from "./component";
import useSearchResultController from "./controller";

interface Props {
  filteredPosts: Post[];
  filteredUsers: User[];
  postLoading: boolean;
}

export default function SearchResultContainer({
  filteredPosts,
  filteredUsers,
  postLoading,
}: Props) {
  const { searchResult, getFilteredPostsByTab } =
    useSearchResultController(filteredPosts);
  const { interactionVersion } = useReduxSelectors();

  useEffect(() => {
    const filtered = getFilteredPostsByTab();
    if (!isEqual(filtered, filteredPosts)) {
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
