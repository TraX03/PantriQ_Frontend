import InventoryModalComponent from "@/app/lists/inventoryModal/component";
import { Colors } from "@/constants/Colors";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/services/GeminiApi", () => ({
  getGeminiClient: jest.fn(() => ({
    generateContent: jest.fn(),
  })),
}));

const mockModify = jest.fn();
const mockSetFieldState = jest.fn();
const mockHandleMove = jest.fn();

const baseProps: any = {
  lists: {
    setFieldState: mockSetFieldState,
    currentStepIndex: 0,
    showDatePicker: false,
    datePickerIndex: 0,
    formDrafts: [
      {
        quantity: [1],
        unit: [""],
        quantityText: ["1"],
        expiries: [""],
      },
    ],
  },
  listData: {
    checkedItems: [
      {
        name: "Milk",
        checkedCount: 2,
        quantity: [1, 2],
        quantityDisplay: "2",
      },
    ],
  },
  hasMismatch: {
    hasExpiryMismatch: jest.fn().mockReturnValue(false),
    hasQuantityMismatch: jest.fn().mockReturnValue(false),
  },
  modifyDraftFieldAtIndex: mockModify,
  handleMoveToInventory: mockHandleMove,
};

describe("InventoryModalComponent", () => {
  it("renders item name and count", () => {
    const { getByText } = render(<InventoryModalComponent {...baseProps} />);
    expect(getByText("Item: Milk")).toBeTruthy();
    expect(getByText("(x2)")).toBeTruthy();
  });

  it("renders quantity input and handles text change", () => {
    const { getByPlaceholderText } = render(
      <InventoryModalComponent {...baseProps} />
    );
    const input = getByPlaceholderText("Quantity");
    fireEvent.changeText(input, "5");
    expect(mockModify).toHaveBeenCalledWith({
      updates: [
        { field: "quantityText", index: 0, value: "5" },
        { field: "quantity", index: 0, value: 5 },
      ],
    });
  });

  it("renders + Add Quantity button and triggers insert", () => {
    const { getByText } = render(<InventoryModalComponent {...baseProps} />);
    fireEvent.press(getByText("+ Add Quantity"));
    expect(mockModify).toHaveBeenCalledWith({
      updates: [
        {
          field: "quantityText",
          index: 0,
          value: "",
          insertAfter: true,
        },
        {
          field: "quantity",
          index: 0,
          value: 0,
          insertAfter: true,
        },
      ],
    });
  });

  it("disables submit when mismatch", () => {
    const props = {
      ...baseProps,
      hasMismatch: {
        hasExpiryMismatch: jest.fn().mockReturnValue(true),
        hasQuantityMismatch: jest.fn().mockReturnValue(false),
      },
    };
    const { getByText } = render(<InventoryModalComponent {...props} />);
    const button = getByText("Submit");
    expect(button.props.style.color).toBe(Colors.text.disabled);
  });

  it("calls setFieldState on date picker open", () => {
    const { getByText } = render(<InventoryModalComponent {...baseProps} />);
    fireEvent.press(getByText("Select expiry date"));
    expect(mockSetFieldState).toHaveBeenCalledWith("datePickerIndex", 0);
    expect(mockSetFieldState).toHaveBeenCalledWith("showDatePicker", true);
  });

  it("shows Next when multiple items", () => {
    const props = {
      ...baseProps,
      lists: {
        ...baseProps.lists,
        currentStepIndex: 0,
      },
      listData: {
        checkedItems: [
          { name: "Item 1", checkedCount: 1 },
          { name: "Item 2", checkedCount: 1 },
        ],
      },
    };
    const { getByText } = render(<InventoryModalComponent {...props} />);
    fireEvent.press(getByText("Next"));
    expect(mockSetFieldState).toHaveBeenCalledWith("currentStepIndex", 1);
  });
});
