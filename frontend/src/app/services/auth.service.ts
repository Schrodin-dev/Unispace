import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import backend from "../../assets/config/backend.json";

@Injectable()
export class AuthService{
  private loginRes:any;

  constructor(private httpClient: HttpClient, private router: Router) {

  }

  register(nom:String, prenom:String, email:String, password:String, classe:String, groupe:any){
    this.httpClient
      .post(backend.url + '/api/auth/register', {
        nom: nom,
        prenom: prenom,
        email: email,
        password: password,
        classe: classe,
        groupe: groupe
      })
      .subscribe(
        (response) => {
          console.log(response);
          this.login(email, password);
        },
        (error) => {
          console.log("error: " + error);
        }
      );
  }

  login(email:String, password:String){
    console.log(email, password);
    this.httpClient
      .post(backend.url + '/api/auth/login', {
        email: email,
        password: password
      })
      .subscribe(
        (res) => {
          this.loginRes = res;
          // @ts-ignore
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("token", this.loginRes.token);
          sessionStorage.setItem("groupe", this.loginRes.groupe);
          sessionStorage.setItem("droits", this.loginRes.droitsUser);
          sessionStorage.setItem("nom", this.loginRes.nom);
          sessionStorage.setItem("prenom", this.loginRes.prenom);
          this.router.navigate(['']);
          console.log(res);
        },
        (error) => {
          console.log("error: " + error);
        }
      );
  }

  disconnect(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  getEmail(){
    return sessionStorage.getItem("email");
  }

  getToken(){
    return sessionStorage.getItem("token");
  }

  isLogin(){
    return (sessionStorage.getItem("token") !== null);
  }

  getNom(){
    return sessionStorage.getItem("nom");
  }

  getPrenom(){
    return sessionStorage.getItem("prenom");
  }

  getGroupe(){
    return sessionStorage.getItem("groupe");
  }

  getDroits(){
    return sessionStorage.getItem("droits");
  }

  getUserInfos(){
    return {
      nom: this.getNom(),
      prenom: this.getPrenom(),
      email: this.getEmail(),
      groupe: this.getGroupe()
    };
  }
}
