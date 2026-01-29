import type { ChallengeStatus } from '../types';

interface StatusDisplay {
  text: string;
  color: string;
}

/**
 * Get display properties for immobility challenge status
 * @param status - Current challenge status
 * @param immobilityValueColor - Default color for idle/running states
 * @returns Object with text and color for the status
 */
export const getStatusDisplay = (
  status: ChallengeStatus,
  immobilityValueColor: string
): StatusDisplay => {
  if (status === 'idle') {
    return { text: 'Ready', color: immobilityValueColor };
  } else if (status === 'warning') {
    return { text: 'Movement Detected ⚠️', color: '#ff6b6b' }; // Red
  } else {
    return { text: 'Immobile ✓', color: '#4ade80' }; // Green
  }
};
