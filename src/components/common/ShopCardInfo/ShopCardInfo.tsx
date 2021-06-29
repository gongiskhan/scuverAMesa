import * as React from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Rating, Button, Icon, Text} from '@src/components/elements';
import styles from './styles';
import {Shop} from "@src/models/shop";
import {DaySchedule} from "@src/models/submodels/timetable";

type ShopCardInfoProps = {
  data: Shop;
  rating: number;
  reviewsLength: number;
  distance: number;
  fee: number;
  schedule?: DaySchedule;
  ratingStarBackgroundColor?: string;
};

const ShopCardInfo: React.FC<ShopCardInfoProps> = ({
  data,
  rating,
  reviewsLength,
  distance,
  fee,
  schedule,
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
          value={rating}
          itemSize={16}
          readonly
          ratingStarBackgroundColor={ratingStarBackgroundColor}
        />
        <Text>{`(${reviewsLength})`}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, {backgroundColor: border}]}
          icon={<Icon isPrimary name="map-marker-alt" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${distance}~km`}</Text>
        </Button>
        <Button
          style={[styles.button, {backgroundColor: border}]}
          icon={<Icon isPrimary name="clock" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${preparationTime}'`}</Text>
        </Button>
        <Button
            style={[styles.button, {backgroundColor: border}]}
            icon={<Icon isPrimary name="euro" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${fee}`}</Text>
        </Button>
        <Text>Horário:
        {schedule?.workingPeriods.map(s => {
          return `${s.startTime}-${s.endTime}`
        })}
        </Text>
      </View>
    </View>
  );
};

export default ShopCardInfo;
