/**
 * Format milliseconds to MM:SS:MS (centiseconds)
 * @param milliseconds - Time in milliseconds
 * @returns Formatted string like "02:34:56"
 */
export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10); // Show centiseconds (00-99)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
};

/**
 * Format confidence value to percentage string
 * @param confidence - Confidence value between 0 and 1
 * @returns Formatted percentage string like "85%"
 */
export const formatConfidencePercentage = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};
