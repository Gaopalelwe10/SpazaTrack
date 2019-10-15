import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap, finalize} from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from 'firebase'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;

  selectedFile= null;
  uploadPercent: any;
  downloadU: any;
  uniqkey :any;
  today :any = new Date() ;
  date = this.today.getDate()+""+(this.today.getMonth()+1)+""+this.today.getFullYear();
  time = this.today.getHours() +""+ this.today.getMinutes();
  dateTime = this.date+""+this.time;

  progress
  constructor(
    private afs: AngularFirestore, 
    private nav: NavController, 
    public afAuth: AngularFireAuth, 
    private alertCtrl : AlertController,
    private storage: AngularFireStorage,
    private Viewer : PhotoViewer,
    private camera: Camera,
    private file: File
     ) { 
    afAuth.auth.onAuthStateChanged((user)=>{
      if(user){
        this.nav.navigateRoot("home");
      }else{
        this.nav.navigateRoot("");
      }
    })
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    )
  }

 
    
  async login(email: string , password: string){
    await this.afAuth.auth.signInWithEmailAndPassword(email,password).then((success)=>{
       console.log(success);
     }).catch((error)=>{
       this.alertCtrl.create({
        // message: 'You can not order more than six',
        subHeader: 'Wrong Password Or Email',
        buttons: ['Ok']}).then(
        alert=> alert.present()
      );
     })
   }
   
   async signup(email, password){
    await this.afAuth.auth.createUserWithEmailAndPassword(email,password).then((success)=>{
      console.log(success);
    }).catch((error)=>{
     console.log(error)
    })
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout(){
    await this.afAuth.auth.signOut().then((success)=>{
      console.log(success);
      console.log("success");
      this.nav.navigateRoot("login");
    }).catch((error)=>{
      console.log(error)
    })
  }

  getUsers(){
    return this.afs.collection('users', ref=>ref.orderBy('displayName')).valueChanges()
  }
  getUID(): string {
		return this.afAuth.auth.currentUser.uid;
  }
  updateRegistered(key,value){
    return this.afs.doc('users/'+ key).update({
      Registered: value,
    })
  }

  uploadProfilePic(event) {
    const file = event.target.files[0];
    this.uniqkey = 'PIC' + this.dateTime;
    const filePath = this.uniqkey ;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
  
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadU =fileRef.getDownloadURL().subscribe(urlPath => {
          console.log(urlPath); 
          // this.MUsers.update({
          //   photoURL: urlPath
          // })
          this.afs.doc('users/'+ this.getUID()).update({
            photoURL: urlPath
          })
          this.uploadPercent=null;
        });
      })
    ).subscribe();  
    return   this.uploadPercent = task.percentageChanges();
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
      const fileRef = firebase.storage().ref('images/' + _imageBlobInfo.fileName);
      const uploadTask = fileRef.put(_imageBlobInfo.imgBlob);
      uploadTask.on(
        'state_changed',
        (_snapshot: any) => {
          console.log(
            'snapshot progess ' +
              (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100
          );
           this.progress = (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100;
          if (this.progress === 100) {
            fileRef.getDownloadURL().then(urlPath => {
              // this.profileUser.imageUrl = url;
               // console.log('profile', this.profileUser.key);
               this.afs.doc('users/'+ this.getUID()).update({
                photoURL: urlPath
              })
             console.log('downloadurl',  urlPath);
             this.progress=null;
             console.log('profile');
          //  this.profileService.updateImage(this.profileUser);
            });
          }
        },
        _error => {
          console.log(_error);
          reject(_error);
        },
        () => {
          // completion...
          resolve(uploadTask.snapshot);
        }
      );
    });
   
   }
}
