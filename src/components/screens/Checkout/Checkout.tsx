import * as React from 'react';
import {ScrollView, View} from 'react-native';
import DeliveryInformation from './DeliveryInformation';
import OrderSummary from './OrderSummary';
import PaymentMethod from './PaymentMethod';
import styles from './styles';
import PlaceOrder from './PlaceOrder';
import DishesAlsoOrdered from './DishesAlsoOrdered';
import {useEffect, useState} from "react";
import {Order} from "@src/models/order";
import {OrderService} from "@src/services/order.service";

type BasketProps = {};

const shippingFee = 5;

const Basket: React.FC<BasketProps> = () => {

  const [order, setOrder] = useState({} as Order);
  useEffect(() => {
    OrderService.getCurrentOrder().subscribe(order => {
      if (order) {
        console.log('order.orderItems', order.orderItems);
        setOrder(order);
      }
    });
  }, []);

  return (
    <View style={styles.rootContainer}>
      <ScrollView
        contentInset={{
          bottom: 25,
        }}>
        {/*<DeliveryInformation />*/}
        <OrderSummary/>
      </ScrollView>
      <PlaceOrder totalPrice={order.total} shippingFee={0} />
    </View>
  );
};

export default Basket;
