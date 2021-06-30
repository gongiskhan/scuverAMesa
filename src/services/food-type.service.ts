import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FoodType } from '../models/food-type';
import { Shop } from '../models/shop';
import { FirestoreService } from './firestore-utils/firestore.service';

class FoodTypeServiceClass {

  private foodTypes$ = new ReplaySubject<FoodType[]>(1);
  firestoreService = FirestoreService;

  constructor(
  ) {
    this.trackFoodTypes();
  }

  private trackFoodTypes() {
    this.firestoreService.observeCollection('food-types')
    .pipe(
      map((foodTypes: FoodType[]) => foodTypes.sort((a, b) => {
        if ( a.priority > b.priority ) return  1;
        if ( a.priority < b.priority ) return -1;
        return 0;
      }))
    )
    .subscribe((foodTypes) => this.foodTypes$.next(foodTypes));
  }

  getFoodType(uid: string): Promise<FoodType> {
    return new Promise((resolve, reject) => {
      this.foodTypes$
      .pipe(take(1))
      .subscribe((foodTypes) => resolve(foodTypes.find((foodType) => foodType.uid === uid)));
    });
  }

  getFoodTypes(): Promise<FoodType[]> {
    return new Promise((resolve, reject) => {
      this.foodTypes$.pipe(take(1)).subscribe((foodTypes) => resolve(foodTypes));
    });
  }

  async getFoodTypesOfShop(shop: Shop) {
    const shopFoodTypesId = shop.foodTypesId;
    const foodTypes = await this.getFoodTypes();

    return foodTypes.filter((foodType) => shopFoodTypesId.includes(foodType.uid));
  }

  // addFoodType(foodType: FoodType): Promise<FoodType> {
  //   return this.firestoreService.addOrUpdateRecord('food-types', JSON.parse(JSON.stringify(foodType))) as Promise<FoodType>;
  // }
  //
  // updateFoodType(foodType: FoodType): Promise<FoodType> {
  //   return this.firestoreService.addOrUpdateRecord('food-types', JSON.parse(JSON.stringify(foodType))) as Promise<FoodType>;
  // }

  removeFoodType(uid: string) {
    return this.firestoreService.removeRecord('food-types', uid);
  }

  observeFoodType(uid: string): Observable<FoodType> {
    return this.firestoreService.observeRecord('food-types', uid);
  }

  observeFoodTypes(): Observable<FoodType[]> {
    return this.foodTypes$.asObservable();
  }

}

export const FoodTypeService = new FoodTypeServiceClass();
