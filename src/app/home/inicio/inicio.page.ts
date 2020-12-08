import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  ListAccount: Array<any> = []
  private lat: any = null;
  private lng: any = null;
  private city: any = null;
  private clime: any = null;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.listAccount()
    this.getCurrentPosition()
  }

  private promiseAccount() {
    return new Promise(async (resolve,reject)=>{
      (await this.userService.account()).subscribe((result:any)=>{
        resolve({
          result,
          resultado:'ok'
        })
      },(error:object)=>{
        reject({
          error,resultado:'error'
        })
      });
      
    })
  }

  private promiseGeo(lat: any, long: any) {
    return new Promise(async (resolve,reject)=>{
      (await this.userService.clime(lat, long)).subscribe((result:any)=>{
        resolve({
          result,
          resultado:'ok'
        })
      },(error:object)=>{
        reject({
          error,resultado:'error'
        })
      });
      
    })
  }

  public async listAccount() {
    let result: any
    try {
      result = await this.promiseAccount()
      result = result.result

      this.ListAccount = result.resultado
      console.log(this.ListAccount)
    } catch (error) {
      console.log(error)
    }
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.lat = coordinates.coords.latitude
    this.lng = coordinates.coords.longitude
    this.getClime()
  }

  public async getClime() {
    let result: any
    try {
      result = await this.promiseGeo(this.lat, this.lng)
      result = result.result
      this.city = result.name 
      this.clime = result.main.temp - 273.15 
    } catch (error) {
      console.log(error)
    }
  }
}
