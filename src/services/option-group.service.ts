import { Observable } from 'rxjs';
import { OptionGroup } from '../models/option-group';
import { FirestoreService } from './firestore-utils/firestore.service';


class OptionGroupServiceClass {

  firestoreService = FirestoreService;

  constructor(
  ) { }

  getOptionGroup(uid: string): Promise<OptionGroup> {
    return this.firestoreService.getRecord('shop-option-groups', uid) as Promise<OptionGroup>;
  }

  getOptionGroups(): Promise<OptionGroup[]> {
    return this.firestoreService.getCollection('shop-option-groups');
  }

  // addOptionGroup(optionGroup: OptionGroup): Promise<OptionGroup> {
  //   return this.firestoreService.addOrUpdateRecord('shop-option-groups', JSON.parse(JSON.stringify(optionGroup))) as Promise<OptionGroup>;
  // }
  //
  // updateOptionGroup(optionGroup: OptionGroup): Promise<OptionGroup> {
  //   return this.firestoreService.addOrUpdateRecord('shop-option-groups', JSON.parse(JSON.stringify(optionGroup))) as Promise<OptionGroup>;
  // }

  removeOptionGroup(uid: string) {
    return this.firestoreService.removeRecord('shop-option-groups', uid);
  }

  observeOptionGroup(uid: string): Observable<OptionGroup> {
    return this.firestoreService.observeRecord('shop-option-groups', uid);
  }

  observeOptionGroups(): Observable<OptionGroup[]> {
    return this.firestoreService.observeCollection('shop-option-groups');
  }
}

export const OptionGroupService = new OptionGroupServiceClass();
