import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export { width };

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {
    flex: 1,
  },
  pageWrapper: {
    width,
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#000',
  },
});
