import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  {
    path: 'home',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },

  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'spazaform', loadChildren: './pages/spazaform/spazaform.module#SpazaformPageModule' },
  { path: 'spazaboard', loadChildren: './pages/spazaboard/spazaboard.module#SpazaboardPageModule' },  { path: 'comment', loadChildren: './pages/comment/comment.module#CommentPageModule' },
  { path: 'popover', loadChildren: './pages/popover/popover.module#PopoverPageModule' },
  { path: 'updatecomment', loadChildren: './pages/updatecomment/updatecomment.module#UpdatecommentPageModule' },
  { path: 'addcomment', loadChildren: './pages/addcomment/addcomment.module#AddcommentPageModule' },
  { path: 'addproduct', loadChildren: './pages/addproduct/addproduct.module#AddproductPageModule' },
  { path: 'productlistowner', loadChildren: './pages/productlistowner/productlistowner.module#ProductlistownerPageModule' },
  { path: 'editproduct', loadChildren: './pages/editproduct/editproduct.module#EditproductPageModule' },
  { path: 'productlistcustomer', loadChildren: './pages/productlistcustomer/productlistcustomer.module#ProductlistcustomerPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
