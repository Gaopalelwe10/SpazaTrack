import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SpazaService } from 'src/app/services/spaza.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from 'firebase'
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.page.html',
  styleUrls: ['./editproduct.page.scss'],
})
export class EditproductPage implements OnInit {
  product = {
    image: "",
    ProName: "",
    Price: 0,
    Type: "",
    createdAt: 0,
  }
  editForm: FormGroup
  key;
  image='';
  ProName;
  Price;
  Type;
  spazauid;

  progress;
  uniqkey;
  uploadPercent: Observable<number>;
  downloadU: any;

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    public fb: FormBuilder,
    private spazaService: SpazaService,
    private alertCtrl: AlertController,
    private camera: Camera,
    private file: File,
    private storage: AngularFireStorage,
  ) {
    this.key = this.navParams.get('key');
    this.image = this.navParams.get('image');
    this.ProName = this.navParams.get('ProName');
    this.Price = this.navParams.get('Price');
    this.spazauid = this.navParams.get('spazauid');
    this.Type = this.navParams.get('Type')


    console.log(this.key);
    console.log(this.ProName);
    console.log(this.navParams.get('key'));
    console.log(this.Price);
    console.log(this.Type);
    console.log(this.navParams.get('image'));

    this.editForm = new FormGroup({
      Product: new FormControl(this.ProName, Validators.required),
      price: new FormControl(this.Price, Validators.required),
      Type: new FormControl(this.Type, Validators.required),
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
          this.image=url
          this.uploadPercent = null;
        });
      })
    ).subscribe();
  }


  Update() {
    this.product.image = this.image;
    this.product.Price = this.editForm.value.price;
    this.product.ProName = this.editForm.value.Product;
    this.product.Type = this.editForm.value.Type;
    this.spazaService.updateproduct(this.spazauid, this.key, this.product).then(() => {
      this.alertCtrl.create({
        // message: 'You are to delete your comment',
        subHeader: 'Product updated successfully',
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
    }).catch((err)=>{
      this.alertCtrl.create({
        // message: 'You are to delete your comment',
        subHeader: err.message,
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

  delete(){
    this.spazaService.deleteprodduct(this.spazauid,this.key).then(()=>{
      this.alertCtrl.create({
        // message: 'You are to delete your comment',
        subHeader: 'Product deleted successfully',
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
    }).catch((err)=>{
      this.alertCtrl.create({
        // message: 'You are to delete your comment',
        subHeader: err.message,
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
