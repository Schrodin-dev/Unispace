import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Subject} from "rxjs";
import backend from "../../assets/config/backend.json";

@Injectable()
export class RequestsService{
  userInfosContent:any;
  userInfosContentSubject = new Subject<any>();

  constructor(private httpClient: HttpClient, private authService: AuthService) {

  }

  userInfos(){
    let email = this.authService.getEmail();
    let password = this.authService.getToken();

    /*this.httpClient
      .post(backend.url + '/users/userInfos', {
        email: email,
        password: password
      })
      .subscribe(
        (res) => {
          this.userInfosContentSubject.next(res);
        },
        (error) => {
          console.log("error: " + error);
        }
      );*/
  }

}
