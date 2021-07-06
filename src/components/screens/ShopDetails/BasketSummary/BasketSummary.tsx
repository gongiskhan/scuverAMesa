import * as React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, Button, Text} from '@src/components/elements';
import {formatCurrency} from '@src/utils/number-formatter';
import styles from './styles';
import {useEffect, useState} from "react";
import {Order} from "@src/models/order";
import {OrderService} from "@src/services/order.service";
import {take} from "rxjs/operators";

type BasketSummaryProps = {};

const BasketSummary: React.FC<BasketSummaryProps> = () => {

  const navigation = useNavigation();
  const [order, setOrder] = useState({} as Order);

  useEffect(() => {
    OrderService.getCurrentOrder().subscribe(order => {
      if (order) {
        setOrder(order);
      }
    });
  }, []);

  const _onViewBasketButtonPressed = () => {
    navigation.navigate('CheckoutScreen');
  };

  return (
    <>
      {order?.orderItems?.length > 0 && (
        <Container style={styles.viewBasketButtonContainer}>
          <Button
            childrenContainerStyle={styles.viewBasketButton}
            onPress={_onViewBasketButtonPressed}>
            <View style={styles.viewBasketButtonTextContainer}>
              <Text isBold style={styles.viewBasketButtonText}>
                Ver Mais
              </Text>
              <Text style={styles.cardItemText}>{`${order.orderItems.length} ${
                order.orderItems.length > 1 ? 'artigos' : 'artigo'
              }`}</Text>
            </View>
            <Text style={styles.totalPriceText} isBold>
              {formatCurrency(order.total)}
            </Text>
          </Button>
        </Container>
      )}
    </>
  );
};

export default BasketSummary;
