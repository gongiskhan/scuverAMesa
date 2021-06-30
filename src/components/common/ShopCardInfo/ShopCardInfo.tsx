import * as React from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Rating, Button, Icon, Text} from '@src/components/elements';
import styles from './styles';
import {Shop} from "@src/models/shop";
import {DaySchedule} from "@src/models/submodels/timetable";
import {lightTheme} from "@src/styles/theme";

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
      <View style={{...styles.ratingContainer, position: 'absolute', top: -40, right: 10, flex: 0, flexDirection: 'row'}}>
        <Icon name="star" size={12} solid={true} style={{color: lightTheme.colors.tertiary}}/>
        <Text isPrimary style={{position: 'relative', bottom: 2, color: lightTheme.colors.tertiary}}>{data.rating}</Text>
        <Text isPrimary style={{position: 'relative', bottom: 3, fontSize: 12, color: lightTheme.colors.tertiary}}>({data.reviewsLength})</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, {backgroundColor: border}]}
          icon={<Icon isPrimary name="map-marker-alt" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${data.distance}~km`}</Text>
        </Button>
        {/*<Button*/}
        {/*    style={[styles.button, {backgroundColor: border}]}*/}
        {/*    icon={<Icon isPrimary name="motorcycle" size={10} />}>*/}
        {/*  <Text isPrimary style={styles.buttonText}>{`~${data.deliveryFee}€`}</Text>*/}
        {/*</Button>*/}
        <Button
          style={[styles.button, {backgroundColor: border}]}
          icon={<Icon isPrimary name="clock" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${preparationTime}'`}</Text>
        </Button>
        {/*<Button*/}
        {/*    style={[styles.button, {backgroundColor: border}]}*/}
        {/*    icon={<Icon isPrimary name="clock" size={10} />}>*/}
          <Text isPrimary style={{...styles.buttonText, marginLeft: 10, marginTop: 10}}>
            <Text isPrimary style={{...styles.buttonText, fontWeight: 'bold'}}>Horário: </Text>
            {data.todaySchedule?.workingPeriods?.map((s, it) => {
              return ` ${it ? '/ ' : ''}${s.startTime}-${s.endTime}`
            })}
          </Text>
        {/*</Button>*/}
      </View>
    </View>
  );
};

export default ShopCardInfo;
