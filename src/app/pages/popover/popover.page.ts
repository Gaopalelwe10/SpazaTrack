import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { SpazaService } from 'src/app/services/spaza.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  constructor(private popoverController: PopoverController,   private alertCtrl : AlertController,public spazaService : SpazaService, private route:Router) { }

  ngOnInit() {
  }

  Edit(comment, spazauid){
    console.log(comment)
    this.DismissClick();
   this.route.navigate(['updatecomment'], {queryParams: { spazauid:spazauid, key:comment.key, content: comment.content , rate:comment.rate}})
  }
  Delete(comment,spazauid){
    console.log("spazauid " + spazauid)
    console.log(comment.key)
    this.DismissClick();
    const  alert = this.alertCtrl.create({
      message: 'You are to delete your comment',
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
            this.spazaService.deleteComment(spazauid,comment.key);
            console.log('Confirm clicked');
          }
        }
      ]
    }).then(
      alert=> alert.present()
    );
  }

  async DismissClick() {
    await this.popoverController.dismiss();
  }
}
