import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {RequestsService} from "../../services/requests.service";

@Component({
  selector: 'app-verifier-compte',
  templateUrl: './verifier-compte.component.html',
  styleUrls: ['./verifier-compte.component.scss']
})
export class VerifierCompteComponent implements OnInit {
	error!: String;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private requestsService: RequestsService) { }

  ngOnInit(): void {
	  const code = this.activatedRoute.snapshot.params['token'];

	  if(!code){
		this.router.navigate(['']);
	  }

	  this.requestsService.verifierCompte(code)
		  .then(() => {
			  this.router.navigate(['login']);
		  })
		  .catch(error => {
			this.error = error.error.message;
		  })
  }

  redirect(){
	  this.router.navigate(['']);
  }
}
