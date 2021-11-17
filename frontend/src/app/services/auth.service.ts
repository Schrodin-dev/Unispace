import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable()
export class AuthService{
  private loginRes:any;

  constructor(private httpClient: HttpClient, private router: Router) {

  }

  register(nom:String, prenom:String, email:String, password:String, classe:String, groupe:any){
    this.httpClient
      .post('http://localhost:3000/users/register', {
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
      .post('http://localhost:3000/users/login', {
        email: email,
        password: password
      })
      .subscribe(
        (res) => {
          this.loginRes = res;
          sessionStorage.setItem("email", this.loginRes.userEmail);
          sessionStorage.setItem("token", this.loginRes.token);
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
  }

  getEmail(){
    return sessionStorage.getItem("email")
  }

  getToken(){
    //console.log(sessionStorage.getItem("token"));
    return sessionStorage.getItem("token");
  }

  isLogin(){
    //console.log(sessionStorage.getItem("token"));
    if(sessionStorage.getItem("token") === null) return false;
    return true;
  }
}
