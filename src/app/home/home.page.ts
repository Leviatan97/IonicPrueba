import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserService } from '../service/user.service';
import md5 from '../../../node_modules/md5';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private documento: number;
  private contrasena: string;

  constructor(
    private userService: UserService, 
    public toastController: ToastController,
    private router: Router
  ) {}

  private validarCampos() {
    if(this.documento == undefined) {
      return false
    }else if(this.contrasena == undefined) {
      return false
    }else if(this.documento == null) {
      return false
    }else if(this.contrasena == null) {
      return false
    }else if(this.contrasena == "") {
      return false
    }else {
      return true
    }
  }

  private PromesaLogin(datos : any){
    return new Promise((resolve,reject)=>{
      this.userService.login(datos).subscribe((result:any)=>{
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

  public async login() {
    let validar: boolean = this.validarCampos()
    let result: any
    
    if(validar) {
      
      result = await this.PromesaLogin({
        doc: this.documento,
        con: md5(this.contrasena)
      });
      result = result.result
      if(result.val == 1) {
        this.userService.saveToken(result.token_)
        this.router.navigate(['home/inicio'])
      }else{
        this.userService.saveToken(null)
        this.usuarioContra()
      }
      
    }else {
      this.presentToast()
    }
  }

  async usuarioContra() {
    const toast = await this.toastController.create({
      message: 'El usuario o la contraseña son incorrectos.',
      duration: 2000
    });
    toast.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Asegurese de llenar los campos requeridos.',
      duration: 2000
    });
    toast.present();
  }

}
