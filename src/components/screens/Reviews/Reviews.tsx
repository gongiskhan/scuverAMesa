import * as React from 'react';
import {SafeAreaView, ScrollView, Image, View, Dimensions, Modal} from 'react-native';
import {Carousel, Card, Text, Button} from '@src/components/elements';
import styles from './styles';
import {useEffect, useState} from "react";
import {Review} from "@src/models/review";
import {ReviewService} from "@src/services/review.service";
import {Shop} from "@src/models/shop";
import {ShopService} from "@src/services/shop.service";
import ImageViewer from "react-native-image-zoom-viewer";

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
        setPhotos(p.map(ph => {return {url: ph}}));
      });
    });
  }, []);

  return (
    <SafeAreaView style={styles.rootContainer}>
      <ScrollView stickyHeaderIndices={[0]}>

          <View style={{padding: 10}}>
            {reviews && reviews.length ?
           (<>
             <Carousel
             hasPagination={true}
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
                     <Button style={{width: 300, marginLeft: 50}} onPress={()=> setShowPhotos(false)}>
                       <Text style={{color: 'white'}}>Fechar</Text>
                     </Button>
                   </View>
                 );
               }}/>
             </Modal>
          </>) :
          (<View>
                <Text>Este estabelecimento não tem avaliações ainda.</Text>
          </View>)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reviews;
