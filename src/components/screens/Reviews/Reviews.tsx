import * as React from 'react';
import {SafeAreaView, ScrollView, Image, View, Dimensions, Modal} from 'react-native';
import {Carousel, Card, Text, Button, Icon} from '@src/components/elements';
import styles from './styles';
import {useEffect, useState} from "react";
import {Review} from "@src/models/review";
import {ReviewService} from "@src/services/review.service";
import {Shop} from "@src/models/shop";
import {ShopService} from "@src/services/shop.service";
import ImageViewer from "react-native-image-zoom-viewer";
import {lightTheme} from "@src/styles/theme";

type ReviewsProps = {};

const Reviews: React.FC<ReviewsProps> = () => {

  const [shop, setShop] = useState<Shop | null>(null)
  const [reviews, setReviews] = useState<Array<Review>>([]);
  const [photos, setPhotos] = useState<Array<any>>([]);
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => {
    ShopService.getCurrentShop().subscribe(s => {
      setShop(s);
      ReviewService.getReviewsByShop(s.uid).then(r => {
        setReviews(r);
        let p: Array<string> = [];
        r.forEach(rv => {
          p = p.concat(rv.photos);
          console.log('p', p);
        });
        setPhotos(p.map(ph => {
          return {url: ph}
        }));
      });
    });
  }, []);

  return (
    <SafeAreaView style={styles.rootContainer}>
      <ScrollView>
        <View style={{padding: 10}}>
          {reviews && reviews.length ?
            (<>
              <Carousel
                hasPagination={false}
                data={photos}
                itemWidth={Dimensions.get('window').width / 1.5}
                renderContent={(item, index, parallaxProps) => {
                  return (
                    <Card
                      coverImage={{uri: item.url}}
                      parallaxProps={parallaxProps}
                      onPress={() => {
                        const newPhotos: Array<any> = [];
                        photos.slice(index).forEach(p => newPhotos.push(p));
                        photos.slice(0, index).forEach(p => newPhotos.push(p));
                        setPhotos(newPhotos);
                        setShowPhotos(true);
                      }}
                    />
                  );
                }}
              />
              <Modal visible={showPhotos} transparent={true}>
                <ImageViewer imageUrls={photos} renderFooter={(args) => {
                  return (
                    <View style={{backgroundColor: 'transparent', flexDirection: 'row', height: 50, width: '100%'}}>
                      <Button style={{width: 300, marginLeft: 50}} onPress={() => setShowPhotos(false)}>
                        <Text style={{color: 'white'}}>Fechar</Text>
                      </Button>
                    </View>
                  );
                }}/>
              </Modal>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <Text isPrimary style={{fontSize: 20, marginRight: 100}}>Avaliações dos Clientes</Text>
                <Icon name="star" size={12} solid={true} style={{color: lightTheme.colors.tertiary, fontSize: 20}}/>
                <Text isPrimary style={{
                  fontSize: 20,
                  position: 'relative',
                  bottom: 2,
                  color: lightTheme.colors.tertiary
                }}>{shop?.rating}</Text>
                <Text isPrimary style={{
                  fontSize: 15,
                  position: 'relative',
                  bottom: 3,
                  color: lightTheme.colors.tertiary
                }}>({shop?.reviewsLength})</Text>
              </View>
              <View style={{marginTop: 20}}>
                <Carousel
                  hasPagination={false}
                  data={reviews}
                  itemWidth={Dimensions.get('window').width / 2}
                  renderContent={(item, index, parallaxProps) => {
                    return (
                      <Card>
                        <View style={{
                          ...styles.ratingContainer,
                          position: 'absolute',
                          top: -5,
                          right: 5,
                          flex: 0,
                          flexDirection: 'row'
                        }}>
                          <Icon name="star" size={12} solid={true} style={{color: lightTheme.colors.tertiary}}/>
                          <Text isPrimary style={{
                            position: 'relative',
                            bottom: 2,
                            color: lightTheme.colors.tertiary
                          }}>{item.globalRating}</Text>
                        </View>
                        <Text style={{marginTop: 10}} isSecondary>O que pedir</Text>
                        <Text>{item.whatToOrder}</Text>
                        <Text style={{marginTop: 10}} isSecondary>Comentário</Text>
                        <Text>{item.notes}</Text>
                      </Card>
                    );
                  }}
                />
              </View>
            </>) :
            (<View>
              <Text>Este estabelecimento não tem avaliações nem fotos ainda.</Text>
            </View>)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
;

export default Reviews;
