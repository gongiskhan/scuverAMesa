import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  menuContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
  },
  menuInfo: {
    flexDirection: 'column',
  },
  mainDishText: {
    marginBottom: 5,
  },
  sideDishText: {
    marginBottom: 2,
  },
  quantityText: {
    marginRight: 10,
  },
  priceContainer: {
    padding: 10,
  },
  subTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryFee: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonGroupSection: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  buttonGroupContainer: {
    width: 130,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    width: 45,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'transparent',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
