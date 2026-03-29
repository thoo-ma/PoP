/**
 * Converts a kebab-case name slug into a title-cased display string.
 * e.g. "ancient-egyptian" → "Ancient Egyptian"
 */
export const formatDisplayName = (name: string): string => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
