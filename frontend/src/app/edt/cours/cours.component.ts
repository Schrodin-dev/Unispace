import {Component, Input, OnInit} from '@angular/core';
import { Cours } from 'src/app/models/cours.model';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.scss']
})
export class CoursComponent implements OnInit {
	@Input() cours!: Cours;
	horaire!: String;

  constructor() { }
	/*
	* créer un model cours dans lequel on met tous les arguments des cours au même format que celui passé par
	* la requête.
	* */
  ngOnInit(): void {
	this.horaire = this.dateToHoursString(this.cours.debut) + ' - ' + this.dateToHoursString(this.cours.fin);
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
