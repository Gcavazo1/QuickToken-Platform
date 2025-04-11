/**
 * Combines multiple class names into a single string, filtering out falsy values
 * @param classes - Array of class name strings, some may be conditional
 * @returns Combined class string with only truthy values
 */
export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
} 