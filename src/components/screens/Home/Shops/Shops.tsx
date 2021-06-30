import * as React from 'react';
import {Container} from '@src/components/elements';
import {FeaturedTab, NewestTab, TrendingTab} from './Tabs';
import {TabView} from '@src/components/elements';
import styles from './styles';
import {TabViewData} from '@src/components/elements/TabView/TabView';
import {mockRemarkablePlace, Place} from "@src/data/mock-places";
import ShopListItem from "@src/components/common/ShopListItem";
import {useEffect, useState} from "react";
import {ShopService} from "@src/services/shop.service";
import {Shop} from "@src/models/shop";

type ShopsProps = {};

const Shops: React.FC<ShopsProps> = () => {

  const [shops, setShops] = useState([]);

  useEffect(() => {
    console.log('AQUI');
    ShopService.observeShops().subscribe(shopz => {
      console.log('shopz.length', shopz.length);
      setShops(shopz as any);
    });
  }, []);

  return (
    <Container style={styles.container}>
      {shops.map((item: Shop) => {
        return <ShopListItem
            key={item.uid}
            data={item}
        />;
      })}
    </Container>
  );
};

export default Shops;
