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
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from 'firebase'
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {
  spazauid


  uploads: FormGroup;
  picUrl1;
  uploadPercent: Observable<number>;
  downloadU: any;
  uniqkey: any;
  image='';

  progress;


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
    private alertCtrl: AlertController,
    private camera: Camera,
    private file: File,
  ) {
    this.routeA.queryParams
      .subscribe(params => {
        this.spazauid = params.spazauid;
        console.log("user " + this.spazauid);

      });

    this.picUrl1 = '/assets/img/thumbnail.svg'
    
    this.uploads = fb.group({
      Product: ['', Validators.required],
      price: ['', Validators.required],
      Type: ['', Validators.required],
    });
  }

  ngOnInit() {

  }
  async pickImage() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    try {
      const cameraInfo = await this.camera.getPicture(options);
      const blobInfo = await this.makeFileIntoBlob(cameraInfo);
      const uploadInfo: any = await this.uploadToFirebase(blobInfo);
      console.log(uploadInfo);
      console.log('File Upload Success ');
    } catch (e) {
      console.log(e.message);
      
    }
   }
   
   makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = '';
      this.file
      .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          const { name, nativeURL } = fileEntry;
          // get the path..
          const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
          console.log('path', path);
          console.log('fileName', name);
          fileName = name;
          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          const imgBlob = new Blob([buffer], {
            type: 'image/jpeg'
          });
          console.log(imgBlob.type, imgBlob.size);
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
   }
   
  uploadToFirebase(_imageBlobInfo) {
    console.log('uploadToFirebase');
    return new Promise((resolve, reject) => {
      const fileRef = this.storage.ref('images/' + _imageBlobInfo.fileName);
      const uploadTask = fileRef.put(_imageBlobInfo.imgBlob);

      this.uploadPercent = uploadTask.percentageChanges();

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          this.downloadU =fileRef.getDownloadURL().subscribe(url => {
            console.log(url);
            console.log("done upl")
            this.image = url
            this.uploadPercent = null;
        
          });
        })
      ).subscribe();  
      // uploadTask.on(
      //   'state_changed',
      //   (_snapshot: any) => {
      //     console.log('snapshot progess ' +(_snapshot.bytesTransferred / _snapshot.totalBytes) * 100);
      //      this.progress = (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100;
           
      //     if (this.progress === 100) {
      //       fileRef.getDownloadURL().then(url => {
      //         // this.profileUser.imageUrl = url;
      //          // console.log('profile', this.profileUser.key);
      //       this.image=url
      //        console.log('downloadurl',  url);
      //        this.progress=null;
      //        console.log('profile');
      //     //  this.profileService.updateImage(this.profileUser);
      //       });
      //     }
          
      //   },
      //   _error => {
      //     console.log(_error);
      //     reject(_error);
      //   },
      //   () => {
      //     // completion...
      //     resolve(uploadTask.snapshot);
      //   }
      // );
    });
   }

  upload(event) {
    const file = event.target.files[0];
    this.uniqkey = 'PIC' + Math.random().toString(36).substring(2);
    const filePath = this.uniqkey;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();


    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadU = fileRef.getDownloadURL().subscribe(url => {
          console.log(url);
          this.image = url
          this.uploadPercent = null;
        });
      })
    ).subscribe();
  }


  add() {

    if(this.image == ''){
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
      this.product.createdAt = Date.now();
      this.product.image = this.image;
      this.product.Price = this.uploads.value.price;
      this.product.ProName = this.uploads.value.Product;
      this.product.Type = this.uploads.value.Type;
  
      console.log(this.product)
      this.spazaService.addproduct(this.spazauid, this.product).then(() => {
        this.alertCtrl.create({
          // message: 'You are to delete your comment',
          subHeader: 'Added to product list',
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
    
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
