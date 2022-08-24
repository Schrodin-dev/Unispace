import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {AuthService} from "../../services/auth.service";
import {RequestsService} from "../../services/requests.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-mdp-oublie',
  templateUrl: './mdp-oublie.component.html',
  styleUrls: ['./mdp-oublie.component.scss']
})
export class MdpOublieComponent implements OnInit {
	couleurTexte!: String;
	couleurFond!: String;

	form!: FormGroup;
	code!: String;
	message!: String;
	error!: String;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private requestsService: RequestsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
	  this.code = this.activatedRoute.snapshot.params['token'];

	  if(!this.code){
		  this.router.navigate(['']);
	  }

	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});

	  this.form = this.formBuilder.group({
		password: [null, [Validators.required]]
	});
  }

	changerMdp() {
		this.requestsService.changerPassword(this.code, this.form.value.password)
			.then(message => {
				this.error = '';
				this.message = message;
			})
			.catch(error => {
				this.message = '';
				this.error = error.error.message;
			})
	}
}
