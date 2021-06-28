import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HomeStack from '../Stacks/HomeStack';
import AccountStack from '../Stacks/AccountStack';
import NotificationStack from '../Stacks/NotificationStack';
import ActivityHistoryStack from '../Stacks/ActivityHistoryStack';
import Documentation from '@src/components/screens/Documentation';
import Wallet from "@src/components/screens/Wallet/Wallet";
import Entrega from "@src/components/screens/Entrega";

type TabNavigationProps = {};
type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};
const Tab = createBottomTabNavigator();
const {Navigator} = Tab;

const renderTabBarIcon = (routeName: string) => {
  return (props: TabBarIconProps) => {
    const {color} = props;
    let iconName = 'home';
    switch (routeName) {
      case 'Restaurantes':
        iconName = 'utensils';
        break;
      case 'Histórico':
        iconName = 'history';
        break;
      case 'Entrega':
        iconName = 'motorcycle';
        break;
      case 'Conta':
        iconName = 'user';
        break;
      case 'Carteira':
        iconName = 'wallet';
        break;
      default:
        break;
    }
    return <Icon name={iconName} solid size={24} color={color} />;
  };
};

const TabNavigation: React.FC<TabNavigationProps> = () => {
  return (
    <Navigator
      initialRouteName="Explore"
      screenOptions={(props) => {
        const {
          route: {name: routeName},
        } = props;
        return {
          tabBarIcon: renderTabBarIcon(routeName),
        };
      }}>
      <Tab.Screen name="Restaurantes" component={HomeStack} />
      <Tab.Screen name="Histórico" component={ActivityHistoryStack} />
      <Tab.Screen name="Carteira" component={Wallet} />
      <Tab.Screen name="Conta" component={AccountStack} />
      <Tab.Screen name="Entrega" component={Entrega} />
    </Navigator>
  );
};

export default TabNavigation;
