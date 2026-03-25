import { Types } from 'mongoose';

/**
 * Helper function to transform a value into a MongoDB ObjectId.
 * Ensures the value is a valid string before transformation.
 *
 * @param value - The value to be transformed into ObjectId.
 * @returns A valid ObjectId or undefined if the value is falsy or invalid.
 */
export function toObjectId(value: any): Types.ObjectId | undefined {
  if (!value || typeof value !== 'string') {
    return value;
  }

  if (Types.ObjectId.isValid(value)) {
    return new Types.ObjectId(value);
  }

  return undefined;
}
