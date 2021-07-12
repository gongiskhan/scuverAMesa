import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  viewBasketButtonContainer: {
    padding: 10,
  },
  viewBasketButton: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  basketIcon: {
    color: 'white',
    flex: 1
  },
  chevronIcon: {
    color: 'white',
    flex: 1
  },
  numberOfItemsText: {
    color: 'white',
    flex: 2
  },
  totalPriceText: {
    fontSize: 16,
    color: 'white',
    flex: 5
  },
  viewOrderText: {
    color: 'white',
    flex: 3
  },
});
