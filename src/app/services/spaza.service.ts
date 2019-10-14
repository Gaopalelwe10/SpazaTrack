import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SpazaService {
  uid:any;
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth) {
    
   }

  getSpazas(){
    return this.afs.collection('spazashop').valueChanges();
  }

  updateSpaza(uid){
     return this.afs.doc<Updatespaza>(`spazashop/${uid}`).valueChanges()
  }
  
}
