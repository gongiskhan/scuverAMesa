import {StyleSheet} from 'react-native';
import {lightTheme} from "@src/styles/theme";
export default StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  promotionListContainer: {
    paddingTop: 5,
  },
  promotionImage: {
    width: 50,
    height: 50,
  },
  ratingContainer: {
    color: lightTheme.colors.tertiary
  }
});
