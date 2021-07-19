import * as React from 'react';
import {useEffect, useState} from 'react';
import {Container} from '@src/components/elements';
import styles from './styles';
import ShopListItem from "@src/components/common/ShopListItem";
import {ShopService} from "@src/services/shop.service";
import {Shop} from "@src/models/shop";
import {lightTheme} from "@src/styles/theme";
import {useNavigation} from "@react-navigation/native";

type ShopsProps = {};

const Shops: React.FC<ShopsProps> = () => {

  const [shops, setShops] = useState([]);
  const nav = useNavigation();
  let shopsSub: any = null;

  useEffect(() => {
    if (nav.isFocused() && ! shopsSub) {
      shopsSub = ShopService.observeCompleteShops().subscribe((shopz: any) => {
        // console.log('shopz', shopz.map(s => s.foodType));
        setShops(shopz as any || []);
      });
      ShopService.updateCompleteShops();
    } else {
      if (shopsSub) {
        shopsSub();
        shopsSub = null;
      }
    }
  }, [nav]);

  return (
    <Container style={{...styles.container, backgroundColor: lightTheme.colors.background}}>
      {shops.map((item: Shop) => {
        return <ShopListItem
            key={item.uid}
            data={item}
            isSummary={true}
        />;
      })}
    </Container>
  );
};

export default Shops;
