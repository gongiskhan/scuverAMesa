import {Button, Card, Container, Icon, Text, TextField} from '@src/components/elements';
import * as React from 'react';
import {I18nManager, Image, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import {useEffect, useState} from "react";
import {User} from "@src/models/user";
import {UserService} from "@src/services/user.service";
import {OrderService} from "@src/services/order.service";
import {formatCurrency} from "@src/utils/number-formatter";
import {EasypayService} from "@src/services/easypay.service";
import {UIDGenerator} from "@src/utils/uid-generator";
import useThemeColors from "@src/custom-hooks/useThemeColors";
import {Link} from "@react-navigation/native";

const Wallet: React.FC = () => {

  const {card} = useThemeColors();
  const [user, setUser] = useState<User | null>(null);
  const [amount, setAmount] = useState<string>('');
  useEffect(() => {
    UserService.getCurrentUser().then(u => {
      setUser(u);
    });
  }, []);

  const chargeMBWAY = () => {
    EasypayService.createEasypayPayment(user, UIDGenerator.generate(), Number(amount), 'mbw').then(r => {
      console.log('R', r);
    });
  }
  const chargeMBREF = () => {
    EasypayService.createEasypayPayment(user, UIDGenerator.generate(), Number(amount), 'mb').then(r => {
      console.log('R', r);
    });
  }

  return (
    <SafeAreaView style={styles.root}>
      <Container style={{backgroundColor: 'transparent'}}>
        <Text style={{
          textAlign: 'center',
          fontSize: 35,
          color: '#666',
          textShadowColor: '#000',
          textShadowRadius: 1,
          margin: 30,
          marginTop: 50
        }}>Carteira: {formatCurrency(user?.wallet || 0)}</Text>
      </Container>
      <Card title="Carregar a Carteira">
        <Text style={{textAlign: 'justify', margin: 10, marginTop: 20}}>
          Carregue a sua carteira para efetuar pedidos no Scuver, seja no estabelecimento ou na aplicação de entregas.
        </Text>
      </Card>
      <Card style={{padding: 20, paddingVertical: 30}}>
        <Text style={{fontSize: 18, textAlignVertical: "bottom"}}>Valor a carregar:</Text>
        <TextField
          autoFocus
          style={{fontSize: 18, marginLeft: 130, position:'relative', bottom: 10}}
          value={amount}
          onChangeText={a => setAmount(a)}
          placeholder="Inserir aqui"
          placeholderTextColor={'#ccc'}
          keyboardType="numeric"
        />
      </Card>
      <Card style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image source={require('../../../assets/app/mbwayeref.png')} style={{ marginBottom: 20, marginLeft: 62}} height={100} width={200}/>
        <Button
          onPress={chargeMBREF}
          style={{flex: 0, flexDirection: 'row'}}
        >
          <Text style={{textAlignVertical: 'center', color: '#fff'}}>Usar MBWAY</Text>
        </Button>
        <Button
          onPress={chargeMBWAY}
          style={{flex: 0, flexDirection: 'row'}}
        >
          <Text style={{textAlignVertical: 'center', color: '#fff'}}>Usar MBWAY</Text>
        </Button>
        <Text>
          Sabe que pode utilizar o seu cartão de refeição com o MBWAY? <Link target={'_blank'} to={'//www.mbway.pt/cartoes-refeicao'}>https://www.mbway.pt/cartoes-refeicao</Link>
        </Text>
      </Card>
      <Card>
        <Text>
          Cartão de Crédito
        </Text>
      </Card>
    </SafeAreaView>
  );
};

export default Wallet;
