import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductlistcustomerPage } from './productlistcustomer.page';

const routes: Routes = [
  {
    path: '',
    component: ProductlistcustomerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductlistcustomerPage]
})
export class ProductlistcustomerPageModule {}
