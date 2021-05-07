import { Injectable } from '@angular/core';
import { Flashlight } from '@ionic-native/flashlight/ngx';

@Injectable({
  providedIn: 'root'
})
export class FlashService {

  protected prendido:boolean;

  constructor(private flashlight: Flashlight) { 
    this.prendido = false;
  }

  on(){
    if(!this.prendido){
      console.log('prendiendo flash');
      this.flashlight.switchOn(); 
      this.prendido = true;
    }
  }

  off(){
    if(this.prendido){
      console.log('apagando flash');
      this.flashlight.switchOff();
      this.prendido = false;
    }
  }

  on5Minutes(){
    this.on();
    setTimeout( ()=>this.off(),3000);
  }
}
