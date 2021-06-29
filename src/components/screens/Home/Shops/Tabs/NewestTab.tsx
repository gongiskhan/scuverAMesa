import * as React from 'react';
import {Container} from '@src/components/elements';
import {Place, mockRemarkablePlace} from '@src/data/mock-places';
import ShopListItem from '@src/components/common/ShopListItem';
import styles from './styles';

type NewestTabProps = {};

const NewestTab: React.FC<NewestTabProps> = () => {
  return (
    <Container style={styles.tabContent}>
      {mockRemarkablePlace.newest.map((item: Place) => {
        return <ShopListItem key={item.id} data={item} />;
      })}
    </Container>
  );
};

export default NewestTab;
