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
      {/*<Card style={{*/}
      {/*  width: 500,*/}
      {/*  height: 500,*/}
      {/*  justifyContent: 'space-between',*/}
      {/*}}>*/}
      {/*  <Text>JBLSKJBLSKJSBLJKSBSJBSLJSHB</Text>*/}
      {/*  <View style={{*/}
      {/*    width: 100,*/}
      {/*    height: 100,*/}
      {/*  }}>*/}
      {/*    <Text>TEXT</Text>*/}
      {/*  </View>*/}
      {/*  <View style={{*/}
      {/*    width: 100,*/}
      {/*    height: 100,*/}
      {/*  }}>*/}
      {/*    <Text>TEXT</Text>*/}
      {/*  </View>*/}
      {/*  <View style={{*/}
      {/*    width: 100,*/}
      {/*    height: 100,*/}
      {/*  }}>*/}
      {/*    <Text>TEXT</Text>*/}
      {/*  </View>*/}
      {/*</Card>*/}
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
      <Card style={{height: 250}}>
        <Container style={{height: '100%', flexWrap: 'wrap', alignItems: 'baseline', flexDirection: 'column', justifyContent: 'space-between'}}>
          <View style={{flex: 5, flexDirection: 'row', flexShrink: 1, justifyContent: 'space-around'}}>
            <Image source={require('../../../assets/app/mbway.png')} style={{flex: 1, resizeMode: 'contain', flexShrink: 1, width: 100, height: 100}}/>
            <Image source={require('../../../assets/app/mbref.png')} style={{flex: 1, resizeMode: 'contain',  flexShrink: 1, width: 100, height: 100}}/>
          </View>
          <View style={{width: '100%', flex: 3, flexGrow: 2, flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'flex-end'}}>
            <Button
              onPress={chargeMBWAY}
            >
              <Text style={{color: '#fff', fontSize: 18}}>Usar MBWAY</Text>
            </Button>
            <Button
              onPress={chargeMBREF}
            >
              <Text style={{color: '#fff', fontSize: 18}}>Usar Ref. MB</Text>
            </Button>
          </View>
          <View style={{width: '100%', marginTop: 40,flex: 2, flexDirection: 'column', alignItems: 'flex-end'}}>
            <Text style={{alignSelf: 'flex-end'}}>
              Sabe que pode utilizar o seu cartão de refeição com o MBWAY? <Link target={'_blank'} to={'//www.mbway.pt/cartoes-refeicao'}>https://www.mbway.pt/cartoes-refeicao</Link>
            </Text>
          </View>
        </Container>
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
