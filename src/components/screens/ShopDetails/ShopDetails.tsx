import * as React from 'react';
import {Animated, SafeAreaView, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Container, Text} from '@src/components/elements';
import HeadingInformation from './HeadingInformation';
import TabSectionList from '@src/components/elements/TabSectionList';
import DishItem from '@src/components/common/DishItem';
import styles from './styles';
import BasketSummary from './BasketSummary';
import {Shop} from "@src/models/shop";
import {ShopService} from "@src/services/shop.service";
import {CategoryService} from "@src/services/category.service";
import {SubSink} from "@src/utils/subsink";
import {Category} from "@src/models/category";
import {OrderService} from "@src/services/order.service";
import {take} from "rxjs/operators";
import {OrderHelper} from "@src/utils/order-helper";

type PlaceDetailsProps = {};

const ShopDetails: React.FC<PlaceDetailsProps> = () => {

  const subs = new SubSink();

  const {
    colors: {primary, border, card},
  } = useTheme();

  const [scrollY] = React.useState(new Animated.Value(0));
  const [shop, setShop] = React.useState(new Shop());
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    subs.unsubscribe();
    subs.add(ShopService.getCurrentShop().subscribe(async (s: Shop) => {
      if ((s && !shop) || (s && s.uid !== shop.uid)) {
        // console.log('CHANGE SHOP', s);
        setShop(s);
        subs.add(CategoryService.observeCategoriesByShop(s.uid).subscribe((categories: Array<Category>) => {
          if (categories) {
            setCategories(categories.map(c => {
              c.items = c.items.map(item => {
                return {...item, id: item.uid, title: item.name};
              });
              return {...c, title: c.name, data: c.items};
            }) as any);
          }
        }));
        let order = await OrderService.getCurrentOrder().pipe(take(1)).toPromise();
        if (order && order.shop.uid !== s.uid) order = await OrderHelper.buildNewOrder();
        await OrderService.setCurrentOrder(order);
      }
    }));
  }, []);

  const coverTranslateY = scrollY.interpolate({
    inputRange: [-4, 0, 10],
    outputRange: [-2, 0, 3],
  });

  const coverScale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [2, 1],
    extrapolateRight: 'clamp',
  });

  const tabBarOpacity = scrollY.interpolate({
    inputRange: [200, 500],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.tabSectionListContainer}>
        <TabSectionList
          ListHeaderComponent={
            <>
              <Animated.View
                style={[
                  styles.coverPhotoContainer,
                  {
                    transform: [
                      {
                        translateY: coverTranslateY,
                      },
                    ],
                  },
                ]}>
                {shop.photoUrl ? (
                  <Animated.Image
                    source={shop?.photoUrl ? {uri: shop.photoUrl} : require('../../../assets/app/store_3.png')}
                    style={[
                      styles.coverPhoto,
                      {
                        transform: [
                          {
                            scale: coverScale,
                          },
                        ],
                      },
                    ]}
                  />
                ) : <Text> </Text>}
              </Animated.View>
              <HeadingInformation data={shop} />
              {/*<PopularDishes />*/}
            </>
          }
          sections={categories || []}
          keyExtractor={(item) => item.title}
          stickySectionHeadersEnabled={false}
          scrollToLocationOffset={5}
          tabBarStyle={[styles.tabBar, {opacity: tabBarOpacity}]}
          tabBarScrollViewStyle={{backgroundColor: card}}
          ItemSeparatorComponent={() => (
            <Container style={[styles.separator, {backgroundColor: border}]} />
          )}
          renderTab={({title, isActive}) => {
            const borderBottomWidth = isActive ? 2 : 0;
            return (
              <Container
                style={{
                  borderBottomWidth,
                  borderColor: primary,
                }}>
                <Text isPrimary={isActive && true} style={styles.tabText}>
                  {title}
                </Text>
              </Container>
            );
          }}
          renderSectionHeader={({section}) => (
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          )}
          renderItem={({item}) => {
            const itemClone = JSON.parse(JSON.stringify(item));
            return <DishItem data={itemClone} />;
          }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: scrollY,
                  },
                },
              },
            ],
            {
              useNativeDriver: true,
            },
          )}
        />
      </View>
      <BasketSummary />
    </SafeAreaView>
  );
};
export default ShopDetails;
