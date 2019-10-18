import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-addcomment',
  templateUrl: './addcomment.page.html',
  styleUrls: ['./addcomment.page.scss'],
})
export class AddcommentPage implements OnInit {
  spazaRef: AngularFirestoreDocument<any>;
  commentsRef: AngularFirestoreCollection<any>;


  text: string = '';
  rate = 0;
  tellus;
  isRate: boolean = false;
  spazauid;
  uid

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private navParams: NavParams,
    private alertCtrl: AlertController) {

    this.uid = this.afAuth.auth.currentUser.uid;
    this.rate = this.navParams.get('rate');
    this.spazauid = this.navParams.get('spazauid');


    console.log(this.navParams.get('spazauid'))
    console.log(this.rate)
    this.onModelChange(this.rate);
  }

  ngOnInit() {
    this.spazaRef = this.afs.doc(`spazashop/${this.spazauid}`)
    // this.postRef = this.afs.doc('posts/testPost')
    this.commentsRef = this.spazaRef.collection('comments', ref => ref.orderBy('createdAt', 'desc'))
  }


  async onModelChange(ev) {
    this.rate = ev;
    console.log(this.rate);
    console.log("hhh :" + ev)
    if (this.rate == 3) {
      this.tellus = "Tell others why this place was okay";
    } else if (this.rate > 3 && this.rate <= 5) {
      this.tellus = "Tell others why you liked this place ";
    } else {
      this.tellus = "Tell others why you disliked this place ";
    }
  }

  addComment() {
    this.isRate = false;
    this.commentsRef.add({ content: this.text, rate: this.rate, createdAt: Date.now(), uid: this.uid }).then(() => {

      this.alertCtrl.create({
        // message: 'You are to delete your comment',
        subHeader: 'Comment Added',
        buttons: [

          {
            text: 'ok',
            handler: () => {
              this.text = '';
              this.rate = 0
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
