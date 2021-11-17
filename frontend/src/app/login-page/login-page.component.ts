import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  auth:any;

  constructor(private authService: AuthService) { this.auth = authService;}

  ngOnInit(): void {

  }

  onLogin(f: NgForm){
    this.authService.login(f.value.email, f.value.password);
  }

}
