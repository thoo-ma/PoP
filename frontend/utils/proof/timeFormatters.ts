/**
 * Format confidence value to percentage string
 * @param confidence - Confidence value between 0 and 1
 * @returns Formatted percentage string like "85%"
 */
export const formatConfidencePercentage = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};
