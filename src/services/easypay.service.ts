import { EasypayPayment } from '../models/easypay-payment';
import { FirestoreService } from './firestore-utils/firestore.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {User} from "@src/models/user";

export class EasypayServiceClass {

  firestoreService = FirestoreService;

  private currentEasypayPayment$ = new BehaviorSubject<EasypayPayment>(null);
  private currentEasypayPaymentSub = new Subscription();

  constructor(

  ) { }

  // --------------------------------------------------------------------------------------------------------
  // Current EasypayPayment Functions
  // --------------------------------------------------------------------------------------------------------

  setCurrentEasypayPayment(uid: string) {
    if (this.currentEasypayPayment$.value?.id === uid) return;

    this.currentEasypayPaymentSub.unsubscribe();
    this.currentEasypayPaymentSub = this.observeEasypayPayment(uid).subscribe(value => this.currentEasypayPayment$.next(value));
  }

  getCurrentEasypayPayment() {
    return this.currentEasypayPayment$.asObservable();
  }

  createEasypayPayment(user: User | null, orderId: string, amount: number, method: 'mb'|'mbw', type = 'CreatePayment') {
    const url  = `https://europe-west1-scuver-data.cloudfunctions.net/${type}`;
    console.log('createEasypayPayment args', user, orderId, amount, method);
    const body = this.buildRequestBody(user, orderId, amount, method);
    return fetch(url, {method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(body)});
  }

  deleteEasypayPayment(easypayPaymentId: string) {
    const url  = `https://europe-west1-scuver-data.cloudfunctions.net/DeletePayment`;
    return fetch(url, {headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify({easypayPaymentId})});
  }

  // --------------------------------------------------------------------------------------------------------
  // Generic Firebase Functions
  // --------------------------------------------------------------------------------------------------------

  getEasypayPayment(uid: string): Promise<EasypayPayment> {
    return this.firestoreService.getRecord('easypay-payments', uid) as Promise<EasypayPayment>;
  }

  getEasypayPayments(): Promise<EasypayPayment[]> {
    return this.firestoreService.getCollection('easypay-payments');
  }

  getEasypayPaymentMbDetailsForUser(userUID): any {
    return new Promise(resolve => {
      this.firestoreService.getRecordsByProperty('easypay-payments', 'customer.key', '==', userUID).then(records => {
        console.log('records.length', records.length);
        let lastMBRecord = null;
        if (records && records.length) {
          records.forEach(r => {
            if (r.method.type === 'MB') {
              lastMBRecord = r;
            }
          });
          console.log('lastMbRecord', lastMBRecord)
          resolve(lastMBRecord);
        } else {
          resolve(null);
        }
      });
    });
  }

  updateEasypayPayment(easypayPayment: EasypayPayment): Promise<EasypayPayment> {
    return this.firestoreService
    .addOrUpdateRecord('easypay-payments', JSON.parse(JSON.stringify(easypayPayment))) as Promise<EasypayPayment>;
  }

  removeEasypayPayment(uid: string) {
    return this.firestoreService.removeRecord('easypay-payments', uid);
  }

  observeEasypayPayment(uid: string): Observable<EasypayPayment> {
    return this.firestoreService.observeRecord('easypay-payments', uid);
  }

  observeEasypayPayments(): Observable<EasypayPayment[]> {
    return this.firestoreService.observeCollection('easypay-payments');
  }

  private buildRequestBody(user: User | null, orderId: string, amount: number, method: string) {
    if (!user) {
      console.error('buildRequestBody NO USER!');
      return;
    } else {
      return {
        customer: {
          uid: user?.uid,
          name: user?.name,
          email: user?.email,
          phone: user?.phoneNumber,
          fiscalNumber: user?.fiscalNumber
        },
        orderId,
        amount,
        method,
        addToWallet: true
      };
    }
  }

}

export const EasypayService = new EasypayServiceClass();
