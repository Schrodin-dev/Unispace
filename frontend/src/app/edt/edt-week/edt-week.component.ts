import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-edt-week',
  templateUrl: './edt-week.component.html',
  styleUrls: ['./edt-week.component.scss']
})
export class EdtWeekComponent implements OnInit {
	@Input() date!: Date;
	@Input() actualDate!: BehaviorSubject<Date>;
	@Input() weekNumber!: number;

	couleurPrincipale!: String;
	couleurTexte!: String;

	isActive!: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
	  this.chargerCouleurs();

	  this.actualDate.subscribe(date => {
		  this.verifyIfDateInWeek(date);
	  })
  }

  chargerCouleurs(){
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
  }

  private verifyIfDateInWeek(date: Date){
	  this.isActive = date.getTime() >= this.date.getTime() && date.getTime() < this.date.getTime() + 7*24*60*60*1000;
  }
}
