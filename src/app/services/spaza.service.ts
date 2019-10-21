import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SpazaService {
  uid: any;
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth) {

  }

  getSpazas() {
    return this.afs.collection('spazashop').valueChanges();
  }

  updateSpaza(uid) {
    return this.afs.doc<Updatespaza>(`spazashop/${uid}`).valueChanges()
  }

  search(ev) {
     console.log("hello" + ev)
  }

  deleteComment(Suid, Cuid){
    return this.afs.collection('spazashop').doc(Suid).collection('comments').doc(Cuid).delete();
  }
  updateComment(Suid, Cuid, text, rate){
    return this.afs.collection('spazashop').doc(Suid).collection('comments').doc(Cuid).update({
      content:text,
      rate:rate,
    });
  }

  addproduct(Suid, product){
    return this.afs.collection('spazashop').doc(Suid).collection('products').add(product);
  }
}
