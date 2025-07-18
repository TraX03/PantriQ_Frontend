import usePlannerController from "@/app/planner/controller";
import { act, renderHook } from "@testing-library/react-native";
import { addDays } from "date-fns";

jest.mock("@/services/Appwrite", () => ({
  getCurrentUser: jest.fn(() => Promise.resolve({ $id: "user-id" })),
  listDocuments: jest.fn(() => []),
  updateDocument: jest.fn(() => Promise.resolve()),
  createDocument: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/services/FastApi", () => ({
  fetchGeneratedMealPlan: jest.fn(() =>
    Promise.resolve({
      meals: [
        {
          mealtime: "breakfast",
          recipes: [{ id: "123", title: "Pancakes", image: "image-url" }],
          session: JSON.stringify([{ id: "123", mealtime: "breakfast" }]),
        },
      ],
    })
  ),
  logMealplanInventoryFeedback: jest.fn(() => Promise.resolve()),
}));

describe("usePlannerController", () => {
  it("adds a new mealtime to empty date", () => {
    const { result } = renderHook(() => usePlannerController());
    const planner = result.current.planner;
    act(() => {
      result.current.actions.addMealtime("breakfast");
    });
    const meals = result.current.actions.getCachedMealsForDate(
      planner.getFieldState("selectedDate")
    );
    expect(meals).toHaveLength(1);
    expect(meals[0].mealtime).toBe("breakfast");
  });

  it("does not add duplicate mealtime", () => {
    const { result } = renderHook(() => usePlannerController());
    const planner = result.current.planner;
    act(() => {
      result.current.actions.addMealtime("breakfast");
      result.current.actions.addMealtime("breakfast");
    });
    const meals = result.current.actions.getCachedMealsForDate(
      planner.getFieldState("selectedDate")
    );
    expect(meals).toHaveLength(1);
  });

  it("shifts week correctly on next/prev", () => {
    const { result } = renderHook(() => usePlannerController());
    const planner = result.current.planner;
    const currentDate = planner.getFieldState("selectedDate");
    act(() => {
      result.current.actions.handleChangeWeek("next");
    });
    const newDate = planner.getFieldState("selectedDate");
    expect(newDate.getTime()).toBe(addDays(currentDate, 7).getTime());
  });

  it("generates meals and updates mealsByDate", async () => {
    const { result } = renderHook(() => usePlannerController());
    const planner = result.current.planner;
    await act(async () => {
      await result.current.actions.generateMeals(["breakfast"]);
    });
    const meals = result.current.actions.getCachedMealsForDate(
      planner.getFieldState("selectedDate")
    );
    expect(meals).toHaveLength(1);
    expect(meals[0].recipes[0].name).toBe("Pancakes");
  });
});
