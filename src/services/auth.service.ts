import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import * as GoogleSignIn from 'expo-google-sign-in';
import {FirebaseService} from '@src/services/firebase.service';
import {UserService} from "@src/services/user.service";
import {User} from "@src/models/user";
import {FirestoreService} from "@src/services/firestore-utils/firestore.service";

class AuthServiceClass {

  private authUser$ = new ReplaySubject<any>(1);
  private authUserSub = () => {};
  userService = UserService;
  phoneBeingVerified;

  constructor(
  ) {
    this.trackAuthUser();
  }

  private trackAuthUser() {
    this.authUserSub = FirebaseService.auth.onAuthStateChanged(authUser => {
      this.authUser$.next(authUser);
    });
  }

  getCurrentAuthUser(): Observable<any> {
    return this.authUser$.asObservable();
  }

  registerUser(email: string, password: string) {
    return FirebaseService.auth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string) {
    return FirebaseService.auth.signInWithEmailAndPassword(email, password);
  }

  async signInWithGoogle() {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      console.log('USER FROM GOOGLE', type, user);
      if (type === 'success') {
        const credential = FirebaseService.auth.GoogleAuthProvider.credential(user?.auth?.idToken);
        FirebaseService.auth.signInWithCredential(credential).then(authUser => {
          console.log('authUser', authUser);
          if (authUser.additionalUserInfo?.isNewUser) {
            UserService.addUser({
              name: authUser.user?.displayName || (authUser.additionalUserInfo?.profile as any).name,
              email: authUser.user?.email || (authUser.additionalUserInfo?.profile as any).email,
              phoneNumber: authUser.user?.phoneNumber,
              photoUrl: authUser.user?.photoURL || (authUser.additionalUserInfo?.profile as any).picture,
            } as User);
          }
        }).catch((error) => console.error(error));
      }
    } catch ({ message }) {
      console.error('login: Error:' + message);
    }
  }

  async askPhoneCode(phoneNumber: any) {
    if (phoneNumber.toString().indexOf('351') === -1) {
      phoneNumber = '+351' + phoneNumber;
    }
    console.log('phoneNumber', phoneNumber);
    FirebaseService.auth.settings.appVerificationDisabledForTesting = true;
    FirebaseService.auth.signInWithPhoneNumber(phoneNumber).then((p) => {
      console.log('signInWithPhoneNumber ok');
      this.phoneBeingVerified = phoneNumber;
      FirebaseService.codeConfirm = p;
    }).catch(err => console.error('ERROR', err));
  }

  async verifySMSCode(code: any) {
    FirebaseService.codeConfirm.confirm(code).then(authUser => {
      console.log('verifySMSCode authUser', authUser);
      setTimeout(() => {
        UserService.getCurrentUser().then(u => {
          if (!u || (u.phoneNumber != this.phoneBeingVerified && `+351${u.phoneNumber}` != this.phoneBeingVerified) ) {
            if (authUser.additionalUserInfo?.isNewUser) {
              UserService.addUser({
                name: authUser.user?.displayName || (authUser.additionalUserInfo?.profile as any)?.name || '',
                email: authUser.user?.email || (authUser.additionalUserInfo?.profile as any)?.email || '',
                phoneNumber: this.phoneBeingVerified,
                photoUrl: authUser.user?.photoURL || (authUser.additionalUserInfo?.profile as any)?.picture || '',
              } as User);
            }
          }
        });
      }, 500);
    });
  }

  async getCurrentProviderId() {
    const authUser = await this.getCurrentAuthUser().pipe(take(1)).toPromise();

    if (authUser) return authUser?.providerData[0]?.providerId;
    else return null;
  }

  signOut() {
    return FirebaseService.auth.signOut();
  }

  async isSignedIn(): Promise<boolean> {
    const authUser = await this.getCurrentAuthUser().pipe(take(1)).toPromise;

    // @ts-ignore
    if (authUser) return true;
    else return false;
  }

  async getCurrentUserEmail() {
    const authUser = await this.getCurrentAuthUser().pipe(take(1)).toPromise();

    if (authUser) return authUser.email;
    else return null;
  }

  sendEmailToResetPassword(email: string) {
    return FirebaseService.auth.sendPasswordResetEmail(email);
  }

  ngOnDestroy() {
    this.authUserSub();
  }

}

export const AuthService = new AuthServiceClass();
