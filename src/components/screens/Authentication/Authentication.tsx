import * as React from 'react';
import {View, Image} from 'react-native';
import {Container, Text, Button} from '@src/components/elements';
import AuthContext from '@src/context/auth-context';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {AuthService} from "@src/services/auth.service";

type AuthenticationProps = {};

const Authentication: React.FC<AuthenticationProps> = () => {
  const navigation = useNavigation();
  const {primary} = useThemeColors();
  const {signIn} = React.useContext(AuthContext);

  const _onConnectWithPhoneNumberButtonPressed = () => {
    navigation.navigate('AuthWithPhoneNumberScreen');
  };
  const _onFacebookConnectButtonPressed = () => {
    AuthService.signInWithGoogle().then(u => {

    });
  };
  const _onGoogleConnectButtonPressed = () => {
    AuthService.signInWithGoogle().then(u => {
      console.log('_onGoogleConnectButtonPressed', u);
      navigation.navigate('Home');
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: primary,
        },
      ]}>
      <View style={styles.appIconContainer}>
        <Image
          source={require('../../../assets/app/app_icon.png')}
          style={styles.appIcon}
        />
      </View>
      <Container style={styles.loginMethodContainer}>
        <Text isBold isHeadingTitle>
          As suas refeições evoluiram
        </Text>
        <Text isSecondary style={styles.introductionText}>
          Com o Scuver à Mesa vai poder usufrir das suas refeições
          mais comodamente. Experimente!
        </Text>
        <View style={styles.loginMethod}>
          <Button
            style={styles.button}
            isFullWidth
            onPress={_onConnectWithPhoneNumberButtonPressed}>
            <Text isBold isWhite>
              Utilize o seu Número de Telefone
            </Text>
          </Button>
          <Button
            style={styles.button}
            backgroundColor="#4267b2"
            isFullWidth
            onPress={_onFacebookConnectButtonPressed}>
            <Text isBold isWhite>
              Utilize a sua conta Facebook
            </Text>
          </Button>
          <Button
            style={styles.button}
            backgroundColor="#4285F3"
            isFullWidth
            onPress={_onGoogleConnectButtonPressed}>
            <Text isBold isWhite>
              Utilize a sua conta Google
            </Text>
          </Button>
        </View>
      </Container>
    </View>
  );
};

export default Authentication;
