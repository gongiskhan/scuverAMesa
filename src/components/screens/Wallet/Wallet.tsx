import {Button, Card, Icon, Text} from '@src/components/elements';
import * as React from 'react';
import {I18nManager, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import {useEffect, useState} from "react";
import {User} from "@src/models/user";
import {UserService} from "@src/services/user.service";
import {OrderService} from "@src/services/order.service";
import {formatCurrency} from "@src/utils/number-formatter";

const Wallet: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    UserService.getCurrentUser().then(u => {
      setUser(u);
    });
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={{
        textAlign: 'center',
        fontSize: 35,
        color: '#666',
        textShadowColor: '#000',
        textShadowRadius: 1,
        margin: 30,
        marginTop: 50
      }}>Carteira: {formatCurrency(user?.wallet || 0)}</Text>
      <Card title="Carregar a Carteira">
        <Text style={{textAlign: 'justify', margin: 10, marginTop: 20}}>
          Carregue a sua carteira para efetuar pedidos no Scuver, seja no estabelecimento ou na aplicação de entregas.
        </Text>
        <Button
          isFullWidth={true}
          style={{flex: 1, flexDirection: 'row'}}
        >
          <Image source={require('../../../assets/app/mbway-logo.png')} style={{}}/>
          <Text style={{textAlignVertical: 'center'}}>MBWAY</Text>
        </Button>
        <Text>
          Cartão de Crédito
        </Text>
        <Text>
          MBWAY
          Sabe que pode utilizar o seu cartão de refeição com o MBWAY? https://www.mbway.pt/cartoes-refeicao
        </Text>
        <Text>
          Ref. Multibanco
        </Text>
        <Text>
          Débito Direto
        </Text>
      </Card>
    </SafeAreaView>
  );
};

export default Wallet;
