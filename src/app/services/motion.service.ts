import { Injectable } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Observable } from 'rxjs';
import { Posicion } from '../entities/posicion';

@Injectable({
  providedIn: 'root'
})
export class MotionService {

  private subscription:Observable<DeviceMotionAccelerationData>;
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
  //
  readonly ARRIBA = 'arriba';
  readonly ABAJO = 'abajo';      
  //
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

  get movimientoVerticalDerecha():Posicion  {
      return { vertical:this.VERTICAL, modificada:true, horizontal:this.DERECHA} as Posicion;
  }

  get movimientoVerticalIzquierda():Posicion  {
      return { vertical:this.VERTICAL, modificada:true, horizontal:this.IZQUIERDA} as Posicion;
  }

  get movimientoHorizontalDerecha():Posicion  {
    return { vertical:this.HORIZONTAL, modificada:true, horizontal:this.DERECHA} as Posicion;
  }

  get movimientoHorizontalIzquierda():Posicion  {
    return { vertical:this.HORIZONTAL, modificada:true, horizontal:this.IZQUIERDA} as Posicion;
  }

  handleError(error:any){
    console.log(error)
  }

  determinarMovimiento(acceleration: DeviceMotionAccelerationData):Posicion{
    let posicion:Posicion = {vertical:this.HORIZONTAL, horizontal:null, modificada:false};
    if(
      this.actualX.toFixed(5) != acceleration.x.toFixed(5)  ||
      this.actualY.toFixed(5) != acceleration.y.toFixed(5) ||
      this.actualZ.toFixed(5) != acceleration.z.toFixed(5) 
    ){
      posicion.modificada = true;
      if(this.actualZ < acceleration.z ){
        posicion.vertical = this.HORIZONTAL;
      }

      if(this.actualZ > acceleration.z ){
        posicion.vertical =  this.VERTICAL;
      }
      
      if(this.actualX < acceleration.x ){
        posicion.horizontal =  this.IZQUIERDA;
      }

      if(this.actualY > acceleration.y ){
        posicion.horizontal =  this.DERECHA;
      }
      this.actualX = acceleration.x;
      this.actualY = acceleration.y;
      this.actualZ = acceleration.z;    
    }
    return posicion;
  }

  watch():Observable<DeviceMotionAccelerationData>{    
    this.subscription =  this.deviceMotion.watchAcceleration({frequency:10000});
    return this.subscription;
  }

  
}