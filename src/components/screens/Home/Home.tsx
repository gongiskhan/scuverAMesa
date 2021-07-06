import * as React from 'react';
import {useFocusEffect, useScrollToTop} from '@react-navigation/native';
import {InteractionManager, RefreshControl, SafeAreaView, ScrollView} from 'react-native';
import {Button, Icon, LoadingIndicator, SearchBar} from '@src/components/elements';
import Shops from './Shops';
import styles from "./styles";
import PopularCategories from "@src/components/screens/Home/PopularCategories";
import {ShopService} from "@src/services/shop.service";

type HomeProps = {};

const Home: React.FC<HomeProps> = () => {
  const [isNavigationTransitionFinished, setIsNavigationTransitionFinished] =
    React.useState(false);
  const scrollViewRef = React.useRef(null);

  useScrollToTop(scrollViewRef);

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setIsNavigationTransitionFinished(true);
      });
      return () => task.cancel();
    }, []),
  );

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    ShopService.updatePosition();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        ref={scrollViewRef}
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/*<SearchBar placeholder="Pesquise restaurantes ou pratos" />*/}
        <Button style={styles.root}
                isTransparent
                isFullWidth
          onPress={() => onRefresh()}>
          <Icon name="md-refresh" size={22} isPrimary useIonicons />
        </Button>
        {isNavigationTransitionFinished ? (
          <>
            {/*<PopularPlaces />*/}
            {/*<MerchantCampaigns />*/}
            {/*<RecommendedPlaces />*/}
            {/*<HotDeals />*/}
            <Shops />
          </>
        ) : (
          <LoadingIndicator size="large" hasMargin />
        )}
      </ScrollView>
      {/*<AppReviewModal daysBeforeReminding={1} />*/}
    </SafeAreaView>
  );
};

export default Home;
