import { Post } from "@/components/PostCard";
import { User } from "@/utility/fetchUtils";
import SearchResultComponent from "./component";
import useSearchResultController from "./controller";

interface Props {
  filteredPosts: Post[];
  filteredUsers: User[];
}

export default function SearchResultContainer({
  filteredPosts,
  filteredUsers,
}: Props) {
  const { searchResult } = useSearchResultController(filteredPosts);

  return (
    <SearchResultComponent
      searchResult={searchResult}
      filteredUsers={filteredUsers}
    />
  );
}
