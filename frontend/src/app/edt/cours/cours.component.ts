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
	this.authService.couleurTexte.subscribe(couleur => {
		this.couleurTexte = couleur;
	})
  }

	dateToHoursString(date: Date): String{
		let result = '';
		result += date.getHours();
		result += 'h';
		if(date.getMinutes() > 0){
			result += date.getMinutes();
		}

		return result;

	}

	parseProfs(): String{
	  let res: String = '';

	  for(let i = 0; i < this.cours.profs.length; i++){
		  if(i < this.cours.profs.length - 1){
			  // @ts-ignore
			  res += this.cours.profs[i] + ', ';
		  }else{
			  // @ts-ignore
			  res += this.cours.profs[i];
		  }
	  }

	  return res;
	}

	parseSalles(): String{
	  return this.cours.salles.replace(/,/g, ', ');
	}

}
