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
 * Format milliseconds to HH:MM:SS
 * @param ms - Time in milliseconds
 * @returns Formatted string like "01:23:45"
 */
export const formatElapsedTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  const displayHours = String(hours).padStart(2, '0');
  const displayMinutes = String(minutes % 60).padStart(2, '0');
  const displaySeconds = String(seconds % 60).padStart(2, '0');
  
  return `${displayHours}:${displayMinutes}:${displaySeconds}`;
};
