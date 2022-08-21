import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {RequestsService} from "../../services/requests.service";
import {AuthService} from "../../services/auth.service";
import {BehaviorSubject} from "rxjs";
import {Cours} from "../../models/cours.model";

@Component({
  selector: 'app-embed-edt',
  templateUrl: './embed-edt.component.html',
  styleUrls: ['./embed-edt.component.scss']
})
export class EmbedEdtComponent implements OnInit {
	@Output() updateDateOut: EventEmitter<Date> = new EventEmitter<Date>();
	@Output() error = new EventEmitter<String>();
	@Input() updateDateIn!: BehaviorSubject<Date>;


	dateSelectionnee!: FormGroup;
	date!: Date;
	edt!: Promise<Cours[]>;
	couleurFond!: String;
	couleurPrincipale!: String;
	couleurTexte!: String;

  constructor(private formBuilder: FormBuilder, private requests: RequestsService, private authService: AuthService) { }

  ngOnInit(): void {
	  this.date = new Date();
		this.dateSelectionnee = this.formBuilder.group({
			date: [this.date.toISOString().substr(0, 10)]
		});
		this.chargerEdt(this.date.toISOString());

		this.dateSelectionnee.valueChanges.forEach(newValue => {
			console.log("change");
			this.date = new Date(newValue.date);
			this.updateParent(this.date);
			this.chargerEdt(newValue.date);
		});

		if(this.updateDateIn !== undefined){
			this.updateDateIn.subscribe(date => {
				if(date === this.date) return;
				this.date = date;
				this.dateSelectionnee.patchValue({'date': this.date.toISOString().substr(0, 10)});});
		}

		this.authService.couleurFond.subscribe(couleur => {
			this.couleurFond = couleur;
		});
	  this.authService.couleurPrincipale.subscribe(couleur => {
		  this.couleurPrincipale = couleur;
	  });
	  this.authService.couleurTexte.subscribe(couleur => {
		  this.couleurTexte = couleur;
	  });
  }

  chargerEdt(date: String){
	  this.edt = this.requests.getCours(date, date);
	  this.edt
		  .then(() => {
			  this.error.emit('');
		  })
		  .catch(error => {
		  console.log("yo");
		  this.error.emit(error.error.message || 'Impossible de récupérer l\'emploi du temps, veuillez réessayer.');
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

	updateParent(name: Date){
		this.updateDateOut.emit(name);
	}
}
