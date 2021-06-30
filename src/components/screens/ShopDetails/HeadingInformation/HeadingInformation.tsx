import * as React from 'react';
import {Card, Container, Icon, Text} from '@src/components/elements';
import ShopCardInfo from '@src/components/common/ShopCardInfo';
import styles from './styles';
import {Place} from '@src/data/mock-places';
import {Shop} from "@src/models/shop";

type HeadingInformationProps = {
  data: Shop;
};

const HeadingInformation: React.FC<HeadingInformationProps> = ({data}) => {
  const {name, foodType} = data;
  return (
    <Card
      isSmallCover
      title={name || 'NA'}
      subTitle={foodType || 'NA'}
      titleStyle={styles.title}
      style={styles.headingContainer}>
      <ShopCardInfo data={data} />
    </Card>
  );
};

export default HeadingInformation;
