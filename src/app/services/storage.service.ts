import { Injectable } from '@angular/core';
import { Plugins } from "@capacitor/core";
import { LoginResponse } from '../entities/loginResponse';
import { AuthConstants } from '../config/auth-constants';
const { Storage } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  constructor() {

  }
  async set(key: string, value: any): Promise<void> {
    await Storage.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  async isAdmin(){
    return this.get(AuthConstants.IS_ADMIN);
  }

  get saldo(){
    return this.get(AuthConstants.CREDIT);
  }

  async setLoginData(response:LoginResponse): Promise<void> {
    await Storage.set({
      key: AuthConstants.AUTH,
      value: JSON.stringify(response.token)
    });
    await Storage.set({
      key: AuthConstants.CREDIT,
      value: JSON.stringify(response.credit)
    });
    await Storage.set({
      key: AuthConstants.IS_ADMIN,
      value: JSON.stringify(response.role == AuthConstants.ADMIN_ROLE)
    });
    await Storage.set({
      key: AuthConstants.ADMIN_CODE,
      value: JSON.stringify(response.code)
    });
  }
  
  async get(key: string): Promise<any> {
    const item = await Storage.get({ key: key });
    return JSON.parse(item.value);
  }
  
  async remove(key: string): Promise<void> {
    await Storage.remove({
      key: key
    });
  }

}