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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    UserService.observeCurrentUser().subscribe(u => {
      setUser(u);
      // EasypayService.getEasypayPaymentMbDetailsForUser(u.uid).then(d => setMBDetails(d.method));
    });
  }, []);

  const chargeMBWAY = () => {
    setLoading(true);
    EasypayService.createEasypayPayment(user, UIDGenerator.generate(), Number(amount), 'mbw').then(r => {
      if (r.ok) {
        Alert.alert('Informação', `Foi enviado um pedido mbway para ${user?.phoneNumber} no valor de ${amount} EUR.`);
      } else {
        Alert.alert('Erro', r.statusText);
      }
      setLoading(false);
    }).catch(err => {
      Alert.alert('Erro', err);
      setLoading(false);
    });
  }

  const chargeMBREF = () => {
    setLoading(true);
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
      setLoading(false);
    }).catch(err => {
      Alert.alert('Erro', err);
      setLoading(false);
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
      <Card>
        <Text style={{textAlign: 'justify', margin: 10, marginTop: 20}}>
          Carregue a sua carteira para efetuar pedidos Scuver, seja no estabelecimento ou na aplicação de entregas.
        </Text>
      </Card>
      <Card style={{height: 300}}>
        <Container style={{
          height: '100%',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <View style={{flex: 5, flexDirection: 'row', flexShrink: 1, justifyContent: 'space-around'}}>
            <Image source={require('../../../assets/app/mbway.png')}
                   style={{flex: 1, resizeMode: 'contain', flexShrink: 1, width: 100, height: 100}}/>
          </View>
          <View style={{flex: 3, flexDirection: 'row', flexShrink: 1, justifyContent: 'space-around'}}>
            <TextField
              autoFocus
              style={{fontSize: 25, flexDirection: 'row'}}
              value={amount}
              onChangeText={a => setAmount(a)}
              placeholder="Valor a Carregar"
              placeholderTextColor={'#ccc'}
              keyboardType="numeric"
            />
          </View>
          <View style={{flex: 2, flexDirection: 'row', flexShrink: 1, justifyContent: 'space-around'}}>
            <Button
              isLoading={loading}
              style={{flex: 2, flexDirection: 'row'}}
              onPress={chargeMBWAY}
            >
              <Text style={{color: '#fff', fontSize: 18}}>Carregar com MBWAY</Text>
            </Button>
          </View>
          <View style={{width: '100%', marginTop: 10, flex: 2, flexDirection: 'row', alignItems: 'flex-end'}}>
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
      <Card style={{height: 230}}>
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
                <Text style={{color: '#555', fontSize: 20}}>Ent.: {mbDetails.entity}</Text>
                <Text style={{color: '#555', fontSize: 20}}>Ref.: {mbDetails.reference}</Text>
                <Text style={{color: '#555', fontSize: 20}}>€: LIVRE</Text>
              </View>
            ) : (
              <View style={{flex: 1, flexDirection: 'row', flexShrink: 1, justifyContent: 'space-around'}}>
                <Button
                  isLoading={loading}
                  style={{flex: 1, flexDirection: 'row'}}
                  onPress={chargeMBREF}
                >
                  <Text style={{color: '#fff', fontSize: 18}}>Gerar Referência Multibanco</Text>
                </Button>
              </View>
            )}
          </View>
          <View style={{width: '100%', marginTop: 10, flex: 2, flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={{alignSelf: 'flex-end'}}>
              Pode demorar até 10 minutos.
            </Text>
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
