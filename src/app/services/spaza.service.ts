import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SpazaService {
  uid: any;
  constructor(public afs: AngularFirestore, 
    public afAuth: AngularFireAuth,
    private alertCtrl : AlertController,
    private route : Router
    ) {

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

  deleteComment(Sid, Cid){
    return this.afs.collection('spazashop').doc(Sid).collection('comments').doc(Cid).delete();
  }
  updateComment(Suid, Cuid, text, rate){
    return this.afs.collection('spazashop').doc(Suid).collection('comments').doc(Cuid).update({
      content:text,
      rate:rate,
    });
  }

  addproduct(Sid, product){
    return this.afs.collection('spazashop').doc(Sid).collection('products').add(product);
  }
  updateproduct(suid,key,product){
    return this.afs.collection('spazashop').doc(suid).collection('products').doc(key).update(product);
  }
  deleteprodduct(sid , pid){
    return this.afs.collection('spazashop').doc(sid).collection('products').doc(pid).delete();
  
  }

  deleteSpaza(Sid){
    return this.afs.collection('spazashop').doc(Sid).delete().then(()=>{
      
      this.alertCtrl.create({
          // message: 'Your spaza is successfully deleted',
          subHeader: 'Your spaza is successfully deleted',
          buttons: [
  
            {
              text: 'ok',
              handler: () => {
                this.route.navigateByUrl('profile');
              }
            }
          ]
        }).then(
          alert => alert.present()
        );
    })
  }
}
