import * as React from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {Container, Text, Button, TextField} from '@src/components/elements';
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

  const navigation = useNavigation();
  const colors = useThemeColors();

  const [isSuccessOrderModalVisible, setIsSuccessOrderModalVisible] =
    React.useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState<Array<any>>([]);
  const [notes, setNotes] = useState<string>('');

  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState({} as Order);

  const setTable = (table) => {
    order.table = table;
    if (table === 'notes') {
      order.notes += notes;
    }
    setOrder(order);
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
    const its = [{label: 'Balcão', value: 'counter'}, {label: 'Sem Número', value: 'notes'}];
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
          navigation.navigate('Auth');
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
      <View style={{...styles.totalPriceContainer, height: value === 'notes' ? 100 : 50}}>
        <DropDownPicker
          placeholder={'Selecione a Mesa'}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={() => {
            setTable(value);
          }}
        />
        {value === 'notes' &&
        <TextField
            style={{marginTop: 30, marginBottom: 30}}
            placeholder={'Explique a localização da mesa aqui.'}
            textContentType="name"
            hasMargin
            placeholderTextColor={'#111'}
            onChangeText={text => setNotes(text)}
        />
        }
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
