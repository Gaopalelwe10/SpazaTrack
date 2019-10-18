import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddcommentPage } from './addcomment.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { StarRating } from 'ionic4-star-rating';

const routes: Routes = [
  {
    path: '',
    component: AddcommentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    // ReactiveFormsModule,
    // SharedModule,
    StarRating
  ],
  exports: [ StarRating ],
  declarations: [AddcommentPage]
})
export class AddcommentPageModule {}
