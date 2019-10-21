import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddproductPage } from '../addproduct/addproduct.page';

@Component({
  selector: 'app-productlistowner',
  templateUrl: './productlistowner.page.html',
  styleUrls: ['./productlistowner.page.scss'],
})
export class ProductlistownerPage implements OnInit {

  spazaRef: AngularFirestoreDocument<any>;
  productRef: AngularFirestoreCollection<any>;
  productList
  spazauid



  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private routeA :ActivatedRoute,
    private modalController : ModalController
    ) { 
      this.routeA.queryParams
      .subscribe(params => {
        this.spazauid = params.spazauid;
        
        console.log("user " + this.spazauid);

      });

    }

  ngOnInit() {
    this.spazaRef = this.afs.doc(`spazashop/${this.spazauid}`)
    // this.postRef = this.afs.doc('posts/testPost')
    this.productRef = this.spazaRef.collection('products', ref => ref.orderBy('createdAt', 'desc'));

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

  async addproduct() {
    const modal = await this.modalController.create({
      component: AddproductPage,
      componentProps:{
        spazauid: this.spazauid,
      },
    });
  
    return await modal.present();

  }
}
