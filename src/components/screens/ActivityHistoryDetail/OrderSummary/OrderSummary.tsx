import * as React from 'react';
import {View} from 'react-native';
import {Container, Text, Section, Divider} from '@src/components/elements';
import styles from './styles';
import {formatCurrency} from '@src/utils/number-formatter';
import {OrderDetail} from '@src/data/mock-activity-history';
import {OrderItem} from "@src/models/order-item";

type OrderSummaryProps = {
  name: string;
  price: number;
  orderItems: Array<OrderItem | null>
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  name, price, orderItems
}) => {

  return (
    <Section title="Order Summary">
      <Container>
        <View style={styles.menuContainer}>
          <View style={styles.menuInfo}>
            {orderItems.map(orderItem => {
              return (
                <View>
                  <Text style={styles.mainDishText} isBold>
                    {orderItem?.name} - {formatCurrency(orderItem?.price || 0)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <Divider />
        <View style={styles.priceContainer}>
          <View style={styles.deliveryFee}>
            <Text>Total</Text>
            <Text>{formatCurrency(price)}</Text>
          </View>
        </View>
      </Container>
    </Section>
  );
};

export default OrderSummary;
