import { Injectable } from "@angular/core";
import { Observable, Subject, from } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/firestore";

interface Pos {
  x: number;
  y: number;
}
interface Dimension {
  width: number;
  height: number;
  area: number;
}
interface ID {
  id: string;
}

interface Department {
  id: ID;
  name: string;
  color: string;
  created: Date;
  position: Pos;
  dimension: Dimension;
  left: ID;
  right: ID;
  top: ID;
  bottom: ID;
}

interface User {}

interface Project {
  id: ID;
  name: string;
  description: string;
  created: Date;
  departments: Department[];
  numberOfDept: number;
  isRunning: boolean;
  lastExec: Date;
  firstExec : Date;
  owner: User;
  sharedTo: User;
  isDeleted: boolean;
  deleteDate: Date;
}

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

  constructor() {
    this._publish(this.count);
    firebase.initializeApp(this.firebaseConfig);
    console.log(firebase);
    this.db = firebase.firestore();
    this.userCollection = this.db.collection("users");
  }

  private _publish = (data: any) => {
    this._subject.next(data);
  };

  public setCount(countFunc) {
    this.count = countFunc(this.count);
    this._publish(this.count);
  }

  public getProject() {
    console.log("geting data from firestore: ");
    from(this.userCollection.get()).subscribe(resp => {
      console.log("gotten data: ", resp);
    });

    this.userCollection
      .where("name", "==", "eniola")
      .get()
      .then(resp => console.log("data: ", resp.metadata));
  }
  public addUser() {
    from(
      this.userCollection.doc("eniola__1234").set({
        name: "eniola olatunji",
        password: "0932843934",
        date: new Date()
      })
    ).subscribe(resp => {
      console.log(resp);
      this.userCollection
        .where("name", "==", "eniola")
        .get()
        .then(resp => {
          resp.forEach(item => {
            console.log("item: ", item.data());
          });
        });
    });
  }
}
