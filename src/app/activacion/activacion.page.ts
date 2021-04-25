import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { AlarmaService } from '../services/alarma.service';
import { Animation, AnimationController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthapiService } from '../services/authapi.service';
import { Router } from '@angular/router';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-activacion',
  templateUrl: './activacion.page.html',
  styleUrls: ['./activacion.page.scss'],
})
export class ActivacionPage implements OnInit {
  
  @ViewChild('sirena', { read: ElementRef }) sirena: ElementRef;
  
  private animation: Animation;
  public hideLogin:boolean ;
  protected passwordCorrect:string ;
  ionicForm: FormGroup;

  constructor(
    public alarmaService:AlarmaService,
    private animationCtrl: AnimationController,            
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private loadingController: LoadingController,
    private authService: AuthapiService,
    public router:Router,    
    public audio:AudioService
  ) {        
    this.hideLogin = true;
    //@todo persistirlo en storage hasheado
    this.passwordCorrect = 'xxxx';
  }  

  

  activar() {       
    this.hideLogin = true;
     this.animation = this.animationCtrl.create()
    .addElement(this.sirena.nativeElement)
    .duration(300)
    .iterations(Infinity)
    .fromTo('opacity', '1', '0.2')                      
    this.animation.play(); 
    this.audio.loop('alarma-activa');   
  }
  
  desactivar(){
    this.animation.stop()
    this.audio.stop('alarma-activa');
    this.audio.play('alarma-desactivar');   
  }
  
  cambiarEstadoAlarma(){    
    //esta activa    
    if(this.alarmaService.estaSonando){      
      //se busca desactivarla, solicitar Contraseña
      this.hideLogin = false;              
    }else{      
      //se busca activarla
      this.alarmaService.activar();            
      this.activar();      
    }
  }  
  
  async presentToast(message:string, color:string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      color:color,
      position: 'top'
    });
    toast.present();
  }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({   
      password: ['', [Validators.required, Validators.minLength(4)]],
    })
  } 

  get password() {
    return this.ionicForm.get('password');
  }

  async login() {
    //    
    if (!this.ionicForm.valid) {
      this.presentToast('Por favor revise los datos ingresados.', 'danger');      
    } else {
      const loading = await this.loadingController.create();
      await loading.present();
      //
      const postData : {  password:string }  = this.ionicForm.value;
      if(this.passwordCorrect == postData.password){
        await loading.dismiss();
        this.presentToast('¡La alarma fue desactivada!','success');
        this.hideLogin = true;
        this.alarmaService.desactivar();
        this.desactivar();
        return true;
      }else{
        await loading.dismiss();
        await this.presentToast('La contraseña es incorrecta.','danger');
      }     
    }
    return false;
  }

   
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }


}