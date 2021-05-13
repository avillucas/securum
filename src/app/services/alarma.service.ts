import { Injectable, ElementRef } from '@angular/core';
import { AnimationService } from './animation.service';
import { AudioService } from './audio.service';
import { MotionService } from './motion.service';
import { FlashService } from './flash.service';
import { VibrationService } from './vibration.service';
import { Movement } from '../entities/movement';
import { HorizontalDirection, VerticalDirection } from '../entities/direction.enum';
import { Plugins, MotionOrientationEventResult, PluginListenerHandle } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AlarmaService {

  private _considerarMovimiento:boolean;
  //
  private _activa:boolean;
  private _sonando:boolean;  
  private _element:ElementRef;
  private _hideLogin:boolean;
  //
  public actualAlpha: number;
  public actualBeta: number;
  public actualGamma: number;
  public actualPosicion:Movement;
  
  public movimiento:Movement;
  readonly CLASS_APAGADA = 'apagada';
  public alarmaClass:string;

  constructor(    
    public animation:AnimationService,
    public audio:AudioService,    
    public motion:MotionService,
    public flash:FlashService,
    public vibration:VibrationService
  ) { 
    this._activa = false;
    this._sonando = false;
    this._element = null;
    this._hideLogin = true;
    this.actualAlpha = null;              
    this.alarmaClass = this.CLASS_APAGADA;
  }
  
  set element(element:ElementRef){
    this._element = element;
  }

  dejarDeMirarMovimiento()
  {        
    this._sensor.remove();
  }
  get sonando():boolean {
    return this._sonando;
  }

  get hideLogin():boolean {
    return this._hideLogin;
  }

  get activa():boolean {
    return this._activa;
  }

  preload(){
    this.audio.preload();    
  }
  
  cambiarEstado(){    
    console.log('solicitando cambios de estado ',this._activa)    ;
    if(!this._activa){      
      this.activar();         
    }else{      
      this.solicitudDesactivacion();      
    }
  }
  
  protected _sensor:PluginListenerHandle; 
  /**
  * Activar la alarma
  */
  activar(){    
    this.alarmaClass = '';
    this._activa = true;
    console.log('activando sensor ....')    ;
    this.actualPosicion = {vertical:null, horizontal:null, modificada:false};
    //
    this.actualAlpha =  null;          
    this.actualGamma = null;          
    this.actualBeta =  null;     
    this._considerarMovimiento = false;    
    //
    this._sensor = Plugins.Motion.addListener(
      'orientation',
      (orientation:MotionOrientationEventResult) => {        
        //https://developer.mozilla.org/en-US/docs/Web/Events/Orientation_and_motion_data_explained                  
        if(this.actualGamma != orientation.gamma || this.actualGamma != orientation.beta ){                      
          console.log('beta:',this.actualBeta,'gamma:',this.actualGamma);
          console.log('position  ',this.actualPosicion.vertical, this.actualPosicion.horizontal);                          
            if(this.actualBeta > 10.5  ){
              this._considerarMovimiento = true;
            }
          // alpha: rotation around z-axis
          // beta: front back motion +180 vertical  -180 
            if(this.actualBeta > 67.5 ){              
              this.actualPosicion.vertical = VerticalDirection.VERTICAL;
              this.actualPosicion.modificada = true;
            }else if(this.actualGamma > 67.5 ){
            // gamma: left -90 to right +90 
              this.actualPosicion.horizontal =  HorizontalDirection.DERECHA;
              this.actualPosicion.modificada = true;
            }else if(this.actualGamma < -67.5 ){
              //-y
              this.actualPosicion.horizontal =  HorizontalDirection.IZQUIERDA;
              this.actualPosicion.modificada = true;
            }else if(this.actualBeta < 10.5 && this._considerarMovimiento ){              
              this.actualPosicion.vertical =  VerticalDirection.HORIZONTAL;              
              this.actualPosicion.modificada = true;
            }            
            if(this.actualGamma ==  null ){
              this.actualPosicion.modificada = false;
            }            
            this.actualAlpha = Math.round(orientation.alpha);          
            this.actualGamma = Math.round(orientation.gamma);          
            this.actualBeta =  Math.round(orientation.beta);    
            if(this.actualPosicion.modificada){
              this.cambiarSentido(this.actualPosicion);                                                                        
            }
        }
        
    });
  }

  protected probarMovimiento(movimiento:Movement){
    this.sonar();    
    this.cambiarSentido(movimiento);
    console.log('activo:', this._activa);
    console.log('sonando:', this._sonando);    
  }

  probarMovimientoVerticalDerecha(){
    this.probarMovimiento(this.motion.movimientoVerticalDerecha);
  }

  probarMovimientoVerticalIzquierda(){
    this.probarMovimiento(this.motion.movimientoVerticalIzquierda);
  }

  probarMovimientoHorizontalDerecha(){
    this.probarMovimiento(this.motion.movimientoHorizontalDerecha);
  }
  
  probarMovimientoHorizontalIzquierda(){
    this.probarMovimiento(this.motion.movimientoHorizontalIzquierda);
  }

  get ocultarMensajeActivar():boolean {
    return this._activa;
  }

  get ocultarMensajeADesactivarSirena():boolean {
    return !this._activa || !this._hideLogin;
  }  

  /**
   * Arranca a sonar la alarma
   */
  sonar(){    
    if(this._activa){
      console.log('sonando....')    ;
      //marcar como sonando 
      this._sonando = true;      
      this.animation.on(this._element);                
    }
  }

  cambiarSentido(movimiento:Movement){     
    console.log('cambiando sentido ....','horizontal',movimiento.horizontal,'vertical',movimiento.vertical,'modificado:',movimiento.modificada)    ;
    if(movimiento.horizontal == HorizontalDirection.DERECHA){           
      //Al cambiar la posición, a izquierda o a derecha, emitirá un sonido distinto para cada lado.            
      console.log('sonando derecha');
      this.audio.sonarDerecha();                      
    }else if(movimiento.horizontal == HorizontalDirection.IZQUIERDA){           
      //Al cambiar la posición, a izquierda o a derecha, emitirá un sonido distinto para cada lado.          
      console.log('sonando izquierda');
      this.audio.sonarIzquierda();
    }else{
      console.log('sonando otro');
      this.audio.sonarAlarma();
    }
    this.sonar();
    //
    if(movimiento.vertical == VerticalDirection.VERTICAL){           
      //Al ponerlo vertical, se encenderá la luz (por 5 segundos) y emitirá un sonido.          
    console.log('luz vertical');
      this.flash.on5Minutes();
    }else{           
      console.log('vibra horizontal');
      //Al ponerlo horizontal, vibrará (por 5 segundos) y emitirá un sonido.                 
      this.vibration.on5Minutes();
    }     
    this.dejarDeMirarMovimiento();
  }

  /**
   * Solicitar la desactivacion de la alarma
   */
  solicitudDesactivacion(){
    console.log('Mostrando login....')    ;
    this._hideLogin = false;
  }

  desactivar():boolean{
    console.log('desactivando....')    ;
    this._activa = false;
    this._sonando = false;
    this._hideLogin = true;    
    this.audio.desactivar();
    this.dejarDeMirarMovimiento();
    this.animation.off()        
    this.flash.off();
    this.vibration.off()
    this.actualAlpha = null;   
    this.alarmaClass= this.CLASS_APAGADA; 
    return true;
  }
}
