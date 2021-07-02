import {BehaviorSubject, Subscription, combineLatest, Observable} from 'rxjs';
import { pairwise, filter, map, take } from 'rxjs/operators';
import { Order } from '../models/order';
import { OrderHelper } from '../utils/order-helper';
import { FirestoreService } from './firestore-utils/firestore.service';
import { ShopService } from './shop.service';
import { UserService } from './user.service';
import { LocationHelper } from '../utils/location-helper';
import { ShopHelper } from '../utils/shop-helper';
import {ReviewService} from './review.service';
import {User} from '../models/user';

export class OrderService {

  private currentOrder$ = new BehaviorSubject<Order | null>(null);
  private currentOrderSub = new Subscription();
  private userOrders$ = new BehaviorSubject<Array<Order | null> | null>(null);
  private user: User | null = null;
  private shopService = ShopService;
  private userService = UserService;
  private firestoreService = FirestoreService;
  private orderHelper = OrderHelper;
  private shopHelper = ShopHelper;
  private locationHelper = LocationHelper;
  private reviewService = ReviewService;

  constructor(

  ) {
    this.trackCurrentOrder();
    this.trackUserOrders();
    this.keepDeliveryFeeUpdated();
  }

  trackUserOrders() {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.firestoreService.observeRecordsByProperty('orders', 'user.uid', '==', user.uid).subscribe((orders: Order[]) => {
          return this.userOrders$.next(orders.map(order => {
            return order ? {...new Order(), ...order} : null;
          }));
        });
      }
    });
  }

  // --------------------------------------------------------------------------------------------------------
  // Current Order Functions
  // --------------------------------------------------------------------------------------------------------

  private trackCurrentOrder() {
    combineLatest([this.userService.getCurrentUser(), this.shopService.getCurrentShop()]).subscribe(async ([user, shop]) => {
      this.currentOrderSub.unsubscribe();
      if (!user || !shop) return this.currentOrder$.next(null);

      this.currentOrderSub = this.observeOrderBeingCreated(user.uid, shop.uid).subscribe((order) => {
        if (order) { order.shop = shop; order.user = user; }
        this.currentOrder$.next(order);
      });
    });
  }

  private keepDeliveryFeeUpdated() {
    this.currentOrder$.pipe(
      map((order) => JSON.parse(JSON.stringify(order || null)) as Order),
      pairwise(),
      // keeps going down only when order.address has changed...
      filter(([prevOrder, currOrder]) => {
        if (!currOrder) return false;
        if (!currOrder.address) return false;

        if (!prevOrder && currOrder) return true;

        return false;
      })
    )
    .subscribe(async ([, order]) => {
      order.distanceInKm = 0;
      order.deliveryFee = 0;
      return await this.setCurrentOrder(order);
    });
  }

  async setCurrentOrder(order: Order) {
    order.subTotal = this.orderHelper.getOrderSubTotal(order);
    order.total    = this.orderHelper.getOrderTotal(order);

    if (order.wallet) {
      order.total -= order.wallet;
    }

    await this.updateOrder(order);
    await this.removeOrdersBeingCreatedByUserExcept(order);
  }

  getCurrentOrder(): Observable<Order | null> {
    return this.currentOrder$.asObservable();
  }

  // --------------------------------------------------------------------------------------------------------
  // Generic Firebase Functions
  // --------------------------------------------------------------------------------------------------------

  getOrder(uid: string): Promise<Order | null> {
    return this.observeOrder(uid).pipe(take(1)).toPromise();
  }

  getOrders(): Promise<Array<Order | null>> {
    return this.observeOrders().pipe(take(1)).toPromise();
  }

  getOrdersWithWallet(): Promise<Order[]> {
    return this.firestoreService.getRecordsByProperty('orders', 'wallet', '>', 0) as Promise<Order[]>;
  }

  getOrdersByShop(shopId: string): Promise<Array<Order | null>> {
    return this.firestoreService.observeRecordsByProperty('orders', 'shop.uid', '==', shopId)
    .pipe(
      take(1),
      map((orders: Order[]) => orders.map(order => order ? {...new Order(), ...order} : null))
    ).toPromise();
  }

  getOrdersByUser(userId: string): Promise<Array<Order | null>> {
    return this.firestoreService.observeRecordsByProperty('orders', 'user.uid', '==', userId)
    .pipe(
      take(1),
      map((orders: Order[]) => orders.map(order => order ? {...new Order(), ...order} : null))
    ).toPromise();
  }

  observeOrdersByUser(userId: string): Observable<Order[]> {
    return this.firestoreService.observeRecordsByProperty('orders', 'user.uid', '==', userId);
  }

  getOrderBeingCreated(userId: string, shopId: string): Promise<Order | null> {
    return this.firestoreService.observeRecordByProperties(
      'orders',
      ['user.uid', 'shop.uid', 'status'],
      '==',
      [userId, shopId, 'being-created'])
    .pipe(
      take(1),
      map((order: Order) => order ? {...new Order(), ...order} : null)
    ).toPromise();
  }

  observeOrderBeingCreated(userId: string, shopId: string): Observable<Order | null> {
    return this.firestoreService.observeRecordByProperties('orders', ['user.uid', 'shop.uid', 'status'], '==', [userId, shopId, 'being-created'])
    .pipe(map((order: Order) => order ? {...new Order(), ...order} : null));
  }

  addOrder(order: Order): Promise<Order> {
    return this.firestoreService.addOrUpdateRecord('orders', JSON.parse(JSON.stringify(order))) as Promise<Order>;
  }

  updateOrder(order: Order): Promise<Order> {
    return this.firestoreService.addOrUpdateRecord('orders', JSON.parse(JSON.stringify(order))) as Promise<Order>;
  }

  removeOrder(uid: string) {
    return this.firestoreService.removeRecord('orders', uid);
  }

  observeOrder(uid: string): Observable<Order | null> {
    return this.firestoreService.observeRecord('orders', uid)
    .pipe(map((order: Order) => order ? {...new Order(), ...order} : null));
  }

  observeOrders(): Observable<Array<Order | null>> {
    return this.firestoreService.observeCollection('orders')
    .pipe(map((orders: Order[]) => orders.map(order => order ? {...new Order(), ...order} : null)));
  }

  private removeOrdersBeingCreatedByUserExcept(order: Order) {
    return this.firestoreService.getRecordsByProperties(
      'orders',
      ['uid'    , 'user.uid'    , 'status'       ],
      ['!='     , '=='          , '=='           ],
      [order.uid, order.user.uid, 'being-created']
    ).then(records => {
      records.forEach(record => this.removeOrder(record.uid));
    });
  }

}
