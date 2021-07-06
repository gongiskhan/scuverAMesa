import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Shop } from '../models/shop';
import { FirestoreService } from './firestore-utils/firestore.service';
import { map, take } from 'rxjs/operators';
import {LocationHelper} from "@src/utils/location-helper";
import Geolocation from '@react-native-community/geolocation';
import {ShopHelper} from "@src/utils/shop-helper";
import {MyTime} from "@src/utils/time-helper";
import {ReviewService} from "@src/services/review.service";
import {FoodType} from "@src/models/food-type";
import {FoodTypeService} from "@src/services/food-type.service";

class ShopServiceClass {

  firestoreService = FirestoreService;
  reviewService = ReviewService;
  foodTypeService = FoodTypeService;
  locationHelper = LocationHelper;
  shopHelper = ShopHelper;

  // @ts-ignore
  private currentShop$ = new BehaviorSubject<Shop | null>(null);
  private completeShops$ = new BehaviorSubject<Array<Shop | null>>(null);
  private currentShopSub = new Subscription();
  shops: Array<Shop> = [];
  foodTypes: Array<FoodType> = [];
  location: any = null;

  constructor(
  ) {
    this.updatePosition();
  }

  updatePosition() {
    Geolocation.getCurrentPosition((location: any) => {
      console.log('getCurrentPosition LOCATION', location);
      this.location = location;
      this.updateCompleteShops();
    }, (error: any) => {
      console.log('getCurrentPosition LOCATION ERROR', error);
      this.location = null;
      this.updateCompleteShops();
    });
    Geolocation.watchPosition((location: any) => {
      console.log('watchPosition LOCATION', location);
      this.location = location;
      this.updateCompleteShops();
    }, (error: any) => {
      console.log('watchPosition LOCATION ERROR', error);
      this.location = null;
      this.updateCompleteShops();
    }, {
      distanceFilter: 50
    });
  }

  updateCompleteShops() {
    this.getShops().then(async shops => {
      this.shops = shops;
      if (this.location) {
        this.calculateShopDistances();
        // this.calculateShopDeliveryFees();
      }
      this.setShopTodaySchedules();
      this.setRatings();
      await this.setFoodTypes();
      this.completeShops$.next(this.shops || []);
    });
  }

  observeCompleteShops() {
    return this.completeShops$.asObservable();
  }

  calculateShopDistances() {
    this.shops.forEach(shop => {
      const distanceInKm = this.locationHelper.getRadiusDistanceInKm(shop.address.coordinates, this.location.coords);
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
        const shop = this.shops.find(s => s.uid == k);
        if (shop) {
          const spl = v.split(':');
          shop.rating = spl[0] as any as number;
          shop.reviewsLength = spl[1] as any as number;
        }
      });
    });
  }

  async setFoodTypes() {
    const foodTypes = await this.foodTypeService.getFoodTypes();
    this.shops.forEach(shop => {
      shop.foodType = foodTypes.find(ft => shop.foodTypesId[0] === ft.uid)?.names[0] || '';
      shop.foodType = shop.foodType.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    });
  }

  setCurrentShop(uid: string): Promise<Shop> {
    return new Promise(resolve => {
      this.currentShopSub.unsubscribe();
      this.currentShopSub = this.observeShop(uid).subscribe(shop => this.currentShop$.next(shop));
      resolve();
    });
  }

  getCurrentShop() {
    return this.currentShop$.asObservable();
  }

  async getShop(uid: string): Promise<Shop | null> {
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

  observeShop(uid: string): Observable<Shop | null> {
    return new Observable(observer => {
      const currentShop = this.shops && this.shops.find(s => s.uid === uid);
      if (currentShop) {
        observer.next(currentShop);
      }
      this.firestoreService.observeRecord('shops', uid).subscribe(record => {
        const shop = record;
        const currentShop = this.shops && this.shops.find(s => s.uid === uid);
        observer.next(shop ? {...new Shop(), ...currentShop, ...shop} as Shop : null);
      });
    });
  }

  observeShops(): Observable<Shop[]> {
    return this.firestoreService.observeCollection('shops').pipe(map((sps) => {

      const shops: Array<Shop> = [];

      sps.forEach((shp: any) => {
        const shop = shp as Shop;
        if (shop.inShopEnabled) {
          shops.push(shop);
        }
      });

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
