import * as React from 'react';
import {
  Container,
  Icon,
  Divider,
  SearchBar,
  Button,
  Text,
} from '@src/components/elements';
import {
  ScrollView,
  Image,
  View,
  Alert,
  AlertButton,
  I18nManager,
} from 'react-native';
import ListRowItem from '@src/components/elements/List/ListRowItem';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {AuthService} from "@src/services/auth.service";
import {UserService} from "@src/services/user.service";
import {useEffect, useState} from "react";
import {User} from "@src/models/user";

type AccountProps = {};

const Account: React.FC<AccountProps> = () => {

  const navigation = useNavigation();
  const chevronIconName = I18nManager.isRTL ? 'chevron-left' : 'chevron-right';

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    UserService.observeCurrentUser().subscribe((u: User) => setUser(u));
  });

  const alertButtons: AlertButton[] = [
    {
      text: 'Não',
      style: 'cancel',
    },
    {text: 'Sim', onPress: () => {
      AuthService.signOut().then(() => {
        console.log('Logged out. Navigating to Home.');
        navigation.navigate('HomeScreen');
      });
    }},
  ];

  const onLogoutButtonPressed = () => {
    Alert.alert('Confirmar', 'Tem  a certeza que quer sair/logout?', alertButtons);
  };

  return (
    <ScrollView>
      <Divider />
      {user && <Container>
          <ListRowItem
              title={user?.name || 'Anónimo'}
              subTitle="Editar Perfil"
              onPress={() => navigation.navigate('EditProfileScreen')}
              leftIcon={
                user?.photoUrl ?
                  <Image source={{uri: user?.photoUrl}} style={styles.profileAvatar}/> :
                  <Image source={require('../../../assets/profile/avatar.png')} style={styles.profileAvatar}/>
              }
              rightIcon={<Icon name={chevronIconName}/>}
          />
      </Container>
      }
      {/*<Container style={styles.accountMenuItemContainer}>*/}
      {/*  <Divider />*/}
      {/*  <Divider />*/}
      {/*  <ListRowItem*/}
      {/*    title="Order History"*/}
      {/*    onPress={() => navigation.navigate('OrderHistoryScreen')}*/}
      {/*    rightIcon={<Icon name={chevronIconName} />}*/}
      {/*  />*/}
      {/*  <Divider />*/}
      {/*  <ListRowItem*/}
      {/*    title="Delivery Address"*/}
      {/*    onPress={() => navigation.navigate('SavedAddressesScreen')}*/}
      {/*    rightIcon={<Icon name={chevronIconName} />}*/}
      {/*  />*/}
      {/*  <Divider />*/}
      {/*  <ListRowItem*/}
      {/*    title="Settings"*/}
      {/*    onPress={() => navigation.navigate('SettingsScreen')}*/}
      {/*    rightIcon={<Icon name={chevronIconName} />}*/}
      {/*  />*/}
      {/*  <Divider />*/}

      {/*  <ListRowItem*/}
      {/*    title="Support Center"*/}
      {/*    onPress={() => navigation.navigate('SupportCenterScreen')}*/}
      {/*    rightIcon={<Icon name={chevronIconName} />}*/}
      {/*  />*/}
      {/*  <Divider />*/}
      {/*  <ListRowItem*/}
      {/*    title="Share Feedback"*/}
      {/*    rightIcon={<Icon name={chevronIconName} />}*/}
      {/*  />*/}
      {/*</Container>*/}
      {
        user ? (
          <View style={{...styles.buttonContainer, marginTop: 20}}>
            <Button isFullWidth onPress={onLogoutButtonPressed}>
              <Text isBold style={{color: 'white'}}>
                Sair / Logout
              </Text>
            </Button>
          </View>
        ) : <View style={{...styles.buttonContainer, marginTop: 20}}>
          <Button isFullWidth onPress={() => {
            // AuthService.askPhoneCode('936256983');
            navigation.navigate('Auth');
          }}>
            <Text isBold style={{color: 'white'}}>
              Login
            </Text>
          </Button>
        </View>
      }
    </ScrollView>
  );
};

export default Account;
