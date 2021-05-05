import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { TokenInterceptor } from './interceptor/token';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'mytestapp'),
    AngularFireAuthModule,
    AngularFirestoreModule, 
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },     
    NativeAudio,
    DeviceMotion, 
    Flashlight, 
    Vibration,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
