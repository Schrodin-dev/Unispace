import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {RequestsService} from "../../services/requests.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-verifier-compte',
  templateUrl: './verifier-compte.component.html',
  styleUrls: ['./verifier-compte.component.scss']
})
export class VerifierCompteComponent implements OnInit {
	error!: String;
	message!: boolean;

	couleurTexte!: String;
	couleurFond!: String;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private requestsService: RequestsService, private authService: AuthService) { }

  ngOnInit(): void {
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});

	  const code = this.activatedRoute.snapshot.params['token'];

	  if(!code){
		this.router.navigate(['']);
	  }

	  this.requestsService.verifierCompte(code)
		  .then(() => {
			  this.error = '';
			  this.message = true;
		  })
		  .catch(error => {
			  this.message = false;
			this.error = error.error.message;
		  })
  }

  redirect(){
	  this.router.navigate(['']);
  }
}
