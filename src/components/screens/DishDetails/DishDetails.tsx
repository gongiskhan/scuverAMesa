import * as React from 'react';
import {
  Animated,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTheme, useNavigation, Route} from '@react-navigation/native';
import {Text, Button} from '@src/components/elements';
import CartContext from '@src/context/cart-context';
import HeadingInformation from './HeadingInformation';
import SideDishes from './SideDishes';
import AddToBasketForm from './AddToBasketForm';
import {formatCurrency} from '@src/utils/number-formatter';
import styles from './styles';
import {useEffect, useState} from "react";
import {Item} from "@src/models/item";
const faker = require('faker');

type DishDetailsProps = {
  route: Route<any>
};

export const DishDetails: React.FC<DishDetailsProps> = ({route}) => {

  const [totalPrice, setTotalPrice] = useState(0);
  const [data, setData]: any = useState({});

  const [selectedSideDishes, setSelectedSideDishes] = React.useState<Item[]>(
    [],
  );
  const [scrollY] = React.useState(new Animated.Value(0));
  const {
    colors: {background},
  } = useTheme();
  const {goBack} = useNavigation();
  const {updateCartItems} = React.useContext(CartContext);

  useEffect(() => {
    // console.log('data', (route.params as any).data);
    const d = (route.params as any).data;
    d.sideDishes = [
      {
        title: 'Cake',
        data: Array(5)
          .fill(0)
          .map((_) => ({
            id: faker.random.uuid(),
            title: faker.commerce.productName(),
            description: faker.lorem.lines(2),
            price: faker.commerce.price(2, 10),
            image: require('@src/assets/dish-details/dish-1.jpg'),
          })),
      }];
    setData((route.params as any).data as Item);
  }, []);

  const addSideDishToBasket = React.useCallback(
    (dish: Item) => {
      const existedDishIndex = selectedSideDishes.find(
        (item: Item) => item.id === dish.id,
      );
      if (existedDishIndex) {
        setSelectedSideDishes(
          selectedSideDishes.filter((item: Item) => item.id !== dish.id),
        );
        setTotalPrice(data?.price - existedDishIndex.price);
      } else {
        setSelectedSideDishes([...selectedSideDishes, dish]);
        setTotalPrice(totalPrice + dish.price);
      }
    },
    [selectedSideDishes, totalPrice],
  );

  const updateTotalDishAmount = React.useCallback(
    (amount: number) => {
      const totalSelectedDishPrice = selectedSideDishes.reduce(
        (prevValue, currentValue) => prevValue + currentValue.price,
        0,
      );
      setTotalPrice(
        parseFloat(data.price) * amount + totalSelectedDishPrice,
      );
    },
    [selectedSideDishes],
  );

  const onAddToBasketButtonPressed = () => {
    updateCartItems(
      [
        {
          dish: data,
          sideDishes: selectedSideDishes,
        },
      ],
      totalPrice,
    );
    goBack();
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
            <SideDishes
              data={data}
              addSideDishToBasket={() => {}}
            />
            <AddToBasketForm updateTotalDishAmount={updateTotalDishAmount} />
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
    </SafeAreaView>
  );
};

export default DishDetails;
