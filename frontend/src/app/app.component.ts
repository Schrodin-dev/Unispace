import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
	background!: String;
	source!: String;
	couleurTexte!: String;

  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnInit(){
	  this.authService.theme.subscribe(image => {
		  this.background = image;
	  });
	  this.authService.sourceImageTheme.subscribe(source => {
		  this.source = source;
	  });
	  this.authService.couleurTexte.subscribe(color => {
		  this.couleurTexte = color;
	  });
  }
}

