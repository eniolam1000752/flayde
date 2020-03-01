import { Injectable } from "@angular/core";
import { Observable, Subject, from } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { Project } from "./Interfaces";

@Injectable({
  providedIn: "root"
})
export class TestServiceService {
  private _subject: Subject<any> = new Subject();

  public status1: Boolean = false;
  public consumer = this._subject.asObservable();
  public count = 0;

  private firebaseConfig = {
    apiKey: "AIzaSyD_vsshG_Elt4Vb0_C4ljObLHpj87-okEo",
    authDomain: "flayde-85a34.firebaseapp.com",
    databaseURL: "https://flayde-85a34.firebaseio.com",
    projectId: "flayde-85a34",
    storageBucket: "flayde-85a34.appspot.com",
    messagingSenderId: "1065535452323",
    appId: "1:1065535452323:web:aa004ce2db71be30d4bb16",
    measurementId: "G-BEBJT5Y6QB"
  };
  public db: firebase.firestore.Firestore = null;
  public userCollection: firebase.firestore.CollectionReference = null;
  public projectCollection: firebase.firestore.CollectionReference = null;

  constructor() {
    this._publish(this.count);
    firebase.initializeApp(this.firebaseConfig);
    console.log(firebase);
    this.db = firebase.firestore();
    this.userCollection = this.db.collection("users");
    this.projectCollection = this.db.collection("projects");
  }

  private _publish = (data: any) => {
    this._subject.next(data);
  };

  public setCount(countFunc) {
    this.count = countFunc(this.count);
    this._publish(this.count);
  }

  public getProject(userId) {
    console.log("geting data from firestore: ");
    return from(this.projectCollection.where("userId", "==", userId).get());
  }
  public addProject(projectId, project) {
    console.log("geting data from firestore: ");
    return from(this.projectCollection.doc(projectId).set(project));
  }
  public addUser(uid: string, data) {
    return from(
      this.userCollection.doc(uid).set({
        name: data.username,
        email: data.email,
        date: new Date()
      })
    );
  }

  public signUpUser(regData: any) {
    return from(
      firebase
        .auth()
        .createUserWithEmailAndPassword(regData.email, regData.password)
    );
  }
  public addUserToFireStore(data) {
    return;
  }
  public loginUser(email: string, password: string) {
    return from(firebase.auth().signInWithEmailAndPassword(email, password));
  }
  public logoutUser() {
    return from(firebase.auth().signOut());
  }
  public currentUser() {
    return firebase.auth().currentUser;
  }
  public onAuthStateChanged() {
    return new Observable(observe => {
      firebase.auth().onAuthStateChanged(user => observe.next(user));
    });
  }
}
