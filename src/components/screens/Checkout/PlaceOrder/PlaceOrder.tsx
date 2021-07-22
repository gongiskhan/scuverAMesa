import * as React from 'react';
import {Alert, ScrollView, View} from 'react-native';
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
import DropDownPicker from "react-native-dropdown-picker";
import useThemeColors from "@src/custom-hooks/useThemeColors";

type PlaceOrderProps = {
  totalPrice: number;
  shippingFee: number;
};

const PlaceOrder: React.FC<PlaceOrderProps> = ({totalPrice, shippingFee}) => {
  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] =
    React.useState(false);

  const navigation = useNavigation();
  const colors = useThemeColors();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState<Array<any>>([]);

  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState({} as Order);

  const setTable = (table) => {
    order.table = table;
    setOrder(order);
    setValue(table);
  }

  useEffect(() => {
    UserService.getCurrentUser().then(u => {
      setUser(u);
    });
    OrderService.getCurrentOrder().subscribe(order => {
      if (order) {
        setOrder(order);
      }
    });
    const its = [{label: 'Balcão', value: 'counter'}];
    for (let i = 0; i < 200; i++) {
      its.push({label: `Mesa ${i}`, value: `table${i}`});
    }
    setItems(its);
  }, []);

  const _onPlaceOrderButtonPressed = () => {
    if (user && totalPrice && user.wallet > totalPrice) {
      Alert.alert(
        "Confirmação",
        `Submeter pedido? €${totalPrice} serão deduzidos da sua Carteira Scuver`,
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
    } else if(!user) {
      Alert.alert('Login', 'Por favor efetue login para realizar este pedido.', [
        {text: 'OK', onPress: () => {
          navigation.navigate('Login');
          }}
      ]);
    } else if(user.wallet < totalPrice) {
      Alert.alert('Carregamento', 'Por favor carregue a sua Carteira Scuver para efetuar este pedido.', [
        {text: 'OK', onPress: () => {
            navigation.navigate('Carteira');
          }}
      ]);
    }
  };

  return (
    <Container style={styles.placeOrderContainer}>
      {/*<View style={styles.totalPriceContainer}>*/}
      {/*  <Text style={styles.totalPriceText}>Total</Text>*/}
      {/*  <Text isBold style={styles.totalPriceText}>*/}
      {/*    {formatCurrency(totalPrice)}*/}
      {/*  </Text>*/}
      {/*</View>*/}
      <View style={styles.totalPriceContainer}>
        <DropDownPicker
          placeholder={'Selecione a Mesa'}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setTable}
          setItems={setItems}
        />
      </View>
      <Button style={{backgroundColor: !value || !totalPrice ? colors.border : colors.primary}} disabled={!value || !totalPrice} isFullWidth onPress={_onPlaceOrderButtonPressed}>
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
