import {Component, Input, OnInit} from '@angular/core';
import { Cours } from 'src/app/models/cours.model';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.scss']
})
export class CoursComponent implements OnInit {
	@Input() cours!: Cours;
	horaire!: String;
	couleurTexte!: String;

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
	this.horaire = this.dateToHoursString(this.cours.debut) + ' - ' + this.dateToHoursString(this.cours.fin);
	this.authService.textColor.subscribe(couleur => {
		this.couleurTexte = couleur;
	})
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
