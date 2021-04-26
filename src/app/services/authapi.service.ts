import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { AuthConstants } from '../config/auth-constants';
import {map, tap, switchMap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
const {Storage} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthapiService {

  isAuthenticated : BehaviorSubject<boolean>= new BehaviorSubject<boolean>(null);
  token:string;  
  pass:string;

  constructor(
    private httpService: HttpService    
  ) {
    this.pass = '';
    this.token = '';
    this.loadToken();
    this.loadPass();
  }

  comparePassword(password:string):boolean{
    return (this.pass == password);
  }
  
  async loadPass(){
    const pass = await Storage.get({ key: AuthConstants.PASS });    
    if (pass && pass.value) {  
      this.pass = pass.value;      
    } else {
      this.isAuthenticated.next(false);
    }
  }

  async loadToken(){
    const token = await Storage.get({ key: AuthConstants.AUTH });    
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(postData : { username:string , password:string } ): Observable<any> {  
    return  this.httpService.post(AuthConstants.LOGIN_PATH, postData).pipe(
      map( (data:any) =>  data.token),
      switchMap(
        token=>{ 
          //@todo reemplazar esto con la respuesta del punto 
          Storage.set({key: AuthConstants.PASS, value: 'xxxx'});
          return from(Storage.set({key: AuthConstants.AUTH, value: token}));                     
      }),
      tap( () => {
          this.isAuthenticated.next(true);
      })
    );   
    
    /*.pipe(
      map( (data:any) =>  data.passCode),
      switchMap(
        passCode=>{           
          return from(Storage.set({key: AuthConstants.PASS, value: passCode}));                     
      })
    );  
    */  
  }

  register(postData: {username:string, password:string}): Observable<any> { 
      return  this.httpService.post(AuthConstants.REGISTER_PATH, {username:postData.username,password:postData.password});    
  }

  logout() {
    this.isAuthenticated.next(false);
    return Storage.remove({key: AuthConstants.AUTH});    
  }

}