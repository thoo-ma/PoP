import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 100,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
