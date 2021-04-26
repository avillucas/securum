import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';


@Injectable({
  providedIn: 'root'
})
export class VibrationService {

  protected vibrando:boolean;

  constructor(private vibration: Vibration) { 
    this.vibrando = false;
  }

  on(){
    if(!this.vibrando){
      this.vibration.vibrate(1000)
      this.vibrando = true;
    }
  }

  off(){
    if(this.vibrando){
      this.vibration.vibrate(0)
      this.vibrando = false;
    }
  }
  
  on5Minutes(){
    if(!this.vibrando){
      this.on();
      setTimeout( ()=>this.off(),18000);
    }
  }

}
