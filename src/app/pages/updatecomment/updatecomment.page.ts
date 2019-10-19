import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpazaService } from 'src/app/services/spaza.service';
import { AlertController, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-updatecomment',
  templateUrl: './updatecomment.page.html',
  styleUrls: ['./updatecomment.page.scss'],
})
export class UpdatecommentPage implements OnInit {
  spazauid;
  text: string;
  rate = 0;
  tellus;

  key?: string;
  content: string;

  uid: string;
  constructor(
    private spazaService: SpazaService,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private navParams: NavParams) {
  
    this.spazauid = this.navParams.get('spazauid');
    this.key = this.navParams.get('key');
    this.text = this.navParams.get('text');
    this.rate = this.navParams.get('rate');

    console.log("spazauid " + this.navParams.get('spazauid'));
    console.log("key " + this.key)
    console.log("rate " + this.rate)
    console.log("text " + this.text)
    this.onModelChange(this.rate)
  }

  ngOnInit() {
  }

  onModelChange(ev) {

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

  UpdateComment() {
    this.spazaService.updateComment(this.spazauid, this.key, this.text, this.rate).then((success) => {
      // this.alertCtrl.create({
      //   // message: 'You can not order more than six',
      //   subHeader: 'Your comment was successfully updated',
      //   buttons: ['Ok']}).then(

      //   alert=> alert.present()
      // );
      this.alertCtrl.create({
        // message: 'You are to delete your comment',
        subHeader: 'Your comment was successfully updated',
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

    }).catch((err) => {
      this.alertCtrl.create({
        // message: 'You can not order more than six',
        subHeader: err.message,
        buttons: ['Ok']
      }).then(
        alert => alert.present()
      );
    })
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
