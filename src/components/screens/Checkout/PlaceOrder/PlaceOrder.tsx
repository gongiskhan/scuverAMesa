import * as React from 'react';
import {Alert, View} from 'react-native';
import {Container, Text, Button} from '@src/components/elements';
import SuccessOrderModal from './SuccessOrderModal';
import styles from './styles';
import {formatCurrency} from '@src/utils/number-formatter';
import {useEffect, useState} from "react";
import {User} from "@src/models/user";
import {UserService} from "@src/services/user.service";
import {useNavigation} from "@react-navigation/native";
import {OrderService} from "@src/services/order.service";
import {Order} from "@src/models/order";
import {MyMoment} from "@src/utils/time-helper";

type PlaceOrderProps = {
  totalPrice: number;
  shippingFee: number;
};

const PlaceOrder: React.FC<PlaceOrderProps> = ({totalPrice, shippingFee}) => {
  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] =
    React.useState(false);

  const navigation = useNavigation();

  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState({} as Order);
  useEffect(() => {
    UserService.getCurrentUser().then(u => {
      setUser(u);
    });
    OrderService.getCurrentOrder().subscribe(order => {
      if (order) {
        setOrder(order);
      }
    });
  }, []);

  const _onPlaceOrderButtonPressed = () => {
    if (user && user.wallet > totalPrice) {
      Alert.alert(
        "Confirmação",
        `Submeter pedido? O valor de €${totalPrice} será deduzido da sua Carteira Scuver`,
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "Submeter Pedido",
            onPress: () => {
              UserService.updateUser({...user, wallet: user.wallet - totalPrice});
              OrderService.updateOrder({...order, submittedAt: MyMoment.getCurrentMoment().toString(), status: 'pending'});
              setIsSuccessOrderModalVisible(true);
              navigation.navigate('HomeScreen');
            }
          }
        ]
      );
    } else {
      Alert.alert('Carregamento', 'Por favor carregue a sua Carteira Scuver para efetuar este pedido.');
    }
  };

  return (
    <Container style={styles.placeOrderContainer}>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}>Total</Text>
        <Text isBold style={styles.totalPriceText}>
          {formatCurrency(totalPrice)}
        </Text>
      </View>
      <Button isFullWidth onPress={_onPlaceOrderButtonPressed}>
        <Text isBold style={styles.placeOrderText}>
          Submeter Pedido
        </Text>
      </Button>
      <SuccessOrderModal
        isVisible={isSuccessOrderModalVisible}
        setIsVisble={setIsSuccessOrderModalVisible}
      />
    </Container>
  );
};

export default PlaceOrder;
