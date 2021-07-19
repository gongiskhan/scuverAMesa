import * as React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Button, Icon, Text} from '@src/components/elements';
import Home from '@src/components/screens/Home';
import ShopDetails from '@src/components/screens/ShopDetails';
import PlaceList from '@src/components/screens/PlaceList';
import Checkout from '@src/components/routes/Stacks/CheckoutStack';
import styles from './styles';
import {ScreenNavigationProps} from '../types';
import {useEffect, useState} from "react";
import {Shop} from "@src/models/shop";
import {ShopService} from "@src/services/shop.service";

type HomeStackProps = {} & ScreenNavigationProps;
type HomeStackParamList = {
  HomeScreen: undefined;
  ShopDetailsScreen: undefined;
  CheckoutScreen: undefined;
  PlaceListScreen: {
    title?: string;
  };
};
const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack: React.FC<HomeStackProps> = ({navigation}) => {

  const [onShop, setOnShop] = useState<Shop | null>(null);

  useEffect(() => {
    ShopService.getOnShop().subscribe(onShop => {
      setOnShop(onShop);
    });
  }, []);

  const _renderExploreHeaderTitle = () => {
    return (
      <View style={styles.headerLeftContainer}>
        <Icon
          name="map-marker-alt"
          size={18}
          style={styles.locationIcon}
          isPrimary
        />
        {onShop ? (
          <Text style={styles.headerTitle}>Está em {onShop.name}</Text>
        ): (
          <Text style={styles.headerTitle}>Não há restaurantes Scuver a menos de 50m.</Text>
        )}
      </View>
    );
  };

  const _renderExploreHeaderRight = () => {
    return onShop ? (
      <Icon
        name="chevron-right"
        size={22}
        isPrimary
        onPress={() => {
          ShopService.setCurrentShop(onShop.uid).then(() => {
            navigation.navigate('ShopDetailsScreen');
          });
        }}
      />
    ) : null;
  };

  const _renderPlaceDetailHeaderRight = () => {
    return (
      <Button
        isTransparent
        onPress={() => navigation.navigate('SearchDishesModal')}>
        <Icon name="md-search" size={22} isPrimary useIonicons />
      </Button>
    );
  };

  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        options={() => {
          return {
            headerShown: true,
            headerTitle: _renderExploreHeaderTitle,
            title: 'Restaurantes Scuver',
            headerTitleAlign: 'left',
            headerRight: _renderExploreHeaderRight,
            headerRightContainerStyle: styles.headerRightContainer,
          };
        }}
        name="HomeScreen"
        component={Home}
      />
      <Stack.Screen
        options={() => {
          return {
            headerShown: true,
            // headerTitle: _renderExploreHeaderTitle,
            title: '',
            // headerTitleAlign: 'left',
            // headerRight: _renderExploreHeaderRight,
            // headerRightContainerStyle: styles.headerRightContainer,
          };
        }}
        name="ShopDetailsScreen"
        component={ShopDetails}
      />
      <Stack.Screen
        options={({route: {params}}) => {
          return {
            headerTitle: params?.title || 'Places',
          };
        }}
        name="PlaceListScreen"
        component={PlaceList}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="CheckoutScreen"
        component={Checkout}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
