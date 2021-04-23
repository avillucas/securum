import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlarmaService {

  private sonando:boolean;

  constructor() { 
    this.sonando = false;
  }

  asset():string
  {
    return 'assets/sirena.png';
  }

  cambiarEstado(){    
    if(!this.sonando){
      this.activar();
    }else{
      this.desactivar();
    }
  }

  get estaSonando():boolean {
    return this.sonando;
  }

  activar(){
    this.sonando = true;
  }

  desactivar(){
    this.sonando = false;
  }
}
