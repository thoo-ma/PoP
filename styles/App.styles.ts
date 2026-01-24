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
});
