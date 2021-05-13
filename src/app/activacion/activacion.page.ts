import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { AlarmaService } from '../services/alarma.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthapiService } from '../services/authapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activacion',
  templateUrl: './activacion.page.html',
  styleUrls: ['./activacion.page.scss'],
})
export class ActivacionPage implements OnInit {  

 
  ionicForm: FormGroup;  
  @ViewChild('sirena', { read: ElementRef }) sirena: ElementRef;
  
  //
  constructor(
    public alarmaService:AlarmaService,  
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private loadingController: LoadingController,
    private authService: AuthapiService,
    public router:Router        
  ) {      
  }  

  ngAfterViewInit() {    
    this.alarmaService.element = this.sirena;    
    this.alarmaService.preload();
  }
   
  /**
   * Cambiar el estado de la alarma una vez que se lo clickea 
   */
  cambiarEstadoAlarma(){         
    this.alarmaService.cambiarEstado();    
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
      if(this.authService.comparePassword(postData.password)){
        await loading.dismiss();
        if(this.alarmaService.desactivar()){        
          this.presentToast('¡La alarma fue desactivada!','success');            
        }
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

  ngOnDestroy() {
    this.alarmaService.desactivar();
  }
}