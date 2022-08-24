import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import {NgForm} from "@angular/forms";
import {RequestsService} from "../../services/requests.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
	couleurTexte!: String;
	couleurFond!: String;
	error!: String;
	message!: String;
	isForgotPwd: boolean = false;

  constructor(private authService: AuthService, private requestsService: RequestsService) {

  }

  ngOnInit(): void {
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
  }

  onLogin(f: NgForm){
	  if(!this.isForgotPwd){
		  this.authService.login(f.value.email, f.value.password)
			  .then(res => {
				  this.error = '';
				  this.message = res.message;
			  })
			  .catch(error => {
				  this.message = '';
				  this.error = error.error.message;
			  });
	  }else{
		  this.requestsService.renvoyerCodeVerification(f.value.email)
			  .then(message => {
				  this.error = '';
				  this.message = message;
			  })
			  .catch(error => {
				  this.message = '';
				  this.error = error.error.message;
			  });
	  }
  }
}
