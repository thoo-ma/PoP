export const colors = {
  // Common
  background: '#fff',
  title: '#374151',
  text: '#6b7280',
  button: '#000',
  value: '#374151',
  hint: '#999',
  
  // Home
  homeText: '#666',
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
