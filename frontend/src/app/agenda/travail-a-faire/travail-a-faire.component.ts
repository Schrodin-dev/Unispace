import {Component, Input, OnInit} from '@angular/core';
import {TravailAFaire} from "../../models/travailAFaire.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-travail-a-faire',
  templateUrl: './travail-a-faire.component.html',
  styleUrls: ['./travail-a-faire.component.scss']
})
export class TravailAFaireComponent implements OnInit {
	@Input() travail!: TravailAFaire;

	couleurTexte!: String;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
  }

	dateToHoursString(date: Date): String{
		let result = '';
		result += date.getUTCHours();
		result += 'h';
		if(date.getUTCMinutes() > 0){
			result += date.getUTCMinutes();
		}

		return result;

	}
}
