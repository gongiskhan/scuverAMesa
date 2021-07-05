/* tslint:disable: max-line-length */
import {Observable} from 'rxjs';
import {WhereFilterOp} from '@firebase/firestore-types';
import {FirebaseService} from "@src/services/firebase.service";

class FirestoreServiceClass {

  constructor(
  ) { }

  getRecord(collection: string, uid: string): Promise<any> {
    return new Promise(resolve => {
      FirebaseService.firestore.collection(collection).doc(uid).get().then(querySnapshot => {
        resolve(querySnapshot.data());
      });
    });
  }

  getRecordByProperty(collection: string, property: string, filterOp: WhereFilterOp = '==', value: any) {
    return new Promise(resolve => {
      FirebaseService.firestore.collection(collection).where(property, filterOp, value).limit(1).get().then(record => {
        resolve(record?.docs[0]?.data());
      });
    });
  }

  // getRecordByProperties(collection: string, properties: string[], filterOp: WhereFilterOp | WhereFilterOp[] = '==', values: any[]): Promise<any> {
  //   return FirebaseService.firestore.collection(collection, (collectionRef) => {
  //     let query: Query;
  //     properties.forEach((property, i) => {
  //       const op = Array.isArray(filterOp) ? filterOp[i] : filterOp;
  //       if (!query) query = collectionRef.where(property, op, values[i]);
  //       else query = query.where(property, op, values[i]);
  //     });
  //     return query.limit(1);
  //   }).valueChanges().pipe(take(1), map(value => value[0])).toPromise();
  // }
  //
  getRecordsByProperty(collection: string, property: string, filterOp: WhereFilterOp = '==', value: any): Promise<any[]> {

    return new Promise(resolve => {
      FirebaseService.firestore.collection(collection).where(property, filterOp, value).get().then(querySnapshot => {
        const results: any = [];
        querySnapshot.forEach(doc => {
          results.push(doc.data());
        });
        resolve(results);
      });
    });
  }

  getRecordsByProperties(collection: string, properties: string[], filterOp: WhereFilterOp | WhereFilterOp[] = '==', values: any[]): Promise<any[]> {
    return new Promise(resolve => {
      let query: any;
      properties.forEach((property, i) => {
        const op = Array.isArray(filterOp) ? filterOp[i] : filterOp;
        if (!query) query = FirebaseService.firestore.collection(collection).where(property, op, values[i]);
        else query = query.where(property, op, values[i]);
      });
      query.onSnapshot().toPromise().then((querySnap: any) => {
        const results: any = [];
        querySnap.docs.forEach((doc: any) => results.push(doc.data()));
        resolve(results);
      });
    });
  }

  addOrUpdateRecord(collection: string, record: any) {
    return new Promise((resolve, reject) => {
      if (record.uid) {
        return this.updateRecord(collection, record)
        .then((rec: any) => resolve(rec))
        .catch(reject);
      } else {
        return this.addRecord(collection, record)
        .then((rec: any) => resolve(rec))
        .catch(reject);
      }
    });
  }

  removeRecord(collection: string, uid: string) {
    return FirebaseService.firestore.collection(collection).doc(uid).delete();
  }

  observeRecord(collection: string, uid: string): Observable<any> {
    return new Observable(observer => {
      FirebaseService.firestore.collection(collection).doc(uid).onSnapshot((snap) => {
        if (snap && snap.data()) {
          observer.next(snap.data());
        }
      });
    });
  }

  // observeRecordByProperty(collection: string, property: string, filterOp: WhereFilterOp = '==', value: any): Observable<any> {
  //   return FirebaseService.firestore.collection(collection, (collectionRef) => {
  //     return collectionRef.where(property, filterOp, value).limit(1);
  //   }).valueChanges().pipe(map(value => value[0]));
  // }
  //
  observeRecordByProperties(collection: string, properties: string[], filterOp: WhereFilterOp | WhereFilterOp[] = '==', values: any[]): Observable<any> {
    return new Observable(observer => {
      const q = FirebaseService.firestore.collection(collection);
      const op = Array.isArray(filterOp) ? filterOp[0] : filterOp;
      let query: any = q.where(properties[0], op, values[0]);
      // properties.slice(1).forEach((property, i) => {
      //   const op = Array.isArray(filtrerOp) ? filterOp[i] : filterOp;
      //   query = query.where(property, op, values[i]);
      // });
      query.onSnapshot((querySnap: any) => {
        console.log('querySnap', querySnap?.docs[0]?.data());
        observer.next(querySnap?.docs[0]?.data());
      });
    });
  }


  observeRecordsByProperty(collection: string, property: string, filterOp: WhereFilterOp = '==', value: any): Observable<any> {
    return new Observable(observer => {
      FirebaseService.firestore.collection(collection).where(property, filterOp, value).onSnapshot(querySnapshot => {
        const records: any = [];
        querySnapshot.forEach(q => {
          records.push(q.data());
        });
        observer.next(records);
      });
    });
  }

  observeRecordsByProperties(collection: string, properties: string[], filterOp: WhereFilterOp | WhereFilterOp[] = '==', values: any[]): Observable<any> {
    return new Observable(observer => {
      let query: any;
      properties.forEach((property, i) => {
        const op = Array.isArray(filterOp) ? filterOp[i] : filterOp;
        if (!query) query = FirebaseService.firestore.collection(collection).where(property, op, values[i]);
        else query = query.where(property, op, values[i]);
      });
      query.onSnapshot().subscribe((querySnap: any) => {
        const results: any = [];
        querySnap.docs.forEach((doc: any) => results.push(doc.data()));
        observer.next(results);
      });
    });
  }

  observeCollection(collection: string): Observable<any> {
    return new Observable(observer => {
      FirebaseService.firestore.collection(collection).onSnapshot(docs => {
        const items: any = [];
        docs.forEach(doc => {
          items.push(doc.data());
        });
        observer.next(items);
      });
    });
  }

  getCollection(collection: string): Promise<any> {
    return FirebaseService.firestore.collection(collection).get();
  }

  private addRecord(collection: any, record: any): Promise<any> {
    return new Promise((resolve, reject) => {
      FirebaseService.firestore.collection(collection).add(record)
      .then((r) => {
        record.uid = r.id;
        this.updateRecord(collection, record).then(resolve).catch(reject);
      });
    });
  }

  private updateRecord(collection: any, record: any) {
    return new Promise((resolve, reject) => {
      FirebaseService.firestore.collection(collection).doc(record.uid).set({...record}, {merge: true})
      .then(() => resolve(record))
      .catch(reject);
    });
  }
}

export const FirestoreService = new FirestoreServiceClass();
