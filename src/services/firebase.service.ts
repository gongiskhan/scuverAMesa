import firebase from "@react-native-firebase/app";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class FirebaseServiceClass {

  public auth;
  public firestore;
  public codeConfirm;

  constructor(
  ) {
    // if (!firebase.apps.length) {
    //   this.init();
    // } else {
    //   firebase.app().
    //   }
    //   firebase.app().delete().then(() => {
    //     this.init();
    //   });
    // }

    this.auth = auth();
    this.firestore = firestore();
  }

  init() {
    firebase.initializeApp({
      apiKey: "AIzaSyDxiMAmLUqiYpWyDipDljWYRsYvKCho7Y0",
      authDomain: "scuver-data.firebaseapp.com",
      databaseURL: "https://scuver-data-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "scuver-data",
      storageBucket: "scuver-data.appspot.com",
      messagingSenderId: "326732084118",
      appId: "1:326732084118:web:2ad29e73e90879d830e3b7",
      measurementId: "G-HRSGS1DXSB"
    }).then(() => {
      console.log('INITIALIZED FIREBASE');
      // this.auth = auth();
      // this.firestore = firestore();
    });
  }

}

export const FirebaseService = new FirebaseServiceClass();
