import { Injectable } from '@angular/core';
import { MotionEventResult, MotionOrientationEventResult, PluginListenerHandle, Plugins } from '@capacitor/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Observable } from 'rxjs';
import { Movement } from '../entities/movement';
import { VerticalDirection, HorizontalDirection } from '../entities/direction.enum';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  
  public actualAlpha: string;
  public actualBeta: string;
  public actualGamma: string;
  public actualPosicion:Movement;
  //
  constructor(
    private deviceMotion: DeviceMotion,
    private alertController:AlertController
    ) { 
  }
  
  async presentAlert(header:string) {
    const alert = await this.alertController.create({      
      header: header,          
      buttons: [
        {text: 'Aceptar'}
      ]    
    });
    await alert.present();
  }
  
  private _handler:PluginListenerHandle ;


  unsubscribe()
  {
    
    Plugins.Motion.removeAllListeners();
    this._handler.remove();
  }

  async watch(){            
    this.pedirPermiso();
    console.log('watch');
    this.actualPosicion = {vertical:VerticalDirection.HORIZONTAL, horizontal:null, modificada:false};
  
  }

  get movimientoVerticalDerecha():Movement  {
      return { vertical:VerticalDirection.VERTICAL, modificada:true, horizontal:HorizontalDirection.DERECHA} as Movement;
  }

  get movimientoVerticalIzquierda():Movement  {
      return { vertical:VerticalDirection.VERTICAL, modificada:true, horizontal:HorizontalDirection.IZQUIERDA} as Movement;
  }

  get movimientoHorizontalDerecha():Movement  {
    return { vertical:VerticalDirection.HORIZONTAL, modificada:true, horizontal:HorizontalDirection.DERECHA} as Movement;
  }

  get movimientoHorizontalIzquierda():Movement  {
    return { vertical:VerticalDirection.HORIZONTAL, modificada:true, horizontal:HorizontalDirection.IZQUIERDA} as Movement;
  }

  handleError(error:any){
    this.presentAlert(error);
  }

  /**   
   * 
   * @param DeviceMotionAccelerationData acceleration            
   * -z a la portraid derecha
   * +z a la portraid izquierda 
   * +y a la derecha 
   * -y a la izquierda 
   * +x a parado
   * -x a acostado
   * @returns Movement
  
  determinarMovimiento(acceleration: DeviceMotionAccelerationData):Movement{
  
    let posicion:Movement = {vertical:VerticalDirection.HORIZONTAL, horizontal:null, modificada:false};
    console.log('x:',this.actualX,'y:',this.actualY,'z:',this.actualZ);
    if(
      this.actualX.toFixed(2) != acceleration.x.toFixed(2)  ||
      this.actualY.toFixed(2) != acceleration.y.toFixed(2) ||
      this.actualZ.toFixed(2) != acceleration.z.toFixed(2) 
    ){  
      posicion.modificada = true;
      if(this.actualX < acceleration.x ){
        //+x
        posicion.vertical = VerticalDirection.VERTICAL;
      }else if(this.actualX > acceleration.x ){
        //-x
        posicion.vertical =  VerticalDirection.HORIZONTAL;
      }
      //
      if(this.actualY < acceleration.y ){
        //+y
        posicion.horizontal =  HorizontalDirection.DERECHA;
      }else if(this.actualY > acceleration.y ){
        //-y
        posicion.horizontal =  HorizontalDirection.IZQUIERDA;
      }
      this.actualX = acceleration.x;
      this.actualY = acceleration.y;
      this.actualZ = acceleration.z;    
    }
    return posicion;
   
  }
   */
/*
  watch():Observable<DeviceMotionAccelerationData>{    
    return this.deviceMotion.watchAcceleration({frequency:1000});    
  }
*/


async pedirPermiso(){
  try {
    await DeviceMotionEvent.requestPermission().then((response)=>{
        console.log('permition:',response);
    });
  } catch (error) {
    
  }
  return true;
}
  
}