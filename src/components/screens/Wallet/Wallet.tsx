import {Button, Card, Container, Icon, Text, TextField} from '@src/components/elements';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Alert, Image, Linking, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import {User} from "@src/models/user";
import {UserService} from "@src/services/user.service";
import {formatCurrency} from "@src/utils/number-formatter";
import {EasypayService, EasypayServiceClass} from "@src/services/easypay.service";
import {UIDGenerator} from "@src/utils/uid-generator";
import useThemeColors from "@src/custom-hooks/useThemeColors";
import {Link} from "@react-navigation/native";
import {MyposService} from "@src/services/mypos.service";

const Wallet: React.FC = () => {

  const {card} = useThemeColors();
  const [user, setUser] = useState<User | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [mbDetails, setMBDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    UserService.observeCurrentUser().subscribe(u => {
      setUser(u);
      EasypayService.getEasypayPaymentMbDetailsForUser(u.uid).then(d => setMBDetails(d.method));
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

  const chargeCard = () => {
    setLoading(true);
    MyposService.getAuthToken().then(token => {
      MyposService.getPaymentLink(token as any as string, user, UIDGenerator.generate(), Number(amount)).then((url) => {
        setLoading(false);
        Linking.openURL(url as any as string);
      }).catch(err => {
        Alert.alert('Erro', err);
      });
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
    <ScrollView style={styles.root}>
      <Card style={{
        marginTop: 40,
        backgroundColor: 'transparent'
      }}>
        <Text style={{textAlign: 'justify'}}>
          Carregue a sua carteira para efetuar pedidos Scuver, seja no estabelecimento ou na aplicação de entregas.
          {'\n\r'}
          Se pretender um reembolso por favor envie um e-mail para <Link style={{color: '#209c94'}} to={'mailto:scuverpt@gmail.com'}>scuverpt@gmail.com</Link>
        </Text>
      </Card>
      <Container style={{backgroundColor: 'transparent'}}>
        <Text style={{
          textAlign: 'center',
          fontSize: 35,
          color: '#EB9F12',
          textShadowColor: 'white',
          textShadowRadius: 1,
          margin: 15,
          marginTop: 5
        }}>Carteira: {formatCurrency(user?.wallet || 0)}</Text>
      </Container>
      <Card style={{height: 250}}>
        <Container style={{
          height: '100%',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <View style={{flex: 3, flexDirection: 'row', flexShrink: 1, justifyContent: 'space-around'}}>
            <Image source={require('../../../assets/app/mbway.png')}
                   style={{flex: 1, resizeMode: 'contain', flexShrink: 1, width: 100, height: 100}}/>
          </View>
          <View style={{flex: 1, width: '100%', flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between'}}>
            <TextField
              autoFocus
              style={{flex: 2, fontSize: 25, flexGrow: 2, marginRight: 20}}
              onChangeText={a => setAmount(a)}
              placeholder="Valor"
              placeholderTextColor={'#ccc'}
              keyboardType="numeric"
              leftIcon={'euro-sign'}
            />
            <Button
              isLoading={loading}
              style={{flex: 1, marginLeft: 20, flexDirection: 'row', height: 44}}
              onPress={chargeMBWAY}
            >
              <Text style={{color: '#fff', fontSize: 18}}>Carregar</Text>
            </Button>
          </View>
          {/*<View style={{flex: 2, flexDirection: 'row', flexShrink: 1, justifyContent: 'space-around'}}>*/}

          {/*</View>*/}
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
      <Card style={{height: 100}}>
        <Container style={{
          height: '100%',
          flexDirection: 'column'
        }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={{fontWeight: "bold"}}>Cartão de Débito / Crédito</Text>
          </View>
          {/*<View style={{flex: 2, flexDirection: 'row'}}>*/}
          {/*  <Image source={require('../../../assets/app/card-logo.png')}*/}
          {/*         style={{flex: 1, resizeMode: 'contain', flexShrink: 1, width: 100, height: 100}}/>*/}
          {/*</View>*/}
          <View style={{flex: 1, width: '100%', flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between'}}>
            <TextField
              style={{flex: 2, fontSize: 25, flexGrow: 2, marginRight: 20}}
              onChangeText={a => setAmount(a)}
              placeholder="Valor"
              placeholderTextColor={'#ccc'}
              keyboardType="numeric"
              leftIcon={'euro-sign'}
            />
            <Button
              isLoading={loading}
              style={{flex: 1, marginLeft: 20, flexDirection: 'row', height: 44}}
              onPress={chargeCard}
            >
              <Text style={{color: '#fff', fontSize: 18}}>Carregar</Text>
            </Button>
          </View>
        </Container>
      </Card>
    </ScrollView>
  );
};

export default Wallet;
