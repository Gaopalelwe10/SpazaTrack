import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, ModalController } from '@ionic/angular';
import { SpazaService } from 'src/app/services/spaza.service';
import { Router } from '@angular/router';
import { AddcommentPage } from '../addcomment/addcomment.page';
import { UpdatecommentPage } from '../updatecomment/updatecomment.page';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  constructor(private popoverController: PopoverController, 
    private alertCtrl: AlertController, 
    public spazaService: SpazaService, 
    private route: Router,
    public modalController : ModalController) { }

  ngOnInit() {
  }
  // this.text = params.content;
  //       this.rate = params.rate;
  //       this.key = params.key
  async Edit(comment, spazauid) {
    console.log(comment)
    this.DismissClick();
    // this.route.navigate(['updatecomment'], { queryParams: { spazauid: spazauid, key: comment.key, content: comment.content, rate: comment.rate } })
    const modal = await this.modalController.create({
      component:  UpdatecommentPage,
      componentProps:{
        key:comment.key,
        text:comment.content,
        rate:comment.rate,
        spazauid: spazauid,
      },
    });
    ;
    return await modal.present();
  }

  Delete(comment, spazauid) {
    console.log("spazauid " + spazauid)
    console.log(comment.key)
    this.DismissClick();
    const alert = this.alertCtrl.create({
      message: 'You are about to delete your comment',
      subHeader: 'Delete',
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
            this.spazaService.deleteComment(spazauid, comment.key);
            console.log('Confirm clicked');
          }
        }
      ]
    }).then(
      alert => alert.present()
    );
  }

  async DismissClick() {
    await this.popoverController.dismiss();
  }
}
