import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MapboxService, Feature } from 'src/app/services/mapbox.service';
import { IfStmt } from '@angular/compiler';
import { auth } from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { SpazaService } from 'src/app/services/spaza.service';
import { TouchSequence } from 'selenium-webdriver';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-spazaform',
  templateUrl: './spazaform.page.html',
  styleUrls: ['./spazaform.page.scss'],
})
export class SpazaformPage implements OnInit {

  RegisterForm: string = "true";
  UpdateForm: string = "false";
  form: FormGroup;
  map: any;

  itemList;
  marker?: any;
  startPosition;

  uid: any;
  addresses: string[] = [];
  coodinateses: string[] = [];

  selectedAddress = null;
  selectedcoodinates = null;

  uploadPercent: Observable<number>;
  downloadU: any;
  uniqkey: any;



  urlPath = '';
  list: any;

  lng;
  lat;


  // Email: string;
  photoURL: string;
  spazaName: string;
  Address: string;
  Hours: string;
  Number: string;
  Discription: string;
  Close: string;

  constructor(private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private route: Router,
    private storage: AngularFireStorage,
    public mapboxService: MapboxService,
    public authService: AuthService,
    public spazaService: SpazaService,
    private routeA: ActivatedRoute,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {

    this.routeA.queryParams
      .subscribe(params => {
        this.UpdateForm = params.UpdateForm;
        this.RegisterForm = params.RegisterForm;

        console.log("")
        console.log("RegisterForm " + this.RegisterForm);
        console.log("UpdateForm " + this.UpdateForm);
      });
    this.uid = this.afAuth.auth.currentUser.uid;

    this.form = fb.group({
      Spaza: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30), Validators.required])],
      Discription: ['', Validators.required],
      Address: ['', Validators.required],
      Hours: ['', Validators.required],
      Close: ['', Validators.required],
      Number: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required])],
    });




  }

  ngOnInit() {
    if (this.UpdateForm == "true") {
      this.spazaService.updateSpaza(this.uid).subscribe((data) => {
        this.photoURL = data.photoURL;
      })
    }
  }
  ionViewDidEnter() {
    if (this.UpdateForm == "true") {
      this.spazaService.updateSpaza(this.uid).subscribe((data) => {
        this.selectedAddress = data.Address;
        this.Number = data.Number;
        this.photoURL = data.photoURL;
        this.spazaName = data.spazaName;
        this.Discription = data.Discription;
        this.Hours = data.Hours;
        this.Close = data.Close;
        this.lat = data.lat;
        this.lng = data.lng;
        this.urlPath = data.photoURL;
      })
    }

  }

  Pic(event) {
    const file = event.target.files[0];
    this.uniqkey = 'PIC' + Math.random().toString(36).substring(2);
    const filePath = this.uniqkey;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();


    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadU = fileRef.getDownloadURL().subscribe(urlPath => {
          console.log(urlPath);
          this.urlPath = urlPath
          this.uploadPercent = null;
        });
      })
    ).subscribe();
  }



  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService.search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.coodinateses = features.map(feat => feat.geometry)
          this.addresses = features.map(feat => feat.place_name)
          this.list = features;
          console.log(this.list)
        });
    } else {
      this.addresses = [];
    }
  }
  clear() {
    this.addresses = []
    console.log("hello")
  }
  onSelect(address, i) {
    this.selectedAddress = address;
    //  selectedcoodinates=

    console.log("lng:" + JSON.stringify(this.list[i].geometry.coordinates[0]))
    console.log("lat:" + JSON.stringify(this.list[i].geometry.coordinates[1]))
    this.lng = JSON.stringify(this.list[i].geometry.coordinates[0])
    this.lat = JSON.stringify(this.list[i].geometry.coordinates[1])

    console.log("index =" + i)
    console.log(this.selectedAddress)

    //add to FireBase
    // this.dog.collection('coordinate').add({
    //   lat: this.temp.coordinates[1],
    //   lng: this.temp.coordinates[0],
    //   address: address,
    // }).then(function (ref) {
    //   console.log("document was written with ID : " + ref);
    //   alert("physical address : " + address + " , saved successful..")
    // }).catch(function (ee) {
    //   console.log(ee)
    //   console.log("error while processing ..")
    // });
    this.addresses = [];
  }
  async Register() {
    if(this.urlPath ==''){
      this.alertCtrl.create({
        // message: 'Please upload an image',
        subHeader: 'Please upload an image',
        buttons: [

          {
            text: 'ok',
            handler: () => {

            }
          }
        ]
      }).then(
        alert => alert.present()
      );
    }else{
      const loading = this.loadingCtrl.create({
        message: 'Registering in, Please wait...',
      });
      (await loading).present();
  
      this.afs.collection('spazashop').doc(this.uid).set({
        spazaName: this.form.value.Spaza,
        uid: this.uid,
        Timestamp: Date.now(),
        Discription: this.form.value.Discription,
        Address: this.form.value.Address,
        Hours: this.form.value.Hours,
        Close: this.form.value.Close,
        Number: this.form.value.Number,
        photoURL: this.urlPath,
        Registered: "yes",
        lat: this.lat,
        lng: this.lng,
        commentCount: 0,
  
      }).then(() => {
  
        this.authService.updateRegistered(this.uid, "yes").then(async () => {
          (await loading).dismiss();
          this.route.navigateByUrl('profile')
        })
  
      }).catch(err => {
        alert(err.message)
      })
      this.urlPath = "";
    }
 

  }

  update() {
    this.afs.collection('spazashop').doc(this.uid).update({
      spazaName: this.form.value.Spaza,
      uid: this.uid,
      Discription: this.form.value.Discription,
      Address: this.form.value.Address,
      Hours: this.form.value.Hours,
      Close: this.form.value.Close,
      Number: this.form.value.Number,
      photoURL: this.urlPath,
      lat: this.lat,
      lng: this.lng,

    }).then(() => {
      console.log("updated")
      // this.route.navigateByUrl("spazaboard")
      this.alertCtrl.create({
        // message: 'You are to delete your comment',
        subHeader: 'Your Infor is successfully updated',
        buttons: [

          {
            text: 'ok',
            handler: () => {

            }
          }
        ]
      }).then(
        alert => alert.present()
      );

    }).catch(err => {
      alert(err.message)
    })
    this.urlPath = "";
  }

  delete() {
    const alert = this.alertCtrl.create({
      // message: "Are you sure you want to delete the spaza",
      subHeader: 'Are you sure you want to delete the spaza',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log("delete");
            
            this.spazaService.deleteSpaza(this.uid).then(() => {
              this.spazaService=null
              this.authService.updateRegistered(this.uid, "no")
            })
           
          }
        }
      ]
    }).then(
      alert => alert.present()
    );
  }
  product() {
    this.route.navigate(['productlistowner'], { queryParams: { spazauid: this.uid } });
  }
}