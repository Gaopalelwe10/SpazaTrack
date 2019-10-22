import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-productlistcustomer',
  templateUrl: './productlistcustomer.page.html',
  styleUrls: ['./productlistcustomer.page.scss'],
})
export class ProductlistcustomerPage implements OnInit {

  spazaRef: AngularFirestoreDocument<any>;
  productRef: AngularFirestoreCollection<any>;
  productList;
  spazauid;
  size;

  constructor(
    private afs: AngularFirestore,
    private navParams: NavParams,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService : AuthService
  ) {
    this.spazauid = this.navParams.get('spazauid');
  }

  ngOnInit() {
    this.spazaRef = this.afs.doc(`spazashop/${this.spazauid}`)
    // this.postRef = this.afs.doc('posts/testPost')
    this.productRef = this.spazaRef.collection('products', ref => ref.orderBy('createdAt', 'desc'));

    this.productRef.ref.get().then((query) => {
      this.size = query.size
      if (this.size == 0) {
        this.productList = 0
        this.alertCtrl.create({
          // message: 'You are to delete your comment',
          subHeader: 'The are Currently no products to show',
          buttons: [

            {
              text: 'ok',
              handler: () => {
                this.close()
              }
            }
          ]
        }).then(
          alert => alert.present()
        );
      } else {
        this.productRef.snapshotChanges().subscribe(data => {

          this.productList = data.map(e => {
            return {
              key: e.payload.doc.id,
              ...e.payload.doc.data()
            } as Product;
          });
          console.log(this.productList);
        })
      }
    })

  }

  close() {
    this.modalCtrl.dismiss();
  }
  zoom(user){
    this.authService.zoom(user)
  }
}
