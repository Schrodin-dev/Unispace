import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Subject} from "rxjs";
import backend from "../../assets/config/backend.json";

@Injectable()
export class RequestsService{
  userInfosContent:any;

  constructor(private httpClient: HttpClient, private authService: AuthService) {

  }



}
