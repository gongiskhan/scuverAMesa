import {Button, Card, Container, Text, TextField} from '@src/components/elements';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Alert, Image, Linking, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import {User} from "@src/models/user";
import {UserService} from "@src/services/user.service";
import {formatCurrency} from "@src/utils/number-formatter";
import {EasypayService, EasypayServiceClass} from "@src/services/easypay.service";
import {UIDGenerator} from "@src/utils/uid-generator";
import useThemeColors from "@src/custom-hooks/useThemeColors";

const Wallet: React.FC = () => {

  const {card} = useThemeColors();
  const [user, setUser] = useState<User | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [mbDetails, setMBDetails] = useState<any>(null);
  useEffect(() => {
    UserService.observeCurrentUser().subscribe(u => {
      setUser(u);
      EasypayService.getEasypayPaymentMbDetailsForUser(u.uid).then(d => setMBDetails(d.method));
    });
  }, []);

  const chargeMBWAY = () => {
    EasypayService.createEasypayPayment(user, UIDGenerator.generate(), Number(amount), 'mbw').then(r => {
      if (r.ok) {
        Alert.alert('Informação', `Foi enviado um pedido mbway para ${user?.phoneNumber} no valor de ${amount} EUR.`);
      } else {
        Alert.alert('Erro', r.statusText);
      }
    }).catch(err => {
      Alert.alert('Erro', err);
    });
  }

  const chargeMBREF = () => {
    EasypayService.createEasypayPayment(user, UIDGenerator.generate(), 0, 'mb', 'CreateFrequentPayment').then(r => {
      r.json().then(res => {
        console.log('RRR', res);
      });
      if (r.ok) {
        EasypayService.getEasypayPaymentMbDetailsForUser(user?.uid).then(d => setMBDetails(d.method));
        Alert.alert('Informação', `Utilize a entidade e referência gerados com um valor livre para carregar a sua carteira. Estes dados podem ser utilizados sempre que quiser.`);
      } else {
        Alert.alert('Erro', r.statusText);
      }
    }).catch(err => {
      Alert.alert('Erro', err);
    });
  }

  const openLink = (link) => {
    Linking.openURL(link);
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
          Carregue a sua carteira para efetuar pedidos Scuver, seja no estabelecimento ou na aplicação de entregas.
        </Text>
      </Card>
      <Card style={{padding: 20, paddingVertical: 30}}>
        <Container style={{
          height: '100%',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <View style={{flex: 5, backgroundColor: '#999', flexDirection: 'row', flexShrink: 1, justifyContent: 'space-around'}}>
            <Image source={require('../../../assets/app/mbway.png')}
                   style={{flex: 1, resizeMode: 'contain', flexShrink: 1, width: 100, height: 100}}/>
          </View>
          <Text style={{fontSize: 18, textAlignVertical: "bottom"}}>Valor a carregar:</Text>
          <TextField
            autoFocus
            style={{fontSize: 18, marginLeft: 130, position: 'relative', bottom: 10}}
            value={amount}
            onChangeText={a => setAmount(a)}
            placeholder="Inserir aqui"
            placeholderTextColor={'#ccc'}
            keyboardType="numeric"
          />
          <Button
            onPress={chargeMBWAY}
          >
            <Text style={{color: '#fff', fontSize: 18}}>Carregar com MBWAY</Text>
          </Button>
          <View style={{width: '100%', marginTop: 40, flex: 2, flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={{alignSelf: 'flex-end'}}>
              Sabe que pode utilizar o seu cartão de refeição com o MBWAY?
              <Text onPress={() => {
                Linking.openURL('https://www.mbway.pt/cartoes-refeicao')
              }}>
                <Text style={{alignSelf: 'flex-end'}} isPrimary> https://www.mbway.pt/cartoes-refeicao</Text>
              </Text>
            </Text>
          </View>
        </Container>
      </Card>
      <Card style={{height: 250}}>
        <Container style={{
          height: '100%',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <View style={{flex: 5, flexDirection: 'row', flexShrink: 1, justifyContent: 'space-around'}}>
            <Image source={require('../../../assets/app/mbref.png')}
                   style={{flex: 1, resizeMode: 'contain', flexShrink: 1, width: 100, height: 100}}/>
          </View>
          <View style={{
            width: '100%',
            flex: 3,
            flexGrow: 2,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignSelf: 'flex-end'
          }}>
            {mbDetails ? (
              <View>
                <Text style={{color: '#555', fontSize: 16}}>Ent.: {mbDetails.entity}</Text>
                <Text style={{color: '#555', fontSize: 16}}>Ref.: {mbDetails.reference}</Text>
                <Text style={{color: '#555', fontSize: 16}}>€: LIVRE</Text>
              </View>
            ) : (<Button
              onPress={chargeMBREF}
            >
              <Text style={{color: '#fff', fontSize: 18}}>Gerar Referência Multibanco</Text>
            </Button>)}
          </View>
        </Container>
      </Card>
      {/*<Card>*/}
      {/*  <Text>*/}
      {/*    Cartão de Crédito*/}
      {/*  </Text>*/}
      {/*</Card>*/}
    </SafeAreaView>
  );
};

export default Wallet;
