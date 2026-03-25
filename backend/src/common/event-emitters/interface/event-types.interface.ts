import { Types } from 'mongoose';
import { ItemDocument } from 'src/modules/items/item.schema';

export interface EventPayloads {
  'user.welcome': { name: string; email: string };
  'vendor.pending-approval': { name: string; email: string };
  'vendor.approved': { name: string; email: string; status: string };
  'user.reset-password': { name: string; email: string; link: string };
  'user.verify-email': { name: string; email: string; otp: string };
  'client.email-verification': { name: string; email: string; token: string };
  'client.forgot-password': {
    name: string;
    email: string;
    forgotPasswordToken: string;
  };
  'vendor.forgot-password': {
    name: string;
    email: string;
    forgotPasswordToken: string;
  };
  'item.send-item-summary-email': {
    email: string;
    items: ItemDocument[];
  };
  'item.created': {
    name: string;
    createdTime: Date;
    createdBy: string;
    type: string;
    itemId: Types.ObjectId;
  };
  'sales.created': {
    name: string;
    createdTime: Date;
    createdBy: string;
    type: string;
    salesId: Types.ObjectId;
  };
  'recipe.created': {
    name: string;
    createdTime: Date;
    createdBy: string;
    type: string;
    recipeId: Types.ObjectId;
  };
  'purchase.created': {
    name: string;
    createdTime: Date;
    createdBy: string;
    type: string;
    purchaseId: Types.ObjectId;
  };
}
