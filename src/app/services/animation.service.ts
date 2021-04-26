import { Injectable, ElementRef, ViewChild } from '@angular/core';
import { Animation,AnimationController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  protected _activo:boolean;
  private animation: Animation;

  constructor(  private animationCtrl: AnimationController ) { 
    this._activo = false;
  }

  on(sirena:ElementRef){
    if(!this._activo){
      this.animation = this.animationCtrl.create()
      .addElement(sirena.nativeElement)
      .duration(300)
      .iterations(Infinity)
      .fromTo('opacity', '1', '0.2')                      
      this.animation.play(); 
      this._activo = true;
    }
  }

  off(){
    if(this._activo){
      this.animation.stop();
      this._activo = false;
    }
  }
  
  get activo():boolean {
    return this._activo;
  }
}
