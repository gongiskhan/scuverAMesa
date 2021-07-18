import * as React from 'react';
import {useEffect, useState} from 'react';
import {Animated, KeyboardAvoidingView, Platform, SafeAreaView, View,} from 'react-native';
import {Route, useNavigation, useTheme} from '@react-navigation/native';
import {Button, Card, Container, Text, TextField} from '@src/components/elements';
import HeadingInformation from './HeadingInformation';
import AddToBasketForm from './AddToBasketForm';
import {formatCurrency} from '@src/utils/number-formatter';
import styles from './styles';
import {Item} from "@src/models/item";
import {OptionGroupService} from "@src/services/option-group.service";
import OptionGroups from "@src/components/screens/DishDetails/OptionGroups";
import {OrderOption} from "@src/models/order-option";
import {OrderService} from "@src/services/order.service";
import {OrderHelper} from "@src/utils/order-helper";
import {take} from "rxjs/operators";
import BasketSummary from "@src/components/screens/ShopDetails/BasketSummary";

type DishDetailsProps = {
  route: Route<any>
};

export const DishDetails: React.FC<DishDetailsProps> = ({route}) => {

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [data, setData] = useState<any>({});
  const [quantity, setQuantity] = useState<any>(1);
  const [obs, setObs] = useState<any>('');

  const [scrollY] = React.useState(new Animated.Value(0));
  const {
    colors: {background},
  } = useTheme();
  const {goBack} = useNavigation();

  useEffect(() => {
    // console.log('data', (route.params as any).data);
    const d = (route.params as any).data as Item;
    d.optionGroups = [];
    d.optionGroupsId.forEach((ogUID, it) => {
      OptionGroupService.getOptionGroup(ogUID).then(og => {
        d.optionGroups.push(og);
        if (d.optionGroups.length >= d.optionGroupsId.length) {
          d.optionsSelected = [];
          setData(d);
        }
      });
    });
  }, []);

  const updateTotalDishAmount = React.useCallback(
    (qtd) => {
      setQuantity(qtd);
      // console.log('qtd', qtd);
      // console.log('data?.optionsSelected', data?.optionsSelected);
      const totalSelectedOptionsPrice = data?.optionsSelected?.reduce(
        (prevValue: any, currentValue: any) => prevValue + currentValue.price,
        0,
      ) || 0;
      // console.log('data.price', data.price);
      // console.log('totalSelectedOptionsPrice', totalSelectedOptionsPrice);
      setTotalPrice((parseFloat(data.price) + totalSelectedOptionsPrice) * qtd);
    },
    [data],
  );
  useEffect(() => updateTotalDishAmount(quantity), [data, quantity]);

  const onAddToBasketButtonPressed = async () => {

    let order = await OrderService.getCurrentOrder().pipe(take(1)).toPromise();
    if (!order) order = await OrderHelper.buildNewOrder();

    const orderItem = OrderHelper.itemToOrderItem(data, quantity, obs);
    order.orderItems.push(orderItem);

    await OrderService.setCurrentOrder(order);

    goBack();

    // OrderService.getCurrentOrder().toPromise().then(order => {
    //   console.log('order', order);
    //   order?.orderItems.push(OrderHelper.itemToOrderItem(data, 1));
    //   OrderService.updateOrder(order as any);
    //   console.log('order', order);
    //   goBack();
    // });
  };

  const coverTranslateY = scrollY.interpolate({
    inputRange: [-4, 0, 10],
    outputRange: [-2, 0, 3],
  });

  const coverScale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [2, 1],
    extrapolateRight: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [150, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.rootContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'position' : 'height'}
          enabled>
          <Animated.ScrollView
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: scrollY,
                    },
                  },
                },
              ],
              {
                useNativeDriver: true,
              },
            )}>
            <Animated.View
              style={[
                styles.coverPhotoContainer,
                {
                  transform: [
                    {
                      translateY: coverTranslateY,
                    },
                  ],
                },
              ]}>
              <Animated.Image
                source={data?.photoURL ? {uri: data.photoURL} : require('../../../assets/app/dinner.png')}
                style={[
                  styles.coverPhoto,
                  {
                    transform: [
                      {
                        scale: coverScale,
                      },
                    ],
                  },
                ]}
              />
            </Animated.View>
            <HeadingInformation data={data} />
            <OptionGroups
              data={data}
              addOptionToItem={(option, optionGroup) => {
                let optionAlreadySelected = false;
                let optionsFromThisGroupSelected = 0;
                let maximumOptionsSelected = false;
                data?.optionsSelected?.forEach((opt: OrderOption) => {
                  if (opt.name === option.name) {
                    optionAlreadySelected = true;
                  }
                  optionGroup.options.forEach(o => {
                    if (opt.name === o.name) {
                      optionsFromThisGroupSelected++;
                    }
                  });
                });
                // console.log('optionAlreadySelected', optionAlreadySelected);
                // console.log('optionsFromThisGroupSelected', optionsFromThisGroupSelected);
                // console.log('optionGroup.amountOptionsRequired', optionGroup.amountOptionsRequired);
                if(optionGroup.amountOptionsRequired && (optionsFromThisGroupSelected >= optionGroup.amountOptionsRequired)) {
                  maximumOptionsSelected = true;
                }
                // console.log('maximumOptionsSelected', maximumOptionsSelected);
                if (optionAlreadySelected) {
                  data?.optionsSelected?.splice(data?.optionsSelected?.findIndex((o: any) => o.name === option.name), 1);
                } else {
                  if(!maximumOptionsSelected) {
                    const optionPrice = optionGroup.type === 'pickable' ? 0 : option.price;
                    data?.optionsSelected?.push({...option, price: optionPrice, quantity: 1});
                  }
                }
                // console.log('data?.optionsSelected', data?.optionsSelected);
                updateTotalDishAmount(quantity);
                return !optionAlreadySelected && !maximumOptionsSelected;
              }}
            />
            <Card style={{marginTop: 20}}>
              <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>Observações</Text>
              <TextField
                onChangeText={setObs}
                placeholder="Ex: Um sem cebola e outro sem tomate."
              />
            </Card>
            <AddToBasketForm updateTotalDishAmount={(qtd) => updateTotalDishAmount(qtd)} />
          </Animated.ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.addToBasketButtonContainer}>
          <Button
            childrenContainerStyle={styles.addToBasketButton}
            onPress={onAddToBasketButtonPressed}>
            <Text style={styles.addToBasketButtonText}>
              Adicionar - {formatCurrency(totalPrice)}
            </Text>
          </Button>
        </View>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              backgroundColor: background,
            },
          ]}>
          <Text style={styles.headerTitle}>{data.name}</Text>
        </Animated.View>
      </View>
      {/*<BasketSummary />*/}
    </SafeAreaView>
  );
};

export default DishDetails;
