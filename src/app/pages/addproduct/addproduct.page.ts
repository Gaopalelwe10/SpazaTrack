import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalController, AlertController } from '@ionic/angular';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { SpazaService } from 'src/app/services/spaza.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {
  spazauid
  spazaRef: AngularFirestoreDocument<any>;
  productRef: AngularFirestoreCollection<any>;

  uploads: FormGroup;
  picUrl1;
  uploadPercent: Observable<number>;
  downloadU: any;
  uniqkey: any;
  urlPath;

  product = {
    image: "",
    ProName: "",
    Price: 0,
    Type: "",
    createdAt: 0,
  }
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    public modalCtrl: ModalController,
    public fb: FormBuilder,
    private storage: AngularFireStorage,
    private spazaService: SpazaService,
    private routeA: ActivatedRoute,
    private alertCtrl: AlertController
  ) {
    this.routeA.queryParams
      .subscribe(params => {
        this.spazauid = params.spazauid;
        console.log("user " + this.spazauid);

      });

    this.picUrl1 = 'https://feedback.seekingalpha.com/s/cache/da/0c/da0c3cbb1bced750fc60725f81ad275e.png'

    this.uploads = fb.group({
      Product: ['', Validators.required],
      price: ['', Validators.required],
      Type: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.spazaRef = this.afs.doc(`spazashop/${this.spazauid}`)
    // this.postRef = this.afs.doc('posts/testPost')
    this.productRef = this.spazaRef.collection('products', ref => ref.orderBy('createdAt', 'desc'))
  }


  upload(event) {
    const file = event.target.files[0];
    this.uniqkey = 'PIC' + Math.random().toString(36).substring(2);;
    const filePath = this.uniqkey;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();


    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadU = fileRef.getDownloadURL().subscribe(url => {
          console.log(url);
          this.urlPath = url
          this.uploadPercent = null;
        });
      })
    ).subscribe();
  }
  add() {
    this.product.createdAt = Date.now();
    this.product.image = this.urlPath;
    this.product.Price = this.uploads.value.price;
    this.product.ProName = this.uploads.value.Product;
    this.product.Type = this.uploads.value.Type;

    console.log(this.product)
    this.spazaService.addproduct(this.spazauid, this.product).then(() => {
      this.alertCtrl.create({
        // message: 'You are to delete your comment',
        subHeader: 'Product Added to Grocery',
        buttons: [

          {
            text: 'ok',
            handler: () => {
              this.close();
            }
          }
        ]
      }).then(
        alert => alert.present()
      );
    })

  }

  close() {
    this.modalCtrl.dismiss();
  }
}
