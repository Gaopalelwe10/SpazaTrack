import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UpdatecommentPage } from './updatecomment.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UpdatecommentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [UpdatecommentPage]
})
export class UpdatecommentPageModule {}
