import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StarRating } from 'ionic4-star-rating';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [StarRating],
  exports: [ StarRating ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }
