import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera} from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

import {HttpClientModule} from '@angular/common/http'
import { PopoverPageModule } from './pages/popover/popover.module';
import { AddcommentPage } from './pages/addcomment/addcomment.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared/shared.module';
import { UpdatecommentPage } from './pages/updatecomment/updatecomment.page';
import { AddproductPage } from './pages/addproduct/addproduct.page';
import { EditproductPage } from './pages/editproduct/editproduct.page';
import { ProductlistcustomerPageModule } from './pages/productlistcustomer/productlistcustomer.module';
import { ProductlistcustomerPage } from './pages/productlistcustomer/productlistcustomer.page';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';



const firebaseConfig = {
  apiKey: "AIzaSyDMJCzNKJe3XDsfEdAPYnEAZWdsva0dTFU",
  authDomain: "spazatrack.firebaseapp.com",
  databaseURL: "https://spazatrack.firebaseio.com",
  projectId: "spazatrack",
  storageBucket: "spazatrack.appspot.com",
  messagingSenderId: "822494409282",
  appId: "1:822494409282:web:3ce7dc82682553cdcb33db"
};

@NgModule({
  declarations: [
    AppComponent, 
    AddcommentPage,  
    UpdatecommentPage, 
    AddproductPage, 
    EditproductPage,
    ProductlistcustomerPage
  ],
  entryComponents: [
    AddcommentPage,  
    UpdatecommentPage,
     AddproductPage, 
     EditproductPage,
     ProductlistcustomerPage
    ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    PopoverPageModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    PhotoViewer,
    Geolocation ,
    Camera,
    File,
    LaunchNavigator
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
