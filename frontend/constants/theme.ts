export const colors = {
  // Home
  homeBackground: '#fff',
  homeText: '#666',
  homeButton: '#000',
  
  // Proof of Immobility
  immobilityBackground: '#f0f8ff',
  immobilityTitle: '#1e3a8a',
  immobilityText: '#475569',
  immobilityCard: '#64748b',
  immobilityValue: '#1e3a8a',
  immobilityHint: '#94a3b8',
  
  // Proof of Time
  timeBackground: '#fef3c7',
  timeTitle: '#92400e',
  timeText: '#78350f',
  timeCard: '#a16207',
  timeValue: '#92400e',
  timeHint: '#a16207',
  
  // Common
  hint: '#999',
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
  hint: {
    fontSize: 14,
    textAlign: 'center' as const,
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
