import * as React from 'react';
import {Container, List, Text} from '@src/components/elements';
import {mockPlaceList} from '@src/data/mock-places';
import styles from './styles';

type PlaceListProps = {};

const PlaceList: React.FC<PlaceListProps> = () => {
  return (
    <Container style={styles.root}>
      <List
        data={mockPlaceList}
        renderItem={({item}) => {
          return (<Text>ERA UMA SHOP</Text>);
        }}
      />
    </Container>
  );
};

export default PlaceList;
