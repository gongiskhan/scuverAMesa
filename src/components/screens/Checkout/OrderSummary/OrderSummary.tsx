import * as React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, Text, Section, Divider} from '@src/components/elements';
import styles from './styles';
import {formatCurrency} from '@src/utils/number-formatter';
import {OrderItem} from "@src/models/order-item";
import {Order} from "@src/models/order";

type OrderSummaryProps = {
  order: Order
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  order
}) => {
  const navigation = useNavigation();

  const _onAddItemButtonPressed = () => {
    navigation.navigate('DishDetailsModal');
  };

  return (
    <Section
      title="Resumo da Encomenda"
      actionButtonText="Adicionar Artigos"
      onButtonActionPressed={_onAddItemButtonPressed}>
      <Container>
        <View style={styles.menuContainer}>
          <View style={styles.menuInfo}>
            {order?.orderItems?.map((cartItem, cartItemIndex) => (
              <View key={cartItemIndex} style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                <Text style={styles.mainDishText} isBold>
                  {cartItem.name} - <Text style={{textAlign: 'right', alignSelf: 'flex-end'}}>€{cartItem.price}</Text>
                </Text>
                {cartItem.optionsSelected?.map((option, dishIndex) => (
                  <Text isSecondary key={dishIndex} style={styles.sideDishText}>
                    {option.quantity} x {option.name} - €{option.price}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>
        <Divider />
        <View style={styles.priceContainer}>
          <View style={styles.subTotalContainer}>
            <Text>Subtotal</Text>
            <Text>{formatCurrency(order.total)}</Text>
          </View>
        </View>
      </Container>
    </Section>
  );
};

export default OrderSummary;
