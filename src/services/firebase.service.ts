import firebase from "firebase";

class FirebaseServiceClass {

  public auth;
  public firestore;

  constructor(
  ) {
    firebase.initializeApp({
      apiKey: "AIzaSyDxiMAmLUqiYpWyDipDljWYRsYvKCho7Y0",
      authDomain: "scuver-data.firebaseapp.com",
      databaseURL: "https://scuver-data-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "scuver-data",
      storageBucket: "scuver-data.appspot.com",
      messagingSenderId: "326732084118",
      appId: "1:326732084118:web:2ad29e73e90879d830e3b7",
      measurementId: "G-HRSGS1DXSB"
    });

    this.auth = firebase.auth();
    this.firestore = firebase.firestore();
  }

}

export const FirebaseService = new FirebaseServiceClass();
