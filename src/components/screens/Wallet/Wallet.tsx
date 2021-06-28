import {Card, Text} from '@src/components/elements';
import * as React from 'react';
import {I18nManager} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';

const Wallet: React.FC = () => {
  return (
    <SafeAreaView style={styles.root}>
      <Text>Carteira: €30.00</Text>
      <Card title="Carregar a Carteira">
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
