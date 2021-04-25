import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { AlarmaService } from '../services/alarma.service';
import { Animation, AnimationController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthapiService } from '../services/authapi.service';
import { Router } from '@angular/router';
import { AudioService } from '../services/audio.service';
import { MotionService } from '../services/motion.service';
import { DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { FlashService } from '../services/flash.service';
import { VibrationService } from '../services/vibration.service';


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
    public audio:AudioService,    
    public motion:MotionService,
    public flash:FlashService,
    public vibration:VibrationService
  ) {        
    this.hideLogin = true;
    //@todo persistirlo en storage hasheado
    this.passwordCorrect = 'xxxx';
  }  ;

  ngAfterViewInit() {
    this.audio.preload()
  }

  animacionActivar() {       
    this.hideLogin = true;
     this.animation = this.animationCtrl.create()
    .addElement(this.sirena.nativeElement)
    .duration(300)
    .iterations(Infinity)
    .fromTo('opacity', '1', '0.2')                      
    this.animation.play(); 
  }
  
  animacionDesactivar(){
    this.animation.stop()    
  }
  
  cambiarEstadoAlarma(){    
    //esta activa    
    if(this.alarmaService.estaSonando){      
      //se busca desactivarla, solicitar Contraseña
      this.hideLogin = false;              
    }else{      
      this.activarAlarma();
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
        this.desactivarAlarma();        
        return true;
      }else{
        await loading.dismiss();
        await this.presentToast('La contraseña es incorrecta.','danger');
      }     
    }
    return false;
  }

  protected activarAlarma(){
    //se busca activarla
    this.alarmaService.activar();       
    this.motion.leer().subscribe((acceleration: DeviceMotionAccelerationData)=>{
    const sentido = this.motion.determinarMovimiento(acceleration);
    if(sentido != this.motion.QUIETO){           
      this.animacionActivar();
        if(sentido==this.motion.DERECHA ){           
          //Al cambiar la posición, a izquierda o a derecha, emitirá un sonido distinto para cada lado.            
            this.audio.sonarDerecha();                      
        }else if(sentido==this.motion.IZQUIERDA){           
          //Al cambiar la posición, a izquierda o a derecha, emitirá un sonido distinto para cada lado.          
          this.audio.sonarIzquierda();
        }else if(sentido==this.motion.VERTICAL){           
          //Al ponerlo vertical, se encenderá la luz (por 5 segundos) y emitirá un sonido.          
          this.audio.sonarAlarma();
          this.flash.on5Minutes();
        }else if(sentido==this.motion.HORIZONTAL){           
          //Al ponerlo horizontal, vibrará (por 5 segundos) y emitirá un sonido.       
          this.audio.sonarAlarma();
          this.vibration.on5Minutes();
        }        
      }
    });          
  }

  protected desactivarAlarma(){
    this.presentToast('¡La alarma fue desactivada!','success');    
    this.hideLogin = true;
    this.alarmaService.desactivar();
    this.audio.sonarDesactivacion();
    this.animacionDesactivar();
  }
   
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }


}