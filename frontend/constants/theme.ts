export const colors = {
  // Base UI
  background: '#fff',
  primary: '#000',
  
  // Text
  title: '#374151',
  text: '#6b7280',
  textLight: '#999',
  textDark: '#1e293b',
  
  // Status colors
  success: '#4ade80',
  error: '#dc2626',
  warning: '#ff6b6b',
  info: '#3B82F6',
  
  // NFT Properties
  efficiency: '#3b82f6',
  resilience: '#10b981',
  comfort: '#f59e0b',
  luck: '#8b5cf6',
  energy: '#ef4444',
  level: '#6366f1',
  
  // UI Elements
  active: '#000',
  inactive: '#d1d5db',
  disabled: '#9CA3AF',
  border: '#e5e7eb',
  borderLight: '#d1d5db',
  
  // Backgrounds
  bgLight: '#f3f4f6',
  bgLighter: '#f9fafb',
  bgSurface: '#fff',
  bgOverlay: 'rgba(255, 255, 255, 0.9)',
  bgOverlayFull: 'rgba(255, 255, 255, 0.95)',
  
  // Property bars
  propertyBg: '#e2e8f0',
  propertyText: '#475569',
  propertyValue: '#1e293b',
  
  // Shadows
  shadow: '#000',

  // Specific components
  slider: '#1e293b',

  // Button states
  buttonPrimary: '#000',
  buttonSecondary: '#d1d5db',
  buttonSuccess: '#10b981',
  buttonText: '#fff',
  buttonTextDark: '#1F1F1F',
};

export const typography = {
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  description: {
    fontSize: 16,
    marginBottom: 48,
    textAlign: 'center' as const,
    lineHeight: 24,
  },
};

export const layout = {
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 20,
  },
};
