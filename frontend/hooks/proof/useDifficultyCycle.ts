import { useState, useCallback } from 'react';
import type { DifficultyMode } from '../../types';

interface UseDifficultyCycleReturn {
  mode: DifficultyMode;
  cycleMode: () => void;
  setMode: (mode: DifficultyMode) => void;
}

/**
 * Hook to manage difficulty mode cycling
 * Cycles through: easy -> normal -> strict -> easy
 * @param initialMode - Initial difficulty mode (default: 'normal')
 * @returns Object with current mode, cycleMode function, and setMode function
 */
export function useDifficultyCycle(initialMode: DifficultyMode = 'normal'): UseDifficultyCycleReturn {
  const [mode, setMode] = useState<DifficultyMode>(initialMode);

  const cycleMode = useCallback(() => {
    setMode((currentMode) => {
      if (currentMode === 'easy') {
        return 'normal';
      } else if (currentMode === 'normal') {
        return 'strict';
      } else {
        return 'easy';
      }
    });
  }, []);

  return {
    mode,
    cycleMode,
    setMode,
  };
}
