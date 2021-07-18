import * as React from 'react';
import {Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, Text, Touchable} from '@src/components/elements';
import styles from './styles';
import {Shop} from "@src/models/shop";
import ShopCardInfo from "@src/components/common/ShopCardInfo";
import {DaySchedule} from "@src/models/submodels/timetable";
import {ShopService} from "@src/services/shop.service";

type ShopListItemProps = {
  data: Shop;
  isSummary?: boolean;
};

const ShopListItem: React.FC<ShopListItemProps> = ({
  data,
  isSummary
}) => {
  const {photoUrl, name} = data;
  const navigation = useNavigation();

  const _onShopItemPressed = () => {
    ShopService.setCurrentShop(data.uid).then(() => {
      navigation.navigate('ShopDetailsScreen');
    });
  };

  return (
    <Touchable onPress={_onShopItemPressed}>
      <Container style={styles.container}>
        {
          photoUrl ?
          <Image style={styles.image} source={{uri: photoUrl}} /> :
          <Image style={styles.image} source={require('../../../assets/app/store_3.png')} />
        }
        <View style={styles.placeInfoContainer}>
          <View style={styles.placeInfo}>
            <Text style={styles.placeTitle}>{name}</Text>
            <Text style={styles.placeSubTitle}>{data.foodType}</Text>
          </View>
          <ShopCardInfo data={data} isSummary={isSummary}/>
        </View>
      </Container>
    </Touchable>
  );
};

export default ShopListItem;
