import { Injectable, ElementRef } from '@angular/core';
import { AnimationService } from './animation.service';
import { AudioService } from './audio.service';
import { MotionService } from './motion.service';
import { FlashService } from './flash.service';
import { VibrationService } from './vibration.service';
import { DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Posicion } from '../entities/posicion';

@Injectable({
  providedIn: 'root'
})
export class AlarmaService {

  private _activa:boolean;
  private _sonando:boolean;  
  private _element:ElementRef;
  private _hideLogin:boolean;
  private _sensor:any;  

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
  }
  
  set element(element:ElementRef){
    this._element = element;
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
    console.log('solicitando cambios de estado ')    ;
    if(!this._activa){      
      this.activar();         
    }else{
      if(this._sonando) {
        this.solicitudDesactivacion();
      }        
    }
  }
  
  /**
  * Activar la alarma
  */
  activar(){    
    this._activa = true;
    //poner el sensor a revisar
    this._sensor = this.motion.watch().subscribe(this.sensar);
  }

  /**
   * Determina si se modifico en de laguna forma la posicion para dispara la alarma
   * @param Posicion acceleration Cambio de datos
   */
  protected sensar (acceleration: DeviceMotionAccelerationData) {      
    const sentido  = this.motion.determinarMovimiento(acceleration);                  
    //si se modifico en el ultimo momento 
    console.log('sensando ....')    ;
    if(sentido.modificada){          
      console.log('se movio ....')    ;     
      if(!this._sonando){        
        this.sonar();
      }      
      this.cambiarSentido(sentido);                                          
    }    
  }

  protected probarMovimiento(sentido:Posicion){
    this.sonar();    
    this.cambiarSentido(sentido);
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
    return !this._sonando;
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

  cambiarSentido(sentido:Posicion){     
    console.log('cambiando sentido ....')    ;
    if(sentido.horizontal ==this.motion.DERECHA ){           
      //Al cambiar la posición, a izquierda o a derecha, emitirá un sonido distinto para cada lado.            
      this.audio.sonarDerecha();                      
    }else if(sentido.horizontal ==this.motion.IZQUIERDA){           
      //Al cambiar la posición, a izquierda o a derecha, emitirá un sonido distinto para cada lado.          
      this.audio.sonarIzquierda();
    }else{
      this.audio.sonarAlarma();
    }
    //
    if(sentido.vertical == this.motion.VERTICAL){           
      //Al ponerlo vertical, se encenderá la luz (por 5 segundos) y emitirá un sonido.          
      this.flash.on5Minutes();
    }else{           
      //Al ponerlo horizontal, vibrará (por 5 segundos) y emitirá un sonido.                 
      this.vibration.on5Minutes();
    }        
  }

  /**
   * Solicitar la desactivacion de la alarma
   */
  solicitudDesactivacion(){
    console.log('mostrando login....')    ;
    this._hideLogin = false;
  }

  desactivar():boolean{
    console.log('desactivando....')    ;
    this._activa = false;
    this._sonando = false;
    this._hideLogin = true;    
    this.audio.desactivar();
    this.animation.off()    
    this._sensor.unsubscribe();
    this.flash.off();
    this.vibration.off()
    return true;
  }
}
