import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {BehaviorSubject, Subject} from "rxjs";
import {RequestsService} from "../../services/requests.service";
import {TravailAFaire} from "../../models/travailAFaire.model";

@Component({
  selector: 'app-detail-content-todo',
  templateUrl: './detail-content-todo.component.html',
  styleUrls: ['./detail-content-todo.component.scss']
})
export class DetailContentTodoComponent implements OnInit {
	@Input() type: string = 'travail à faire';

	couleurFond!: String;
	couleurPrincipale!: String;
	couleurTexte!: String;
	isDelegue!: boolean;
	afficherChoixMatiere: boolean = false;

	dateSelector!: BehaviorSubject<Date>;
	date!: Date;
	pagination: number = 0;
	listeCours!: {nom: String, couleur: String}[];
	listeTravails: TravailAFaire[] = [];
	matiere: String = '';
	receiver!: Subject<TravailAFaire>;
	previewMode!: string;
	previewTravail!: TravailAFaire;

	error!: String;
	canLoadMore: boolean = true;

  constructor(private authService: AuthService, private requestsService: RequestsService) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur});
	  this.isDelegue = this.authService.isPublicateur();

	  this.dateSelector = new BehaviorSubject<Date>(new Date());
	  this.dateSelector.subscribe(date => {
		  this.date = date;
		  this.listeTravails = [];
		  this.pagination = 0;
		  this.chargerTravailAfaire();
	  });

	  this.requestsService.chargerListeCours()
		  .then(liste =>{
			  this.listeCours = liste;
		  })
		  .catch(error => {
			  this.error = error.error.message;
		  });

	  this.receiver = new Subject<TravailAFaire>();
	  this.receiver.subscribe(travail => {
		  this.previewMode = 'preview';
		  this.previewTravail = travail;
	  });
  }

  chargerTravailAfaire(){
	  if(this.type === 'travail à faire'){
		  this.requestsService.chargerPageTravailAFaire(this.date, this.pagination, this.matiere || '')
			  .then(travails => {
				  if(travails.length === 0) this.canLoadMore = false;

				  for(const travail of travails){
					  this.listeTravails.push(travail);
				  }
			  })
			  .catch(error => {
				  this.error = error.error.message;
			  });
	  }else{ // contenu cours
		  this.requestsService.chargerPageContenuCours(this.date, this.pagination, this.matiere || '')
			  .then(travails => {
				  if(travails.length === 0) this.canLoadMore = false;

				  for(const travail of travails){
					  this.listeTravails.push(travail);
				  }
			  })
			  .catch(error => {
				  this.error = error.error.message;
			  });
	  }
  }

  changerMatiere(matiere: String){
	  if(matiere !== this.matiere){
		  this.matiere = matiere;
		  this.pagination = 0;
		  this.listeTravails = [];
	  }

	  this.chargerTravailAfaire();
  }

  compareDates(d1: Date, d2: Date):boolean{
	  return d1.getDate() !== d2.getDate() || d1.getMonth() !== d2.getMonth() || d1.getFullYear() !== d2.getFullYear()
  }

	chargerPlus() {
  		this.pagination++;
		this.changerMatiere(this.matiere);
	}

	Ajouter() {
		this.previewMode = 'ajouter';
	}

	modifier($event: TravailAFaire) {
		this.previewTravail = $event;
		this.previewMode = 'modifier';
	}

	closeEdit() {
		this.previewMode = '';
		this.listeTravails = [];
		this.pagination = 0;
		this.chargerTravailAfaire();
	}
}
