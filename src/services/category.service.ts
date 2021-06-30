import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Category } from '../models/category';
import { FirestoreService } from './firestore-utils/firestore.service';
import { ShopService } from './shop.service';
import {Item} from '../models/item';

class CategoryServiceClass {

  private currentCategories$ = new BehaviorSubject<Category[] | null>(null);
  private currentCategoriesSub = new Subscription();
  firestoreService = FirestoreService;
  shopService = ShopService;

  constructor(
  ) {
    this.observeCurrentShop();
  }

  private observeCurrentShop() {
    this.shopService.getCurrentShop().subscribe(async (shop) => {
      this.currentCategoriesSub.unsubscribe();
      if (!shop) return this.currentCategories$.next(null);

      this.currentCategoriesSub = this.observeCategoriesByShop(shop.uid).subscribe(categories => {
        this.currentCategories$.next(categories);
      });
    });
  }

  getCurrentCategories() {
    return this.currentCategories$.asObservable().pipe(map(categories => categories ?? []));
  }

  getCategory(uid: string): Promise<Category> {
    return this.firestoreService.getRecord('shop-categories', uid) as Promise<Category>;
  }

  getCategoriesByShop(shopId: string): Promise<Category[]> {
    return this.observeCategoriesByShop(shopId).pipe(take(1)).toPromise();
  }

  observeCategoriesByShop(shopId: string): Observable<Category[]> {
    return this.firestoreService
        .observeRecordsByProperty('shop-categories', 'shopId', '==', shopId)
        .pipe(map(categories => categories.map((category: Category) => category ? this.mergeCategory(category) : null)));
  }

  getCategories(): Promise<Category[]> {
    return this.firestoreService.getCollection('shop-categories');
  }

  // addCategory(category: Category): Promise<Category> {
  //   return this.firestoreService.addOrUpdateRecord('shop-categories', JSON.parse(JSON.stringify(category))) as Promise<Category>;
  // }
  //
  // updateCategory(category: Category): Promise<Category> {
  //   return this.firestoreService.addOrUpdateRecord('shop-categories', JSON.parse(JSON.stringify(category))) as Promise<Category>;
  // }

  removeCategory(uid: string) {
    return this.firestoreService.removeRecord('shop-categories', uid);
  }

  // observeCategory(uid: string): Observable<Category> {
  //   return this.firestoreService.observeRecord('shop-categories', uid)
  //       .pipe(map((category: Category) => category ? this.mergeCategory(category) : null));
  // }

  observeCategories(): Observable<Category[]> {
    return this.firestoreService.observeCollection('shop-categories');
  }

  private mergeCategory(category: any): Category {
    const cat = {...new Category(), ...category, items: category.items ? category.items.map((item: any) => {
      return {...new Item(), ...item};
    }) : new Array<Item>()} as Category;
    return cat;
  }
}

export const CategoryService = new CategoryServiceClass();
