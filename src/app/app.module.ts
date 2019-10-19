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
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared/shared.module';
import { UpdatecommentPage } from './pages/updatecomment/updatecomment.page';

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
  declarations: [AppComponent, AddcommentPage,  UpdatecommentPage],
  entryComponents: [AddcommentPage,  UpdatecommentPage],
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
    SharedModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    PhotoViewer,
    Geolocation ,
    Camera,
    File
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
