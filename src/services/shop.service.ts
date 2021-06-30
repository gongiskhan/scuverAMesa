import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Shop } from '../models/shop';
import { FirestoreService } from './firestore-utils/firestore.service';
import { map, take } from 'rxjs/operators';
import {DaySchedule} from "@src/models/submodels/timetable";
import {LocationHelper} from "@src/utils/location-helper";
// import GetLocation from 'react-native-get-location';
import {ShopHelper} from "@src/utils/shop-helper";
import {MyTime} from "@src/utils/time-helper";
import {ReviewService} from "@src/services/review.service";
import {FoodType} from "@src/models/food-type";

class ShopServiceClass {

  // @ts-ignore
  private currentShop$ = new BehaviorSubject<Shop>(null);
  private currentShopSub = new Subscription();
  firestoreService = FirestoreService;
  shops: Array<Shop> = [];
  foodTypes: Array<FoodType> = [];
  locationHelper = LocationHelper;
  location: any = null;
  shopHelper = ShopHelper;
  reviewService = ReviewService;

  constructor(
  ) {
    // GetLocation.getCurrentPosition({
    //   enableHighAccuracy: true,
    //   timeout: 15000,
    // })
    // .then((location: any) => {
    //   console.log('LOCATION', location);
    //   this.location = location;
    //   this.startObservingShops();
    // })
    // .catch((error: any) => {
    //   const { code, message } = error;
    //   console.warn(code, message);
    //   this.location = null;
      this.startObservingShops();
    // });
  }

  startObservingShops() {
    this.observeShops().subscribe(shops => {
      this.shops = shops;
      if (this.location) {
        this.calculateShopDistances();
        this.calculateShopDeliveryFees();
      }
      this.setShopTodaySchedules();
      this.setRatings();
    });
  }

  calculateShopDistances() {
    this.shops.forEach(shop => {
      const distanceInKm = this.locationHelper.getRadiusDistanceInKm(shop.address.coordinates, this.location);
      shop.distance = Math.round(distanceInKm) + 1;
    });
  }

  calculateShopDeliveryFees() {
    this.shops.forEach(shop => {
      const deliveryFee = this.shopHelper.getDeliveryFee(shop, shop.distance as number);
      shop.deliveryFee = deliveryFee;
    });
  }

  setShopTodaySchedules() {
    this.shops.forEach(shop => {
      const shopId = shop.uid;
      const todaySchedule = JSON.parse(JSON.stringify(this.shopHelper.getTodaySchedule(shop)));

      todaySchedule?.workingPeriods?.forEach((wp: any) => {
        if (wp.endTime) {
          const end = MyTime.parse(wp.endTime);
          const preparationMinutes = MyTime.parse(shop.preparationTime).toMinutes();
          end.subtractMinutes(preparationMinutes);
          wp.endTime = end.toString();
        }
      });
      shop.todaySchedule = todaySchedule;
    });
  }

  setRatings() {
    this.reviewService.observeShopRatings().subscribe(l =>  {
      l.forEach((v, k) => {
        const shop = this.shops.find(s => s.uid === k);
        if (shop) {
          const spl = v.split(':');
          shop.rating = spl[0] as any as number;
          shop.reviewsLength = spl[1] as any as number;
        }
      });
    });
  }

  setCurrentShop(uid: string) {
    if (this.currentShop$.value?.uid === uid) return;

    this.currentShopSub.unsubscribe();
    this.currentShopSub = this.observeShop(uid).subscribe(shop => this.currentShop$.next(shop));
  }

  getCurrentShop() {
    return this.currentShop$.asObservable();
  }

  async getShop(uid: string): Promise<Shop> {
    return this.observeShop(uid).pipe(take(1)).toPromise();
  }

  async getShops(): Promise<Shop[]> {
    return this.observeShops().pipe(take(1)).toPromise();
  }

  // addShop(shop: Shop): Promise<Shop> {
  //   return this.firestoreService.addOrUpdateRecord('shops', JSON.parse(JSON.stringify(shop))) as Promise<Shop>;
  // }
  //
  // updateShop(shop: Shop): Promise<Shop> {
  //   return this.firestoreService.addOrUpdateRecord('shops', JSON.parse(JSON.stringify(shop))) as Promise<Shop>;
  // }

  removeShop(uid: string) {
    return this.firestoreService.removeRecord('shops', uid);
  }

  observeShop(uid: string): Observable<Shop> {
    return this.firestoreService.observeRecord('shops', uid).pipe(map((shop: Shop) => shop ? {...(new Shop()), ...shop} as Shop : new Shop()));
  }

  observeShops(): Observable<Shop[]> {
    return this.firestoreService.observeCollection('shops').pipe(map((docs) => {

      const shops: Array<Shop> = [];

      docs.forEach((doc: any) => {
        const shop = doc.data() as Shop;
        if (shop.inShopEnabled) {
          shops.push(shop);
        }
      });

      console.log('shops.length', shops.length);

      return shops.map(shop => shop ? {...(new Shop()), ...shop} as Shop : new Shop())
    }));
  }

  // async findShopByNameMinified(shopNameMinified: string) {
  //   const url = `https://${environment.firebase.region}-${environment.firebase.projectId}.cloudfunctions.net/FindShop`;
  //   const res = await fetch(url, {
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({shopNameMinified})
  //   });
  //   const shopId = await res.text();
  //   return shopId;
  // }
}

export const ShopService = new ShopServiceClass();
