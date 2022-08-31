import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	couleurFond!: String;
	couleurTexte!: String;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
  }

}
