import PlannerComponent from "@/app/planner/component";
import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import React, { act } from "react";
import { Alert } from "react-native";

jest.mock("expo-router");

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("PlannerComponent", () => {
  const mockPlanner: any = {
    selectedDate: new Date("2025-07-16T00:00:00Z"),
    showDatePicker: false,
    setFieldState: jest.fn(),
    setFields: jest.fn(),
    showMealtimeModal: false,
    planLoading: false,
    generateLoading: false,
    showSettingModal: false,
    selectedMealtime: null,
    showRegenerateButton: false,
    showDeleteButton: false,
  };

  const mockActions = {
    generateMeals: jest.fn(() => Promise.resolve()),
    handleChangeWeek: jest.fn(),
    getCachedMealsForDate: jest.fn(() => [
      {
        mealtime: "breakfast",
        recipes: [
          {
            id: "recipe-1",
            image: "image-1.jpg",
            name: "Pancakes",
          },
        ],
      },
    ]),
    addMealtime: jest.fn(),
    deleteFromMealplan: jest.fn(() => Promise.resolve()),
  };

  const dateInfo = {
    minDate: new Date("2025-06-16T00:00:00Z"),
    weekStart: new Date("2025-07-14T00:00:00Z"),
  };

  it("renders correctly with initial props", () => {
    const { getByText } = render(
      <PlannerComponent
        planner={mockPlanner}
        date={dateInfo}
        actions={mockActions}
      />
    );

    expect(getByText("Meal Planner")).toBeTruthy();
    expect(getByText("This Week")).toBeTruthy();
  });

  it("calls setFieldState to open date picker when week text is pressed", () => {
    const { getByText } = render(
      <PlannerComponent
        planner={mockPlanner}
        date={dateInfo}
        actions={mockActions}
      />
    );

    fireEvent.press(getByText("This Week"));
    expect(mockPlanner.setFieldState).toHaveBeenCalledWith(
      "showDatePicker",
      true
    );
  });

  it("adds a mealtime when selecting from BottomSheetModal", () => {
    jest.useFakeTimers();

    const plannerWithModal = { ...mockPlanner, showMealtimeModal: true };
    const { getByTestId } = render(
      <PlannerComponent
        planner={plannerWithModal}
        date={dateInfo}
        actions={mockActions}
      />
    );

    fireEvent.press(getByTestId("mealtime-option-breakfast"));

    act(() => {
      jest.runAllTimers();
    });

    expect(mockActions.addMealtime).toHaveBeenCalledWith("breakfast");

    jest.useRealTimers();
  });

  it("calls generateMeals with correct mealtimes on Generate button press", () => {
    const { getByText } = render(
      <PlannerComponent
        planner={mockPlanner}
        date={dateInfo}
        actions={mockActions}
      />
    );

    fireEvent.press(getByText("Generate"));
    expect(mockActions.generateMeals).toHaveBeenCalledWith(["breakfast"]);
  });

  it("shows alert if no mealtimes exist when Generate is pressed", () => {
    const plannerNoMeals = { ...mockPlanner };
    const actionsNoMeals = {
      ...mockActions,
      getCachedMealsForDate: jest.fn(() => []),
    };

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    const { getByText } = render(
      <PlannerComponent
        planner={plannerNoMeals}
        date={dateInfo}
        actions={actionsNoMeals}
      />
    );

    fireEvent.press(getByText("Generate"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "No Mealtime Added",
      "Please add at least one mealtime before generating meals."
    );

    alertSpy.mockRestore();
  });

  it("navigates to MealConfiguration when ellipsis icon is pressed", () => {
    const { getByTestId } = render(
      <PlannerComponent
        planner={mockPlanner}
        date={dateInfo}
        actions={mockActions}
      />
    );

    fireEvent.press(getByTestId("meal-config-button"));

    expect(router.push).toHaveBeenCalledWith("/planner/mealConfig/container");
  });
});
