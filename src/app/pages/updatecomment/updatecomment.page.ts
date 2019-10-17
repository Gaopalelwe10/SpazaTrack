import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpazaService } from 'src/app/services/spaza.service';
import { AlertController } from '@ionic/angular';

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
  constructor(private routeA: ActivatedRoute, private spazaService: SpazaService, private alertCtrl : AlertController, private route :Router) {
    this.routeA.queryParams
      .subscribe(params => {
        this.spazauid = params.spazauid;
        this.text = params.content;
        this.rate = params.rate;
        this.key = params.key

        console.log("user " + this.spazauid + " rate " + this.rate);

      });
  }

  ngOnInit() {
  }
  onModelChange(ev) {
  
    this.rate=ev;
    console.log( this.rate);
    console.log("hhh :" + ev)
    if(this.rate== 3){
      this.tellus="Tell others why this place was okay";
    }else if(this.rate >3 && this.rate<=5){
      this.tellus="Tell others why you liked this place ";
    }else{
      this.tellus="Tell others why you disliked this place ";
    }
  }
  UpdateComment(){
   this.spazaService.updateComment(this.spazauid, this.key, this.text, this.rate).then((success)=>{
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
          this.route.navigateByUrl('comment');
          }
        }
      ]
    }).then(
      alert=> alert.present()
    );

  }).catch((error)=>{
    this.alertCtrl.create({
     // message: 'You can not order more than six',
     subHeader: 'Wrong Password Or Email',
     buttons: ['Ok']}).then(
     alert=> alert.present()
   );
  })
  }
  
}
