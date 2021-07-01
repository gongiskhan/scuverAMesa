import * as React from 'react';
import {Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, Text, Touchable} from '@src/components/elements';
import styles from './styles';
import {Item} from "@src/models/item";

type DishItemProps = {
  data: Item;
};

const DishItem: React.FC<DishItemProps> = ({data}) => {
  const navigation = useNavigation();

  const _onPlaceItemPressed = () => {
    navigation.navigate('DishDetailsModal', {data});
  };

  return (
    <Touchable onPress={_onPlaceItemPressed}>
      <Container style={styles.container}>
        {data.photoUrl ? <Image style={styles.image} source={{uri: data.photoUrl}} /> : <Text> </Text>}
        <View style={styles.placeInfoContainer}>
          <View style={styles.placeInfo}>
            <Text style={styles.placeTitle}>{data.name}</Text>
            <Text style={styles.placeSubTitle}>{data.description}</Text>
            <Text isPrimary isBold>
              €{data.price}
            </Text>
          </View>
        </View>
      </Container>
    </Touchable>
  );
};

export default DishItem;
