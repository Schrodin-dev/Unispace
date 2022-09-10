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

	date!: Date;
	edt!: Promise<Cours[]>;
	couleurFond!: String;
	couleurPrincipale!: String;
	couleurTexte!: String;
	embedEdtDate!: BehaviorSubject<Date>;

  constructor(private formBuilder: FormBuilder, private requests: RequestsService, private authService: AuthService) { }

  ngOnInit(): void {
	  let date = new Date();
	  date.setHours(0, 0, 0, 0);

	  this.embedEdtDate = new BehaviorSubject<Date>(date);
	  this.embedEdtDate.subscribe(date => {
		  this.date = date;
		  this.chargerEdt(this.date.toISOString());
		  this.updateParent(this.date);
	  });

		this.chargerEdt(this.date.toISOString());


		if(this.updateDateIn !== undefined){
			this.updateDateIn.subscribe(date => {
				if(date === this.date) return;
				this.embedEdtDate.next(date);
				});
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
		  this.error.emit('Impossible de récupérer l\'emploi du temps, veuillez réessayer.');
	  });
  }

	updateParent(name: Date){
		this.updateDateOut.emit(name);
	}
}
