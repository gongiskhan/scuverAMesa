import * as React from 'react';
import {View, Image} from 'react-native';
import {Profile} from '@src/data/mock-profile';
import {Text} from '@src/components/elements';
import styles from './styles';
import {User} from "@src/models/user";

type HeadingInformationProps = {
  user: User | null;
};

const HeadingInformation: React.FC<HeadingInformationProps> = ({user}) => {
  return (
    <View>
      {
        user?.photoUrl ?
          <Image source={{uri: user?.photoUrl}} style={styles.coverPhoto} /> :
          <Image source={require('../../../../assets/profile/avatar.png')} style={styles.coverPhoto} />
      }
      <View style={styles.informationContainer}>
        <Text isHeadingTitle style={styles.name}>
          {user?.name}
        </Text>
      </View>
    </View>
  );
};

export default HeadingInformation;
