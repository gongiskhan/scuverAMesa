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
import {lightTheme} from "@src/styles/theme";

type ShopsProps = {};

const Shops: React.FC<ShopsProps> = () => {

  const [shops, setShops] = useState([]);

  useEffect(() => {
    ShopService.observeCompleteShops().subscribe((shopz: any) => {
      // console.log('shopz', shopz.map(s => s.foodType));
      setShops(shopz as any);
    });
  }, []);

  return (
    <Container style={{...styles.container, backgroundColor: lightTheme.colors.background}}>
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
