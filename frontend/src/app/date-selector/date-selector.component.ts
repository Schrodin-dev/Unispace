import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Cours} from "../models/cours.model";
import {RequestsService} from "../services/requests.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent implements OnInit {
	@Input() dateSubject!: BehaviorSubject<Date>;
	date!: Date;

	couleurPrincipale!: String;
	couleurTexte!: String;
	dateSelectionnee!: FormGroup;

	constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

	ngOnInit(): void {
		this.authService.couleurPrincipale.subscribe(couleur => {
			this.couleurPrincipale = couleur;
		});
		this.authService.couleurTexte.subscribe(couleur => {
			this.couleurTexte = couleur;
		});

		this.dateSubject.subscribe(date => {
			if(date === this.date) return;
			this.date = date;
			if(this.dateSelectionnee !== undefined){
				this.dateSelectionnee.patchValue({'date': this.formatDate(this.date)});
			}
		});

		this.dateSelectionnee = this.formBuilder.group({
			date: [this.formatDate(this.date)]
		});

		this.dateSelectionnee.valueChanges.forEach(newValue => {
			// @ts-ignore
			if(new Date(newValue.date) !== "Invalid Date" && !isNaN(new Date(newValue.date).getDate())){
				this.date = new Date(newValue.date);
				this.dateSubject.next(this.date);
			}
		});
	}

	previousDay(){
		this.date.setDate(this.date.getDate()-1);
		this.dateSelectionnee.patchValue({'date': this.date.toISOString().substr(0, 10)});
	}

	nextDay(){
		this.date.setDate(this.date.getDate()+1);
		this.dateSelectionnee.patchValue({'date': this.date.toISOString().substr(0, 10)});
	}

	/* code from: https://w3guides.com/tutorial/how-to-populate-date-input-in-angular-reactive-forms */
	private formatDate(date: Date) {
		const d = new Date(date);
		let month = '' + (d.getMonth() + 1);
		let day = '' + d.getDate();
		const year = d.getFullYear();
		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
		return [year, month, day].join('-');
	}
}
