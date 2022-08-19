import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Cours} from "../../models/cours.model";
import {RequestsService} from "../../services/requests.service";

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
	test!: Cours[];

  constructor(private requestsService: RequestsService) { }

  ngOnInit(): void {
	  this.selectStartDate();
  }

  selectStartDate(){
	  this.date = new Date();
	  this.parseDate();
  }

  parseDate(){
	  if(this.date.getDay() === 0) {
		  this.displayDates[0] = this.getDate(this.date,-6);
	  }else if(this.date.getDay() !== 1){
		  this.displayDates[0] = this.getDate(this.date, 1-this.date.getDay());
	  }else{
		  this.displayDates[0] = this.date;
	  }

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
			  })

  }

}
