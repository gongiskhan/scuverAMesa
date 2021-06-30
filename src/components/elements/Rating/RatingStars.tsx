import * as React from 'react';
import {
  Rating as BaseRating,
  RatingProps as BaseRatingProps,
} from 'react-native-ratings';
import {useTheme} from '@react-navigation/native';
import {Button, Icon, Text} from "@src/components/elements";
import styles from "@src/components/common/ShopCardInfo/styles";
import {View} from "react-native";

interface OwnProps {
  value?: number;
  readonly?: boolean;
  itemSize?: number;
  ratingStarBackgroundColor?: string;
  numberOfRatings?: number;
}
type RatingProps = OwnProps & BaseRatingProps;

const Rating: React.FC<RatingProps> = ({
  value,
  readonly,
  itemSize,
  ratingStarBackgroundColor,
  numberOfRatings,
  ...rest
}) => {
  const {
    colors: {primary, card},
  } = useTheme();
  return (
    <View style={{flex: 0, flexDirection: 'row', marginBottom: 5}}>
      <Icon isPrimary name="star" size={10} solid={true}/>
      <Text isPrimary style={{position: 'relative', bottom: 3}}> {value}</Text>
      <Text isPrimary style={{position: 'relative', bottom: 3, fontSize: 12}}>({numberOfRatings})</Text>
      {/*<BaseRating*/}
      {/*  type="custom"*/}
      {/*  readonly={readonly}*/}
      {/*  startingValue={value}*/}
      {/*  imageSize={itemSize}*/}
      {/*  ratingColor={primary}*/}
      {/*  tintColor={ratingStarBackgroundColor ? ratingStarBackgroundColor : card}*/}
      {/*  {...rest}*/}
      {/*/>*/}
    </View>
  );
};

Rating.defaultProps = {
  itemSize: 16,
  value: 1,
};

export default Rating;
