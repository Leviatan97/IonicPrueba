import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserService } from '../service/user.service';
import md5 from '../../../node_modules/md5';
import { Router } from '@angular/router';
import { AvailableResult, BiometryType, Credentials, NativeBiometric } from "capacitor-native-biometric";

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
    private router: Router,
  ) {
    
  }

  public prueba() {
    console.log("entro al metodo");
    NativeBiometric.isAvailable().then(
      (result: AvailableResult) => {
        const isAvailable = result.isAvailable;
        const isFaceId = result.biometryType == BiometryType.FACE_ID;
    
        if (isAvailable) {
          // Get user's credentials
          NativeBiometric.getCredentials({
            server: "www.example.com",
          }).then((credentials: Credentials) => {
            // Authenticate using biometrics before logging the user in
            NativeBiometric.verifyIdentity({
              reason: "For easy log in",
              title: "Log in",
              subtitle: "Maybe add subtitle here?",
              description: "Maybe a description too?",
            }).then(
              () => {
                // Authentication successful
                // this.login(credentials.username, credentials.password);
              },
              (error) => {
                // Failed to authenticate
              }
            );
          });
        }
      },
      (error) => {
        // Couldn't check availability
      }
    );
  }

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
