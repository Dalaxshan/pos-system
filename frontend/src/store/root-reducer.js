import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import { cartReducer } from './slices/cart';

export const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});
