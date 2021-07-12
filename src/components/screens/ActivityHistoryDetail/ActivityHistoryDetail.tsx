import * as React from 'react';
import {ScrollView, Image} from 'react-native';
import ListRowItem from '@src/components/elements/List/ListRowItem';
import {Divider, Container, Icon, Button, Text} from '@src/components/elements';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import StepIndicator from 'react-native-step-indicator';
import {StepIndicatorStyles} from 'react-native-step-indicator/lib/typescript/src/types';
import OrderSummary from './OrderSummary';
import styles from './styles';
import {Order} from "@src/models/order";
import {Route, useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {Item} from "@src/models/item";
import {OptionGroupService} from "@src/services/option-group.service";
import {OrderService} from "@src/services/order.service";

type ActivityHistoryDetailProps = {
  route: Route<any>
};

const ActivityHistoryDetail: React.FC<ActivityHistoryDetailProps> = ({route}) => {

  const navigation = useNavigation();
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    setOrder((route.params as any).order as Order);
  }, []);

  const reorder = (order) => {
    OrderService.setCurrentOrder(order).then(() =>{
      navigation.navigate('CheckoutScreen');
    });
  }

  return (
    <ScrollView>
      <ListRowItem
        title={order?.shop?.name || ''}
        note={`Ref.: ${order?.uid}`}
        leftIcon={
          <Image
            source={order?.shop?.photoUrl ? {uri: order?.shop.photoUrl} : require('../../../assets/app/store_3.png')}
            style={styles.icon}
          />
        }
      />
      <Divider />
      <OrderSummary name={order?.shop?.name || ''} price={order?.total || 0} orderItems={order?.orderItems || []}/>
      <Container style={styles.footer}>
        <Button isFullWidth onPress={() => reorder(order)}>
          <Text isWhite>Re-Encomendar</Text>
        </Button>
      </Container>
    </ScrollView>
  );
};

export default ActivityHistoryDetail;
