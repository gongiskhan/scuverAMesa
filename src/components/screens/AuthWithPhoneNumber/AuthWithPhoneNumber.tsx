import * as React from 'react';
import {SafeAreaView, View, ScrollView, Alert} from 'react-native';
import {Text, TextField, Button, Dialog} from '@src/components/elements';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {AuthService} from "@src/services/auth.service";

type AuthWithPhoneNumberProps = {};

const AuthWithPhoneNumber: React.FC<AuthWithPhoneNumberProps> = () => {
  const navigation = useNavigation();
  const {card} = useThemeColors();
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const _onPhoneNumberFieldChange = (value: string) => {
    setPhoneNumber(value);
  };

  const _hideModal = () => {
    setIsModalVisible(false);
  };

  const _onNextButtonPressed = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Por favor insira o seu número de telemóvel!');
      return;
    }
    setIsModalVisible(true);
  };
  const _onConfirmButtonPressed = () => {
    AuthService.askPhoneCode(phoneNumber).then(() => {
      navigation.navigate('AuthVerificationCodeScreen');
      _hideModal();
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text isBold isHeadingTitle>
            Introduza o seu número de telemóvel
          </Text>
          <Text isSecondary hasMargin>
            Por favor introduza o seu número de telemóvel para efetuar o login.
          </Text>
          <TextField
            style={[{backgroundColor: card}, styles.phoneNumberTextField]}
            value={phoneNumber}
            onChangeText={_onPhoneNumberFieldChange}
            hasMargin
            placeholder="Número de telemóvel"
            keyboardType="phone-pad"
            autoFocus
          />
        </View>
        <Button isFullWidth onPress={_onNextButtonPressed}>
          <Text isBold>Continuar</Text>
        </Button>
      </ScrollView>
      <Dialog isVisible={isModalVisible} onBackdropPress={_hideModal}>
        <Text isCenter>Entrar com número de telemóvel</Text>
        <Text isHeadingTitle isCenter isBold style={styles.phoneNumberText}>
          {phoneNumber}
        </Text>
        <Text isCenter>
          Iremos enviar um código de autenticação para o número que nos indicou.
        </Text>
        <Text isCenter>Quer continuar?</Text>
        <View style={styles.confirmButtonContainer}>
          <Button isFullWidth onPress={_onConfirmButtonPressed}>
            <Text isBold>Sim</Text>
          </Button>
        </View>
        <View style={styles.cancelButtonContainer}>
          <Button isFullWidth isTransparent onPress={_hideModal}>
            <Text>Não</Text>
          </Button>
        </View>
      </Dialog>
    </SafeAreaView>
  );
};

export default AuthWithPhoneNumber;
