/**
 * Helper function to transform a value into a boolean.
 * Converts strings like 'true', 'false', and numbers 1, 0 to boolean.
 * Returns the boolean value or undefined if the value is falsy or invalid.
 *
 * @param value - The value to be transformed into a boolean.
 * @returns A boolean or undefined if the value is falsy or invalid.
 */
export function toBoolean(value: any): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  return undefined;
}
