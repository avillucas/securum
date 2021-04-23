import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthapiService } from '../services/authapi.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  ionicForm: FormGroup;

  constructor(
    private authService: AuthapiService,
    private router: Router,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    private loadingController: LoadingController
  ) {
  }

  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    })
  }

  get username() {
    return this.ionicForm.get('username');
  }

  get password() {
    return this.ionicForm.get('password');
  }

  async login() {
    //    
    if (!this.ionicForm.valid) {
      this.presentToast('Por favor revise los datos ingresados.');
      return false;
    } else {
      const loading = await this.loadingController.create();
      await loading.present();
      //
      this.authService.login(this.ionicForm.value).subscribe(
        async (res) => {
          await loading.dismiss();
          this.router.navigateByUrl('/activacion', { replaceUrl: true });
        },
        async (res) => {
          await loading.dismiss();
          await this.presentToast('Usuario o contraseña son incorrectos.');
        }
      );
    }
  }

  public tester:string;
  selectedTester(selected:string){
    console.log(selected);
      switch(selected){
        case 'admin':
          this.loadTesterUser(this.testerUsers.admin.username, this.testerUsers.admin.pass);      
        break;
        case 'usuario':
          this.loadTesterUser(this.testerUsers.usuario.username, this.testerUsers.usuario.pass);      
        break;
        case 'invitado':
          this.loadTesterUser(this.testerUsers.invitado.username, this.testerUsers.invitado.pass);      
        break;
        case 'anonimo':
          this.loadTesterUser(this.testerUsers.anonimo.username, this.testerUsers.anonimo.pass);      
        break;
        case 'tester':
          this.loadTesterUser(this.testerUsers.tester.username, this.testerUsers.tester.pass);      
        break;
      }
  } 

  private loadTesterUser(email:string , password:string){
    this.ionicForm.get('username').setValue(email);
    this.ionicForm.get('password').setValue(password);
  }

  private testerUsers = {
    admin : {
      username:'admin@admin.com',
      pass:'1111'
    },
    invitado : {
      username:'invitado@invitado.com',
      pass:'2222'
    },
    usuario : {
      username:'usuario@usuario.com',
      pass:'3333'
    },
    anonimo : {
      username:'anonimo@anonimo.com',
      pass:'4444'
    },
    tester : {
      username:'tester@tester.com',
      pass:'5555'
    },
  };
}
