import * as React from 'react';
import {Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, Text, Touchable} from '@src/components/elements';
import styles from './styles';
import {Shop} from "@src/models/shop";
import ShopCardInfo from "@src/components/common/ShopCardInfo";
import {DaySchedule} from "@src/models/submodels/timetable";

type ShopListItemProps = {
  data: Shop;
  foodType: string;
  rating: number;
  reviewsLength: number;
  distance: number;
  fee: number;
  schedule?: DaySchedule;
};

const ShopListItem: React.FC<ShopListItemProps> = ({
  data,
  foodType,
  rating,
  reviewsLength,
  distance,
  fee,
  schedule
}) => {
  const {photoUrl, name} = data;
  const navigation = useNavigation();

  const _onShopItemPressed = () => {
    navigation.navigate('ShopDetailsScreen');
  };

  return (
    <Touchable onPress={_onShopItemPressed}>
      <Container style={styles.container}>
        <Image style={styles.image} source={{uri: photoUrl}} />
        <View style={styles.placeInfoContainer}>
          <View style={styles.placeInfo}>
            <Text style={styles.placeTitle}>{name}</Text>
            <Text style={styles.placeSubTitle}>{foodType}</Text>
          </View>
          <ShopCardInfo data={data} rating={rating} distance={distance} reviewsLength={reviewsLength} fee={fee} schedule={schedule}/>
        </View>
      </Container>
    </Touchable>
  );
};

export default ShopListItem;
