import * as React from 'react';
import {View, Image} from 'react-native';
import {List} from '@src/components/elements';
import {activityHistoryList} from '@src/data/mock-activity-history';
import styles from './styles';
import {formatCurrency} from '@src/utils/number-formatter';
import {ListRowItemProps} from '@src/components/elements/List/ListRowItem';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from "react";
import {User} from "@src/models/user";
import {Order} from "@src/models/order";
import {UserService} from "@src/services/user.service";
import {OrderService} from "@src/services/order.service";

type ActivityHistoryProps = {};

const ActivityHistory: React.FC<ActivityHistoryProps> = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Array<Order | null>>([]);
  useEffect(() => {
    UserService.observeCurrentUser().subscribe(u => {
      setUser(u);
      if (u) {
        OrderService.getOrdersByUser(u.uid).then(orders => {
          if (orders) {
            console.log('orders.length', orders.length);
            setOrders(orders);
          }
        });
      }
    });
  }, []);

  // @ts-ignore
  const data: ListRowItemProps[] = orders.map((order) => {
    // const {
    //   restaurantName,
    //   date,
    //   orderDetail: {totalItems, price},
    //   bookingId,
    // } = item;
    return {
      id: order?.uid,
      title: order?.shop?.name,
      subTitle: `${order?.orderItems?.length} artigos | ${formatCurrency(order?.total || 0)}`,
      note: order?.submittedAt || order?.arrivalExpectedAt,
      onPress: () => navigation.navigate('ActivityHistoryDetailScreen', {order}),
      leftIcon: (
        <Image
          source={order?.shop?.photoUrl ? {uri: order?.shop.photoUrl} : require('../../../assets/app/store_3.png')}
          style={styles.listItemImage}
        />
      ),
    };
  });
  return (
    <View style={styles.root}>
      <List data={data} />
    </View>
  );
};

export default ActivityHistory;
