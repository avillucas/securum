import { Injectable } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MotionService {

  private subscription;
  //
  private actualX: number;
  private actualY: number;
  private actualZ: number;
  // 
  readonly QUIETO = 'quieto';
  readonly DERECHA = 'derecha';
  readonly IZQUIERDA = 'izquierda';
  readonly VERTICAL = 'vertical';
  readonly HORIZONTAL = 'horizontal';

  readonly ARRIBA = 'arriba';
  readonly ABAJO = 'abajo';  
  
  

  constructor(private deviceMotion: DeviceMotion) { 

      // Get the device current acceleration
      this.deviceMotion.getCurrentAcceleration().then(
        (acceleration: DeviceMotionAccelerationData) => {
          this.actualX = acceleration.x;
          this.actualY = acceleration.y;
          this.actualZ = acceleration.z;
        },
        (error: any) => this.handleError
      );
    
  }

  handleError(error){
    console.log(error)
  }

  determinarMovimiento(acceleration: DeviceMotionAccelerationData):string{
    console.log('x:',acceleration.x, 'y:',acceleration.y,'z:',acceleration.z);
    
    if(this.actualX < acceleration.x ){
      return this.IZQUIERDA;
    }

    if(this.actualY > acceleration.y ){
      return this.DERECHA;
    }

    if(this.actualZ < acceleration.z ){
      return this.ABAJO;
    }

    if(this.actualZ > acceleration.z ){
      return this.ARRIBA;
    }

    //@todo determinar como saber esto return this.VERTICAL
    //@todo determinar como saber esto return this.HORIZONTAL
    return this.QUIETO;
  }

  leer():Observable<DeviceMotionAccelerationData>{
    return this.deviceMotion.watchAcceleration();
  }

}
