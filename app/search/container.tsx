import { useEffect } from "react";
import SearchComponent from "./component";
import useSearchController from "./controller";

export default function SearchContainer() {
  const { search, handleSearch, handleClear, init } = useSearchController();

  useEffect(() => {
    init();
  }, []);

  return (
    <SearchComponent
      search={search}
      handleSearch={handleSearch}
      handleClear={handleClear}
    />
  );
}
