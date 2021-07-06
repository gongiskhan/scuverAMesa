import * as React from 'react';
import {View, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {Container, Text, Button, Dialog} from '@src/components/elements';
import styles from './styles';
import {OrderService} from "@src/services/order.service";
import {OrderHelper} from "@src/utils/order-helper";

type OrderSuccessModalProps = {
  isVisible: boolean;
  setIsVisble: (value: React.SetStateAction<boolean>) => void;
};

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isVisible,
  setIsVisble,
}) => {
  const navigation = useNavigation();
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const fadeOut = React.useRef(new Animated.Value(1)).current;
  const [isAnimationFinished, setIsAnimationFinished] = React.useState(false);
  React.useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: isAnimationFinished ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeOut, {
      toValue: isAnimationFinished ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isAnimationFinished, fadeIn, fadeOut]);

  const _onAnimationFinish = () => {
    setIsAnimationFinished(true);
  };

  const _onBackdropPress = () => {
    setIsVisble(false);
    setIsAnimationFinished(false);
  };

  const _onOrderSomethingElseButtonPressed = () => {
    OrderHelper.buildNewOrder().then((o: any) => {
      OrderService.setCurrentOrder(o);
    });
    setIsVisble(false);
    navigation.navigate('HomeScreen');
  };

  return (
    <Dialog isVisible={isVisible} onBackdropPress={_onBackdropPress}>
      <Container style={styles.container}>
        <View style={styles.content}>
          <LottieView
            source={require('@src/assets/animations/order-success.json')}
            autoPlay
            loop={false}
            onAnimationFinish={_onAnimationFinish}
            style={styles.lottieView}
          />
          {!isAnimationFinished && (
            <Animated.View
              style={[styles.processingOrderContainer, {opacity: fadeOut}]}>
              <Text isBold>A sua encomenda está a ser processada...</Text>
            </Animated.View>
          )}
          <Animated.View
            style={[styles.successMessageContainer, {opacity: fadeIn}]}>
            <Text isHeadingTitle isBold isPrimary>
              Obrigado por utilizar o Scuver!
            </Text>
            <Text isCenter style={styles.successMessage}>
              Pode encontrar mais tarde a sua encomenda no histórico.
            </Text>
          </Animated.View>
        </View>
        <Animated.View
          style={[styles.footerButtonContainer, {opacity: fadeIn}]}>
          <Button
            isFullWidth
            isTransparent
            style={styles.orderSomethingButton}
            onPress={_onOrderSomethingElseButtonPressed}>
            <Text>Fazer outro Pedido</Text>
          </Button>
        </Animated.View>
      </Container>
    </Dialog>
  );
};
export default OrderSuccessModal;
