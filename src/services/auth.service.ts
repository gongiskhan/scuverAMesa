import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import firebase from "firebase";
import {FirebaseService} from "@src/services/firebase.service";

class AuthServiceClass {

  private authUser$ = new ReplaySubject<firebase.User>(1);
  private authUserSub = () => {};

  constructor(
  ) {
    this.trackAuthUser();
  }

  private trackAuthUser() {
    this.authUserSub = FirebaseService.auth.onAuthStateChanged(authUser => {
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

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return FirebaseService.auth.signInWithPopup(provider);
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
