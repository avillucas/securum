import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { AuthConstants } from '../config/auth-constants';
import {map, tap, switchMap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { LoginResponse } from '../entities/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthapiService {

  isAuthenticated : BehaviorSubject<boolean>= new BehaviorSubject<boolean>(null);
  token = '';  

  constructor(
    private httpService: HttpService    ,
    private storageService:StorageService
  ) {
    this.loadToken();
  }

  async loadToken(){     
    const token = await this.storageService.get(AuthConstants.AUTH);    
    if (token ) {      
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  async comparePassword(password:string){
    const pass = await this.storageService.get(AuthConstants.ADMIN_CODE);
    return pass == password;
  }

  login(postData : { username:string , password:string } ): Observable<any> {  
    return  this.httpService.post(AuthConstants.LOGIN_PATH, postData).pipe(
      map( (data:LoginResponse) =>  data),
      switchMap(
        (data:LoginResponse)=>{ 
          return from(
            this.storageService.setLoginData(data)
          );                     
        }
      ),
      tap( () => {
          this.isAuthenticated.next(true);
      })
    );    
  }

  register(postData: {username:string, password:string}): Observable<any> { 
      return  this.httpService.post(AuthConstants.REGISTER_PATH, {username:postData.username,password:postData.password});    
  }

  logout() {
    this.isAuthenticated.next(false);
    return this.storageService.remove(AuthConstants.AUTH);
  }

}