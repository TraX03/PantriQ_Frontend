import useHomeController from "@/app/home/controller";
import * as Appwrite from "@/services/Appwrite";
import * as FastApi from "@/services/FastApi";
import * as fetchUtils from "@/utility/fetchUtils";
import { act, renderHook } from "@testing-library/react-native";
import { mockedGetCurrentUser, mockUser, testPost } from "../fixtures";

jest.mock("@/services/Appwrite");
jest.mock("@/services/FastApi");
jest.mock("@/utility/fetchUtils");
jest.mock("@/hooks/useFieldState", () => ({
  useFieldState: jest.fn(),
}));

const mockSetFieldState = jest.fn();
const mockSetFields = jest.fn();
const mockGetFieldState = jest.fn();

const mockedFetchHomeFeedPosts =
  fetchUtils.fetchHomeFeedPosts as jest.MockedFunction<
    typeof fetchUtils.fetchHomeFeedPosts
  >;
const mockedFetchPosts = fetchUtils.fetchPosts as jest.MockedFunction<
  typeof fetchUtils.fetchPosts
>;

describe("useHomeController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require("@/hooks/useFieldState").useFieldState.mockReturnValue({
      activeTab: "Explore",
      activeSuggestion: "Recipe",
      posts: [],
      refreshing: false,
      hasLoadedOnce: false,
      setFieldState: mockSetFieldState,
      setFields: mockSetFields,
      getFieldState: mockGetFieldState,
    });
  });

  it("should set refreshing true on onRefresh call and fetch posts for logged in user", async () => {
    mockedGetCurrentUser.mockResolvedValue(mockUser);
    mockedFetchHomeFeedPosts.mockResolvedValue([testPost]);
    mockGetFieldState.mockReturnValue(true);

    const { result } = renderHook(() => useHomeController());

    await act(() => result.current.onRefresh());

    expect(mockSetFieldState).toHaveBeenCalledWith("refreshing", true);
    expect(Appwrite.getCurrentUser).toHaveBeenCalled();
    expect(FastApi.logHomeFeedSessionFeedback).toHaveBeenCalledWith("user1");
    expect(fetchUtils.fetchHomeFeedPosts).toHaveBeenCalledWith("user1");
    expect(mockSetFields).toHaveBeenCalledWith({
      posts: [testPost],
      refreshing: false,
      hasLoadedOnce: true,
    });
  });

  it("should fetch posts without user if no user found", async () => {
    mockedGetCurrentUser.mockRejectedValue(new Error("No user"));
    mockedFetchPosts.mockResolvedValue([testPost]);
    mockGetFieldState.mockReturnValue(false);

    const { result } = renderHook(() => useHomeController());

    await act(() => result.current.onRefresh());

    expect(mockSetFieldState).toHaveBeenCalledWith("refreshing", true);
    expect(fetchUtils.fetchPosts).toHaveBeenCalled();
    expect(mockSetFields).toHaveBeenCalledWith({
      posts: [testPost],
      refreshing: false,
      hasLoadedOnce: true,
    });
  });

  it("should filter posts by activeSuggestion", () => {
    const posts = [
      { id: "1", type: "recipe" },
      { id: "2", type: "tips" },
      { id: "3", type: "community" },
      { id: "4", type: "discussion" },
    ];

    require("@/hooks/useFieldState").useFieldState.mockReturnValueOnce({
      activeTab: "Explore",
      activeSuggestion: "Tips & Advice",
      posts,
      refreshing: false,
      hasLoadedOnce: false,
      setFieldState: mockSetFieldState,
      setFields: mockSetFields,
      getFieldState: mockGetFieldState,
    });

    const { result } = renderHook(() => useHomeController());

    expect(result.current.filteredPosts).toEqual([{ id: "2", type: "tips" }]);
  });
});
