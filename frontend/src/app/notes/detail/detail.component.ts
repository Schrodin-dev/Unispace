import { Component, OnInit } from '@angular/core';
import {RequestsService} from "../../services/requests.service";
import {UE} from "../../models/UE.model";
import {AuthService} from "../../services/auth.service";
import {Ressource} from "../../models/ressource.model";
import {Note} from "../../models/note.model";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
	resumeUE!: UE[];
	detail!: Ressource[];
	error!: String;
	etatSemestre:boolean = false;

	couleurTexte!: String;
	couleurFond!: String;
	couleurPrincipale!: String;

	// utilisés pour l'ajout et la modification d'une note en particulier
	ue: Subject<UE> = new Subject<UE>();
	ressource: Subject<Ressource> = new Subject<Ressource>();
	note: Subject<Note> = new Subject<Note>();
	sentDetail: Subject<Ressource[]> = new Subject<Ressource[]>()

  constructor(private requestsService: RequestsService, private authService: AuthService) { }

  ngOnInit(): void {
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur;});

	  this.loadDetail();
  }

  getUEColor(note: number): String{
	  if(note >= 10) return 'UEValide';
	  if(note >= 8) return 'UEFragile';
	  return 'UEInvalide'

  }

  semestreValide(): boolean{
	  let nbUEValide = 0;
	  for(const UE of this.resumeUE){
		  if(UE.moyenne > 10){
			  nbUEValide++;
		  }else if(UE.moyenne < 8){
			  return false;
		  }
	  }

	  return (this.resumeUE.length > 3 && nbUEValide >= 3) || (nbUEValide === 3);
  }

  onModificationNote(ressource: Ressource, note: Note){
	  this.ressource.next(ressource);
	  this.note.next(note);
  }

  loadDetail(){
	  this.requestsService.getDetailNotes()
		  .then(res => {
			  this.error = '';
			  this.resumeUE = res.UE;
			  this.detail = res.ressources;
			  this.sentDetail.next(res.ressources);
			  this.etatSemestre = this.semestreValide();
		  })
		  .catch(error => {
			  this.detail = [];
			  this.error = error.error.message;
		  });
  }
}
