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
import HeadingInformation from './HeadingInformation';
import AddToBasketForm from './AddToBasketForm';
import {formatCurrency} from '@src/utils/number-formatter';
import styles from './styles';
import {useEffect, useState} from "react";
import {Item} from "@src/models/item";
import {OptionGroupService} from "@src/services/option-group.service";
import {Option} from "@src/models/option";
import {DishSection} from "@src/data/mock-places";
import OptionGroups from "@src/components/screens/DishDetails/OptionGroups";
import {OrderOption} from "@src/models/order-option";
const faker = require('faker');

type DishDetailsProps = {
  route: Route<any>
};

export const DishDetails: React.FC<DishDetailsProps> = ({route}) => {

  const [totalPrice, setTotalPrice] = useState(0);
  const [data, setData]: any = useState({});

  const [selectedOptionGroups, setSelectedOptionGroups] = React.useState<Item[]>(
    [],
  );
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
          setData(d);
        }
      });
    });
  }, []);

  const addOptionGroupToBasket = React.useCallback(
    (dish: Item) => {
      const existedDishIndex = selectedOptionGroups.find(
        (item: Item) => item.id === dish.id,
      );
      if (existedDishIndex) {
        setSelectedOptionGroups(
          selectedOptionGroups.filter((item: Item) => item.id !== dish.id),
        );
        setTotalPrice(data?.price - existedDishIndex.price);
      } else {
        setSelectedOptionGroups([...selectedOptionGroups, dish]);
        setTotalPrice(totalPrice + dish.price);
      }
    },
    [selectedOptionGroups, totalPrice],
  );

  const updateTotalDishAmount = React.useCallback(
    (amount: number) => {
      const totalSelectedDishPrice = selectedOptionGroups.reduce(
        (prevValue, currentValue) => prevValue + currentValue.price,
        0,
      );
      setTotalPrice(
        parseFloat(data.price) * amount + totalSelectedDishPrice,
      );
    },
    [selectedOptionGroups],
  );

  const onAddToBasketButtonPressed = () => {


    console.log('ON ADD PRESSED');

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
            <OptionGroups
              data={data}
              addOptionToBasket={(option, optionGroup) => {
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
                if(optionGroup.amountOptionsRequired && (optionsFromThisGroupSelected >= optionGroup.amountOptionsRequired)) {
                  maximumOptionsSelected = true;
                }
                if (optionAlreadySelected) {
                  data?.optionsSelected?.splice(data?.optionsSelected?.find((o: any) => o.name === option.name), 1);
                } else {
                  if(!maximumOptionsSelected) {
                    data?.optionsSelected?.push({...option, quantity: 1});
                  }
                }
                return !optionAlreadySelected && !maximumOptionsSelected;
              }}
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
