import type { ChallengeStatus } from '../types';

export interface StatusDisplay {
  text: string;
  icon: string;
  color: string;
}

/**
 * Get display properties for immobility challenge status
 * @param status - Current challenge status
 * @param immobilityValueColor - Default color for idle/running states
 * @returns Object with text, icon, and color for the status
 */
export const getStatusDisplay = (
  status: ChallengeStatus,
  immobilityValueColor: string
): StatusDisplay => {
  if (status === 'idle') {
    return { text: 'Ready', icon: '📍', color: immobilityValueColor };
  } else if (status === 'warning') {
    return { text: 'Movement Detected ⚠️', icon: '⚠️', color: '#ff6b6b' }; // Red
  } else {
    return { text: 'Immobile ✓', icon: '✓', color: '#4ade80' }; // Green
  }
};
