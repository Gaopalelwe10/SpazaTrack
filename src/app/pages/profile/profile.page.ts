import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  users: any;
  currentuser: string;
  private MUsers: AngularFirestoreDocument
  sub
  username: string;
  photoURL: string;

  constructor(
    private authService: AuthService,
    private Viewer: PhotoViewer,
    public afs: AngularFirestore,
    private alertCtrl: AlertController,
    public afAuth: AngularFireAuth,
    private route: Router,

  ) {
    this.users = this.afs.collection('users', ref => ref.orderBy('displayName')).valueChanges();
    this.currentuser = this.authService.getUID();
    console.log(this.currentuser)
    this.MUsers = afs.doc(`users/${authService.getUID()}`)
    this.sub = this.MUsers.valueChanges().subscribe(event => {
      this.username = event.displayName
      this.photoURL = event.photoURL
    })
  }

  ngOnInit() {
  }

  async NameUpdate(user) {
    const alert = await this.alertCtrl.create({
      subHeader: 'Add/Edit Name',
      inputs: [
        {
          name: 'displayName',
          type: 'text',
          value: user.displayName,
          placeholder: 'displayName'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (inputData) => {
            console.log(inputData.name1)
            this.MUsers.update({

              displayName: inputData.displayName,
            })

          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }
  async AddressUpdate(user) {
    const alert = await this.alertCtrl.create({
      subHeader: 'Add/Edit Address',
      inputs: [

        {
          name: 'Address',
          type: 'text',
          value: user.Address,
          placeholder: 'Address'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (inputData) => {
            console.log(inputData.name1)

            this.MUsers.update({
              Address: inputData.Address,

            })
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }


  RegisterSpaza() {
    // this.route.navigateByUrl("/spazaform");
    this.route.navigate(['/spazaform'], { queryParams: { RegisterForm: "true" } });
  }

  UpdateSpaza() {
    this.route.navigate(['/spazaform'], { queryParams: { RegisterForm: "false", UpdateForm: "true" } });
  }

  ico() {
    this.route.navigateByUrl("home");
  }
}








