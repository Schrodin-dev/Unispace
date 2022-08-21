import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
	couleurTexte!: String;
	couleurFond!: String;
	error!: String;

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
  }

  onLogin(f: NgForm){
    this.authService.login(f.value.email, f.value.password)
		.catch(error => {
			this.error = error.error.message;
		})
  }

}
