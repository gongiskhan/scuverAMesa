import * as React from 'react';
import {Container, TextField, Text, Button} from '@src/components/elements';
import {Profile} from '@src/data/mock-profile';
import styles from './styles';
import {User} from "@src/models/user";
import {UserService} from "@src/services/user.service";
import {useEffect, useState} from "react";
import {Alert} from "react-native";

const ContactInformationForm: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);
  const [userCopy, setUserCopy] = useState<User | null>(null);

  useEffect(() => {
    UserService.getCurrentUser().subscribe(u => {
      console.log('u', u);
      setUser(u);
      setUserCopy(u);
    });
  }, []);

  const saveUser = () => {
    console.log('user', user);
    if (user) {
      UserService.updateUser(user).then(() => Alert.alert('Dados guardados.'));
    }
  }

  return (
    <Container style={styles.container}>
      <TextField
        placeholder={'Nome'}
        textContentType="name"
        hasMargin
        placeholderTextColor={'#999'}
        defaultValue={userCopy?.name}
        onChangeText={text => setUser({...user, name: text} as User)}
      />
      <TextField
        placeholder={'Número de Telefone'}
        textContentType="telephoneNumber"
        hasMargin
        placeholderTextColor={'#999'}
        keyboardType="numeric"
        defaultValue={userCopy?.phoneNumber}
        onChangeText={text => {
          console.log('text', text);
          setUser({...user, phoneNumber: text} as User);
          console.log('user', user);
        }}
      />
      <TextField
        placeholder={'Email'}
        placeholderTextColor={'#999'}
        textContentType="emailAddress"
        hasMargin
        defaultValue={userCopy?.email}
        onChangeText={text => setUser({...user, email: text} as User)}
      />
      {/*<Text isSecondary style={styles.note}>*/}
      {/*  Communications and transaction history will be sent to this email*/}
      {/*  address*/}
      {/*</Text>*/}
      <Button onPress={saveUser}>
        <Text isWhite isBold>
          Save
        </Text>
      </Button>
    </Container>
  );
};
export default ContactInformationForm;
