import * as React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, Text, Section, Divider, Button, Icon} from '@src/components/elements';
import styles from './styles';
import {formatCurrency} from '@src/utils/number-formatter';
import {OrderItem} from "@src/models/order-item";
import {Order} from "@src/models/order";
import {OrderHelper} from "@src/utils/order-helper";
import {useEffect, useState} from "react";
import {OrderService} from "@src/services/order.service";

type OrderSummaryProps = {};

const OrderSummary: React.FC<OrderSummaryProps> = () => {
  const navigation = useNavigation();

  const [order, setOrder] = useState({} as Order);
  useEffect(() => {
    OrderService.getCurrentOrder().subscribe(order => {
      if (order) {
        setOrder(order);
      }
    });
  }, []);

  const _onAddItemButtonPressed = () => {
    navigation.navigate('ShopDetailsScreen');
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
              <View key={cartItemIndex} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Container style={{flexDirection: 'column', width: '65%'}}>
                  <Text style={styles.mainDishText} isBold>
                    {cartItem.name} - <Text style={{textAlign: 'right', alignSelf: 'flex-end'}}>€{cartItem.price}</Text>
                  </Text>
                  {cartItem.optionsSelected?.map((option, dishIndex) => (
                    <Text isSecondary key={dishIndex} style={styles.sideDishText}>
                      {option.quantity} x {option.name} - €{option.price}
                    </Text>
                  ))}
                  <Text isSecondary style={styles.sideDishText}>
                    {cartItem.obs}
                  </Text>
                </Container>
                <Container style={[styles.buttonGroupSection, {width: '30%'}]}>
                  <Container style={styles.buttonGroupContainer}>
                    <Button style={styles.button} onPress={() => {
                       OrderHelper.removeOrderItem(order, cartItemIndex);
                       OrderService.setCurrentOrder(order);
                    }}>
                      <Icon name="minus" isPrimary />
                    </Button>
                    <Text style={styles.amount}>{cartItem.quantity}</Text>
                    <Button style={styles.button} onPress={() => {
                      OrderHelper.addOrderItem(order, cartItemIndex);
                      OrderService.setCurrentOrder(order);
                    }}>
                      <Icon name="plus" isPrimary />
                    </Button>
                  </Container>
                </Container>
              </View>
            ))}
          </View>
        </View>
        <Divider />
        <View style={styles.priceContainer}>
          <View style={styles.subTotalContainer}>
            <Text>Total</Text>
            <Text>{formatCurrency(order.total)}</Text>
          </View>
        </View>
      </Container>
    </Section>
  );
};

export default OrderSummary;
