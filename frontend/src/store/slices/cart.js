import { createSlice } from '@reduxjs/toolkit';

const calculateSubTotal = (items) => {
  return items
    .reduce((total, item) => total + parseFloat(item.totalAmount) * item.quantity, 0)
    .toFixed(2);
};

const calculateTotalCharges = (customization) => {
  return customization
    .reduce((total, customization) => total + parseFloat(customization.price), 0)
    .toFixed(2);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subTotal: 0,
    discount: 0,
    serviceCharge: 10,
  },
  reducers: {
    addToCart(state, action) {
      const { items } = action.payload;

      items.forEach((newItem) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.totalAmount === newItem.totalAmount
        );

        if (existingItemIndex !== -1) {
          state.items[existingItemIndex].quantity = String(
            parseInt(state.items[existingItemIndex].quantity) + parseInt(newItem.quantity)
          );
        } else {
          state.items.push({ ...newItem });
        }
      });

      state.subTotal = calculateSubTotal(state.items);
    },

    addCustomizations(state, action) {
      const { customizations } = action.payload;

      customizations.forEach((newCustomization) => {
        const existingOptionIndex = state.options.findIndex(
          (option) => option.variant === newCustomization.variant
        );

        if (existingOptionIndex !== -1) {
          state.options[existingOptionIndex].price = String(
            parseInt(state.options[existingOptionIndex].price) + parseInt(newCustomization.price)
          );
        } else {
          state.options.push({ ...newCustomization });
        }
      });

      state.totalCharge = calculateTotalCharges(state.customizations);
    },

    removeItem(state, action) {
      const removeTotalAmount = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.totalAmount === removeTotalAmount
      );

      if (existingItemIndex !== -1) {
        state.items.splice(existingItemIndex, 1);
        state.subTotal = calculateSubTotal(state.items);
      }
    },

    clearCart(state) {
      state.items = [];
      state.subTotal = 0;
      state.discount = 0;
      state.serviceCharge = 10;
    },
  },
});

export const cartReducer = cartSlice.reducer;
export const { addToCart, clearCart, removeItem } = cartSlice.actions;
