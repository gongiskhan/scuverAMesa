import * as React from 'react';
import {Alert, Linking, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTheme} from '@react-navigation/native';
import {Rating, Button, Icon, Text, Container} from '@src/components/elements';
import styles from './styles';
import {Shop} from "@src/models/shop";
import {DaySchedule} from "@src/models/submodels/timetable";
import {lightTheme} from "@src/styles/theme";
import {showLocation} from "react-native-map-link";

type ShopCardInfoProps = {
  data: Shop;
  isSummary?: boolean;
};

const ShopCardInfo: React.FC<ShopCardInfoProps> = ({
  data,
  isSummary,
}) => {

  const openMap = (lat, lng) => {
    showLocation({
      latitude: lat,
      longitude: lng,
    }).then();
  }

  const openGoogleMaps = (a) => {
    let address = a.addressLine1;
    address += ' ';
    address += a.addressLine2 || '';
    address += ' ';
    address += a.postCode || '';
    address += ' ';
    address += a.local || '';
    address = encodeURI(address);
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${address}`,
    );
  }

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Informação', 'Morada copiada.');
  };

  const {preparationTime} = data;
  const {
    colors: {border},
  } = useTheme();
  return (
    <>
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
            <Text isPrimary style={styles.buttonText}>{`${Math.round(data.distanceInMeters / 1000)}~km`}</Text>
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
      {isSummary ? null : (
        <Container style={{marginTop: 20, flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
          <Text isSecondary isBold style={{marginBottom: 12}}>
            Morada/Direccões:
          </Text>
          <View style={{flexDirection: 'row', flex: 10, width: '100%', justifyContent: 'space-between'}}>
            <Text isPrimary onPress={() => {
              copyToClipboard((data.address.addressLine1 || '') +
                ' ' +
                (data.address.addressLine2 || '') +
                ' ' +
                (data.address.postCode || '') +
                ' ' +
                data.address.local || '',);
            }}>
              {data.address.addressLine1} {data.address.addressLine2} {"\n"}
              {data.address.postCode} {data.address.local}
            </Text>
            <Container style={{flexDirection: 'row', width: '25%'}}>
              <Icon isPrimary name="map" size={30} style={{flex: 8}} onPress={() => {
                openGoogleMaps(data.address);
              }}/>
              <Icon isPrimary name="directions" style={{flex: 5 }} size={30} onPress={() => {
                openMap(data.address.coordinates.latitude, data.address.coordinates.longitude);
              }}/>
            </Container>
          </View>
        </Container>
      )}
    </>
  );
};

export default ShopCardInfo;
