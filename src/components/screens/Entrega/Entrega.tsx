import {Button, Card, Text} from '@src/components/elements';
import * as React from 'react';
import {I18nManager, Image, Linking, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import {Link} from "@react-navigation/native";
import {useEffect, useState} from "react";

const gotoScuver = () => {
  Linking.openURL('http://scuver.pt');
}

const Entrega: React.FC = () => {

  return (
    <SafeAreaView style={styles.root}>
      <Image
        style={styles.stretch}
        source={require('../../../assets/app/fyer_scuver_A5_AF_.png')}/>
      <Button style={{ marginTop: '5%', width: '80%', marginLeft: '10%' }} onPress={gotoScuver}>
        <Text style={{color: 'white'}}>Ir para Entregas Scuver</Text>
      </Button>
    </SafeAreaView>
  );
};

export default Entrega;
