import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';


@Injectable({
  providedIn: 'root'
})
export class VibrationService {

  constructor(private vibration: Vibration) { }

  on(){
    this.vibration.vibrate(1000)
  }

  off(){
    this.vibration.vibrate(0)
  }
  
  on5Minutes(){
    this.on();
    setTimeout( ()=>this.off(),3000);
  }

}
