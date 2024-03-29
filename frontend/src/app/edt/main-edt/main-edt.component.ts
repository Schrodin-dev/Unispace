import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Cours} from "../../models/cours.model";
import {RequestsService} from "../../services/requests.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-main-edt',
  templateUrl: './main-edt.component.html',
  styleUrls: ['./main-edt.component.scss']
})
export class MainEdtComponent implements OnInit {
	date!: Date;
	displayDates: Date[] = [];
	updateDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
	cours: Cours[][] = [[], [], [], [], [], [], []];
	initialWeek!: Date;

	couleurTexte!: String;
	couleurFond!: String;
	couleurPrincipale!: String;
	error!: String;

  constructor(private requestsService: RequestsService, private authService: AuthService) { }

  ngOnInit(): void {
	  this.selectStartDate();

	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur;});
  }

  selectStartDate(){
	  this.date = new Date();
	  this.date.setHours(0, 0, 0, 0);
	  this.initialWeek = new Date(this.date);
	  this.initialWeek.setFullYear(2021, 7, 25);

	  if(new Date().getMonth() < 7){
		  this.initialWeek.setFullYear(this.date.getFullYear() - 1);
	  } else {
		  this.initialWeek.setFullYear(this.date.getFullYear());
	  }
	  this.initialWeek = this.dateToMonday(this.initialWeek);
	  if(this.date.getDate() < this.initialWeek.getDate()){
		  this.date = this.initialWeek;
	  }
	  this.parseDate();
  }

  dateToMonday(date: Date){
	  date.setHours(0, 0, 0, 0);
	  if(date.getDay() === 0) {
		  return this.getDate(date,-6);
	  }else if(date.getDay() !== 1){
		  return this.getDate(date, 1-date.getDay());
	  }else{
		  return date;
	  }
  }

  parseDate(){
	  this.displayDates[0] = this.dateToMonday(this.date);

	  for(let i = 1; i < 7; i++){
		  this.displayDates[i] = this.getDate(this.displayDates[0], i);
	  }

	  this.updateDate.next(this.date);
	  this.updateCours();
  }

  getDate(date: Date, daysAfter: number): Date{
	  let newDate: Date = new Date(date);
	  newDate.setDate(newDate.getDate() + daysAfter);

	  return newDate;
  }

  setDate(date: Date){
	  if(isNaN(date.valueOf())) return;
	  if(date === this.date) return;

	  this.date = date;
	  this.parseDate();
  }

  updateCours(){
	  this.requestsService.getCours(this.displayDates[0].toString(), this.displayDates[6].toString())
		  .then(planning => {
				  this.cours = [[], [], [], [], [], [], []];

				  planning.forEach(cours => {
					  for (let i = 0; i < 7; i++) {
						  if (cours.debut.getDate() === this.displayDates[i].getDate()) {
							  this.cours[i].push(cours);
						  }
					  }
				  })
			  this.error = '';
			  })
		  .catch(error => {
			  this.error = 'Impossible de récupérer l\'emploi du temps, veuillez réessayer.';
		  });
  }

  getWeek(weeksAfter: number){
	  return this.getDate(this.initialWeek, 7*weeksAfter);
  }

  changeWeek(weeksAfter: number){
	  this.setDate(this.getWeek(weeksAfter+1)); //je sais pas pourquoi il voulait un +1, je préfère ne pas savoir..
  }

  // pour une prochaine version --> scroll vers l'élément d'un id donné
  scrollToWeeksAfter(weeksAfter: number){
	  let el = document.getElementById('week-' + weeksAfter);
	  // @ts-ignore
	  el.scrollIntoView({
		  inline: "start"
	  });
  }

}
