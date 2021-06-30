import * as React from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Rating, Button, Icon, Text} from '@src/components/elements';
import styles from './styles';
import {Shop} from "@src/models/shop";
import {DaySchedule} from "@src/models/submodels/timetable";

type ShopCardInfoProps = {
  data: Shop;
  ratingStarBackgroundColor?: string;
};

const ShopCardInfo: React.FC<ShopCardInfoProps> = ({
  data,
  ratingStarBackgroundColor,
}) => {
  const {preparationTime} = data;
  const {
    colors: {border},
  } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <Rating
          value={data.rating}
          itemSize={16}
          readonly
          ratingStarBackgroundColor={ratingStarBackgroundColor}
        />
        <Text>{`(${data.reviewsLength})`}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, {backgroundColor: border}]}
          icon={<Icon isPrimary name="map-marker-alt" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${data.distance}~km`}</Text>
        </Button>
        <Button
          style={[styles.button, {backgroundColor: border}]}
          icon={<Icon isPrimary name="clock" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${preparationTime}'`}</Text>
        </Button>
        <Button
            style={[styles.button, {backgroundColor: border}]}
            icon={<Icon isPrimary name="euro-sign" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${data.deliveryFee}`}</Text>
        </Button>
        <Text>Horário:
        {data.todaySchedule?.workingPeriods?.map(s => {
          return `${s.startTime}-${s.endTime}`
        })}
        </Text>
      </View>
    </View>
  );
};

export default ShopCardInfo;
