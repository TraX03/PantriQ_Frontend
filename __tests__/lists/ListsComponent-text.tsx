import ListsComponent from "@/app/lists/component";
import { Colors } from "@/constants/Colors";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/services/GeminiApi", () => ({
  generatePrediction: jest.fn(() => Promise.resolve("mocked prediction")),
}));

const mockSetFieldState = jest.fn();
const mockSetFields = jest.fn();
const mockHandleShoppingCheck = jest.fn();
const mockHandleMoveToInventory = jest.fn();
const mockHandleClearItems = jest.fn();
const mockHandleInventoryCheck = jest.fn();
const mockAddItemToList = jest.fn();
const mockGetExpiryStatus = jest.fn(() => ({
  label: "Expired",
  color: Colors.feedback.error,
}));

const defaultLists = {
  activeTab: "shopping",
  showAddModal: false,
  showInventoryModal: false,
  showAmountModal: false,
  keyboardVisible: false,
  currentStepIndex: 0,
  setFieldState: mockSetFieldState,
  setFields: mockSetFields,
};

const defaultListData = {
  checkedItems: [],
  uncheckedItems: [],
  expiredItems: [],
};

const defaultActions = {
  handleShoppingCheck: mockHandleShoppingCheck,
  handleMoveToInventory: mockHandleMoveToInventory,
  handleClearItems: mockHandleClearItems,
  handleInventoryCheck: mockHandleInventoryCheck,
  addItemToList: mockAddItemToList,
  getExpiryStatus: mockGetExpiryStatus,
};

const renderComponent = (overrideProps = {}) =>
  render(
    <ListsComponent
      lists={{ ...defaultLists, ...(overrideProps as any).lists }}
      listData={{ ...defaultListData, ...(overrideProps as any).listData }}
      actions={{ ...defaultActions, ...(overrideProps as any).actions }}
    />
  );

describe("ListsComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders shopping and inventory tabs and switches tab", () => {
    const { getByText } = renderComponent();
    fireEvent.press(getByText("Inventory"));
    expect(mockSetFieldState).toHaveBeenCalledWith("activeTab", "inventory");
  });

  it("shows Add Items button when no uncheckedItems", () => {
    const { getByText } = renderComponent();
    expect(getByText("+ Add Items")).toBeTruthy();
  });

  it("calls setFieldState when Add Items button pressed", () => {
    const { getByText } = renderComponent();
    fireEvent.press(getByText("+ Add Items"));
    expect(mockSetFieldState).toHaveBeenCalledWith("showAddModal", true);
  });

  it("calls handleShoppingCheck when item checkbox is pressed", () => {
    const mockHandleShoppingCheck = jest.fn();

    const mockLists = {
      activeTab: "shopping",
      showAddModal: false,
      showInventoryModal: false,
      showAmountModal: false,
      keyboardVisible: false,
      currentStepIndex: 0,
      setFieldState: jest.fn(),
      setFields: jest.fn(),
    };

    const mockItem = {
      id: "1",
      name: "Tomato",
      type: "shopping" as const,
      checked: false,
      checkedCount: 1,
      quantityDisplay: 1,
      quantity: [1],
      unit: "pcs",
    };

    const { getByTestId } = render(
      <ListsComponent
        lists={mockLists as any}
        actions={{
          addItemToList: jest.fn(),
          handleShoppingCheck: mockHandleShoppingCheck,
          handleMoveToInventory: jest.fn(),
          handleClearItems: jest.fn(),
          handleInventoryCheck: jest.fn(),
          getExpiryStatus: () => ({
            label: "Expired",
            color: "red",
          }),
        }}
        listData={{
          uncheckedItems: [mockItem],
          checkedItems: [],
          expiredItems: [],
        }}
      />
    );

    fireEvent.press(getByTestId("checkbox-1"));

    expect(mockHandleShoppingCheck).toHaveBeenCalledWith("1", true);
  });

  it("renders Expired and Checked Items sections", () => {
    const { getByText } = renderComponent({
      listData: {
        expiredItems: [
          {
            id: "e1",
            name: "Old Milk",
            type: "inventory",
            quantity: [1],
            checked: true,
            checkedCount: 1,
            unit: "ml",
            quantityDisplay: 1,
            expiries: ["2000-01-01"],
          },
        ],
        checkedItems: [
          {
            id: "c1",
            name: "Egg",
            type: "shopping",
            quantity: [1],
            checked: true,
            checkedCount: 1,
            unit: "pcs",
            quantityDisplay: 1,
          },
        ],
        uncheckedItems: [],
      },
    });

    expect(getByText("Expired Items")).toBeTruthy();
    expect(getByText("Checked Items")).toBeTruthy();
  });

  it("calls handleClearItems on clear expired", () => {
    const { getByText } = renderComponent({
      listData: {
        expiredItems: [
          {
            id: "e1",
            name: "Milk",
            type: "inventory",
            quantity: [1],
            checked: true,
            checkedCount: 1,
            unit: "ml",
            quantityDisplay: 1,
            expiries: ["2000-01-01"],
          },
        ],
      },
    });
    fireEvent.press(getByText("Clear"));
    expect(mockHandleClearItems).toHaveBeenCalled();
  });

  it("shows Add to Inventory button when shopping checkedItems exist", () => {
    const { getByText } = renderComponent({
      listData: {
        checkedItems: [
          {
            id: "x1",
            name: "Bread",
            type: "shopping",
            quantity: [1],
            checked: true,
            checkedCount: 1,
            unit: "pcs",
            quantityDisplay: 1,
          },
        ],
      },
    });

    expect(getByText("Add to Inventory")).toBeTruthy();
  });

  it("opens inventory modal on Add to Inventory press", () => {
    const { getByText } = renderComponent({
      listData: {
        checkedItems: [
          {
            id: "x1",
            name: "Bread",
            type: "shopping",
            quantity: [1],
            checked: true,
            checkedCount: 1,
            unit: "pcs",
            quantityDisplay: 1,
          },
        ],
      },
    });

    fireEvent.press(getByText("Add to Inventory"));
    expect(mockSetFieldState).toHaveBeenCalledWith("showInventoryModal", true);
  });
});
