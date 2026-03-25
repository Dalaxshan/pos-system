import { Types } from 'mongoose';
import { ItemQuantity } from './purchase-item-quantity';

export interface PurchaseItem {
  itemId: Types.ObjectId;
  itemName: string;
  quantity: ItemQuantity;
  discount?: number;
}
