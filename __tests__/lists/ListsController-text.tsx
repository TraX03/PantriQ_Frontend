import useListsController from "@/app/lists/controller";
import { renderHook } from "@testing-library/react-native";

jest.mock("@/services/Appwrite");
jest.mock("@/services/GeminiApi", () => ({
  predictExpiryDateTime: jest.fn().mockResolvedValue("2099-12-31T00:00:00Z"),
}));

describe("useListsController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("isExpiredDate should return true for past date", () => {
    const { result } = renderHook(() => useListsController());
    expect(result.current.actions.getExpiryStatus(["2000-01-01"])).toEqual({
      label: "Expired",
      color: expect.any(String),
    });
  });

  it("getExpiryStatus returns correct label and color", () => {
    const futureDate = new Date(Date.now() + 86400000 * 5).toISOString();
    const { result } = renderHook(() => useListsController());
    const status = result.current.actions.getExpiryStatus([futureDate]);
    expect(status?.label).toMatch(/4 day|5 day/);
  });

  it("getUpdatedQuantitiesAfterRemoval removes correct quantities", () => {
    const { result } = renderHook(() => useListsController());

    const updated = result.current.getUpdatedQuantitiesAfterRemoval(
      {
        id: "1",
        name: "Milk",
        type: "inventory",
        quantity: [3, 2],
        expiries: ["2099-12-01", "2099-12-02"],
      },
      [4],
      false
    );

    expect(updated.newQuantities).toEqual([1]);
  });
});
