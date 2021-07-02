import * as React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, Text, Section, Divider} from '@src/components/elements';
import styles from './styles';
import {formatCurrency} from '@src/utils/number-formatter';
import {OrderItem} from "@src/models/order-item";

type OrderSummaryProps = {
  cartItems: OrderItem[];
  totalPrice: number;
  shippingFee: number;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  totalPrice,
  shippingFee,
}) => {
  const navigation = useNavigation();

  const _onAddItemButtonPressed = () => {
    navigation.navigate('DishDetailsModal');
  };

  return (
    <Section
      title="Order Summary"
      actionButtonText="Add Items"
      onButtonActionPressed={_onAddItemButtonPressed}>
      <Container>
        <View style={styles.menuContainer}>
          <View style={styles.menuInfo}>
            <Text style={styles.quantityText}>{`${cartItems.length}`}</Text>
            {cartItems.map((cartItem, cartItemIndex) => (
              <View key={cartItemIndex}>
                <Text style={styles.mainDishText} isBold>
                  {cartItem.name}
                </Text>
                {cartItem.optionsSelected.map((dish, dishIndex) => (
                  <Text isSecondary key={dishIndex} style={styles.sideDishText}>
                    {dish.name}
                  </Text>
                ))}
              </View>
            ))}
          </View>
          <Text isBold>{formatCurrency(totalPrice)}</Text>
        </View>
        <Divider />
        <View style={styles.priceContainer}>
          <View style={styles.subTotalContainer}>
            <Text>Subtotal</Text>
            <Text>{formatCurrency(totalPrice)}</Text>
          </View>
          <View style={styles.deliveryFee}>
            <Text>Delivery: 6.1km</Text>
            <Text>{formatCurrency(shippingFee)}</Text>
          </View>
        </View>
      </Container>
    </Section>
  );
};

export default OrderSummary;
