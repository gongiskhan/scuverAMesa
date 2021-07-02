import * as React from 'react';
import {ScrollView, View} from 'react-native';
import DeliveryInformation from './DeliveryInformation';
import OrderSummary from './OrderSummary';
import PaymentMethod from './PaymentMethod';
import styles from './styles';
import PlaceOrder from './PlaceOrder';
import DishesAlsoOrdered from './DishesAlsoOrdered';

type BasketProps = {};

const shippingFee = 5;

const Basket: React.FC<BasketProps> = () => {
  const cartItems: any = [];
  const totalPrice = 0;
  return (
    <View style={styles.rootContainer}>
      <ScrollView
        contentInset={{
          bottom: 25,
        }}>
        <DeliveryInformation />
        <OrderSummary
          cartItems={cartItems}
          totalPrice={totalPrice}
          shippingFee={shippingFee}
        />
        <DishesAlsoOrdered />
        <PaymentMethod />
      </ScrollView>
      <PlaceOrder totalPrice={totalPrice} shippingFee={shippingFee} />
    </View>
  );
};

export default Basket;
