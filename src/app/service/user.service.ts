import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
const { Storage } = Plugins

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token: any = null;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
  ) { }

  public login(datos: any){
    return this.http.post(`http://192.168.20.24:3000/login`, datos);
  }

  public async saveToken(token: string) {
    if (token == undefined) {
      this.token = null
      Storage.clear()
    }else {
      this.token = token
      await Storage.set({
        key: 'token',
        value: this.token
      })
      await this.validateToken() 
    }
    
  }

  private async loadToken() {
    this.token = await Storage.get({key: 'token'}) || null
  }

  public async validateToken(): Promise<boolean> {

    await this.loadToken()
    
    if(this.token.value == null) {
      this.navCtrl.navigateRoot('/home')
      return Promise.resolve(false)
    }
    
    return new Promise((resolve, reject) => {
      const headers =  new HttpHeaders({
        'x-token': this.token.value
      })
      this.http.get(`http://192.168.20.24:3000/user`,{headers}).subscribe( resp => {
        if(resp['respuesta'] == "OK") {
          resolve(true)
        }else {
          this.navCtrl.navigateRoot('/home')
          resolve(false)
        }
      })
    })

  }

  public async account() {
    await this.loadToken()
    const headers =  new HttpHeaders({
      'x-token': this.token.value
    })
    return this.http.get(`http://192.168.20.24:3000/account`,{headers})
  }

  public clime(lat: any, long: any) {
    return this.http.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=3d8064653eb20791d21170963bba2ff6`)
  }

}
