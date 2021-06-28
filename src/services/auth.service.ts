import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import firebase from 'firebase';
import * as GoogleSignIn from 'expo-google-sign-in';
import {FirebaseService} from '@src/services/firebase.service';

class AuthServiceClass {

  private authUser$ = new ReplaySubject<firebase.User>(1);
  private authUserSub = () => {};

  constructor(
  ) {
    this.trackAuthUser();
  }

  private trackAuthUser() {
    this.authUserSub = FirebaseService.auth.onAuthStateChanged(authUser => {
      // console.log('authUser', !!authUser);
      if (authUser != null) {
        this.authUser$.next(authUser);
      }
    });
  }

  getCurrentAuthUser(): Observable<firebase.User> {
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
      if (type === 'success') {
        const credential = firebase.auth.GoogleAuthProvider.credential(user?.auth?.idToken);
        firebase.auth().signInWithCredential(credential).catch((error) => console.error(error));
      }
    } catch ({ message }) {
      console.error('login: Error:' + message);
    }
  }

  async askPhoneCode(phoneNumber: any) {
    console.log('phoneNumber', phoneNumber);
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
