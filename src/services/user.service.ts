import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import { map, take } from 'rxjs/operators';
import {User} from '../models/user';
import {AuthService} from './auth.service';
import {FirestoreService} from './firestore-utils/firestore.service';

class UserServiceClass {

  // @ts-ignore
  private currentUser$ = new BehaviorSubject<User | n>(null);
  private currentUserSub = new Subscription();
  authService = AuthService;
  firestoreService = FirestoreService;

  constructor(
  ) {
    this.trackCurrentUser();
  }

  // --------------------------------------------------------------------------------------------------------
  // Current User Functions
  // --------------------------------------------------------------------------------------------------------

  private trackCurrentUser() {
    this.authService.getCurrentAuthUser().subscribe((authUser) => {
      this.currentUserSub.unsubscribe();
      if (!authUser) { // @ts-ignore
        return this.currentUser$.next(null);
      }
      this.currentUserSub = this.observeUserByEmail(authUser.email || '').subscribe(user => this.currentUser$.next(user));
    });
  }

  observeCurrentUser(): Observable<User> {
    return this.currentUser$.asObservable();
  }

  getCurrentUser(): Promise<User | null> {
    return new Promise(resolve => {
      resolve(this.currentUser$.value || null);
    });
  }

  // --------------------------------------------------------------------------------------------------------
  // Generic Firebase Functions
  // --------------------------------------------------------------------------------------------------------

  getUser(uid: string): Promise<User> {
    return this.observeUser(uid).pipe(take(1)).toPromise();
  }

  getUserByEmail(email: string): Promise<User> {
    return this.firestoreService.getRecordByProperty('users', 'email', '==', email) as Promise<User>;
  }

  // getUserByShop(shopId: string): Promise<User> {
  //   return this.firestoreService.observeRecordByProperty('users', 'shopId', '==', shopId).pipe(
  //     take(1),
  //     map((user: User) => user ? merge(new User(), user) : null)
  //   ).toPromise();
  // }

  getUsers(): Promise<User[]> {
    return this.observeUsers().pipe(take(1)).toPromise();
  }

  // observeUsersWithWallet(): Observable<User[]> {
  //   return this.firestoreService.observeRecordsByProperty('users', 'wallet', '>', 0).pipe(map((users: User[]) => users.map(user => user ? merge(new User(), user) : null)));
  // }

  addUser(user: User): Promise<User> {
    return this.firestoreService.addOrUpdateRecord('users', {...user}) as Promise<User>;
  }

  updateUser(user: User): Promise<User> {
    return this.firestoreService.addOrUpdateRecord('users', JSON.parse(JSON.stringify(user))) as Promise<User>;
  }

  removeUser(uid: string) {
    return this.firestoreService.removeRecord('users', uid);
  }

  observeUser(uid: string): Observable<User> {
    return new Observable(observer => {
      this.firestoreService.observeRecord('users', uid).pipe(map((user: User) => user ? {...new User(), ...user} : null)).subscribe(user => {
        // @ts-ignore
        observer.next(user);
      });
    });
  }

  observeUserByEmail(email: string): Observable<User | null> {
    return new Observable(observer => {
      console.log('Observing user by email.');
      this.firestoreService.observeRecordByProperties('users', ['email'], '==', [email]).subscribe(record => {
        console.log('RECORD', record);
        if (record) {
          observer.next(record);
        } else {
          observer.next(null);
        }
      });
    });
  }

  observeUsers(): Observable<User[]> {
    return new Observable(observer => {
      this.firestoreService.observeCollection('users').pipe(map((users: User[]) => users.map(user => user ? {...new User(), ...user} : null))).subscribe(users => {
        // @ts-ignore
        observer.next(users);
      });
    });
  }

  isAuthFullyRegistered(authUserId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getUser(authUserId).then((user) => resolve(user ? true : false));
    });
  }

}

export const UserService = new UserServiceClass();
