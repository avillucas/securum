import { Injectable } from '@angular/core';
import { Flashlight } from '@ionic-native/flashlight/ngx';

@Injectable({
  providedIn: 'root'
})
export class FlashService {

  constructor(private flashlight: Flashlight) { }

  on(){
    this.flashlight.switchOn();
  }

  off(){
    this.flashlight.switchOff();
  }

  on5Minutes(){
    this.on();
    setTimeout( ()=>this.off(),3000);
  }
}
