import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Shop } from '../models/shop';
import { FirestoreService } from './firestore-utils/firestore.service';
import { map, take } from 'rxjs/operators';

export class ShopService {

  // @ts-ignore
  private currentShop$ = new BehaviorSubject<Shop>(null);
  private currentShopSub = new Subscription();
  firestoreService = FirestoreService;

  constructor(
  ) { }

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
    return this.firestoreService.observeCollection('shops').pipe(map((shops: Shop[]) => shops.map(shop => shop ? {...(new Shop()), ...shop} as Shop : new Shop())));
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
