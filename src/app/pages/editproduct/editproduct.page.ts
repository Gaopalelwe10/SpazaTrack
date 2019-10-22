import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SpazaService } from 'src/app/services/spaza.service';

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
  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    public fb: FormBuilder,
    private spazaService: SpazaService,
    private alertCtrl: AlertController
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
