import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearCart, addToCart } from 'src/store/slices/cart';
import apiManager from 'src/network/ApiManager';
import { API_CONSTANTS } from 'src/network/NetworkConstants';

export const editSaleOrder = createAsyncThunk(
  'cart/editSaleOrder',
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiManager.get(API_CONSTANTS.getSaleOrderById(orderId));
      const saleOrderData = response?.data?.data;

      if (!saleOrderData?.items) {
        throw new Error('No items found in the sale order');
      }

      // Clear cart before adding items
      dispatch(clearCart());

      // Dispatch addToCart for each item
      saleOrderData.items.forEach((item) => {
        dispatch(
          addToCart({
            items: [
              {
                id: item._id,
                itemId: item.itemId,
                name: item.itemName,
                unitPrice: item.unitPrice,
                discount: item.discount,
                netPrice: item.netPrice,
                quantity: item.quantity,
                customizations: item.customizations || [],
                totalAmount: item.totalAmount,
                note: item.note || '',
              },
            ],
          })
        );
      });

      return saleOrderData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
