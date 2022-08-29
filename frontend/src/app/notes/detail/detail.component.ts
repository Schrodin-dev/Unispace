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
	detail!: UE[];
	error!: String;
	etatSemestre:boolean = false;

	couleurTexte!: String;
	couleurFond!: String;
	couleurPrincipale!: String;

	// utilisés pour l'ajout et la modification d'une note en particulier
	ue: Subject<UE> = new Subject<UE>();
	ressource: Subject<Ressource> = new Subject<Ressource>();
	note: Subject<Note> = new Subject<Note>();
	sentDetail: Subject<UE[]> = new Subject<UE[]>()

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
	  for(const UE of this.detail){
		  if(UE.moyenne > 10){
			  nbUEValide++;
		  }else if(UE.moyenne < 8){
			  return false;
		  }
	  }

	  return nbUEValide >= 3;
  }

  onModificationNote(ue: UE, ressource: Ressource, note: Note){
	  this.ue.next(ue);
	  this.ressource.next(ressource);
	  this.note.next(note);
  }

  loadDetail(){
	  this.requestsService.getDetailNotes()
		  .then(res => {
			  this.error = '';
			  this.detail = res;
			  this.sentDetail.next(res);
			  this.etatSemestre = this.semestreValide();
		  })
		  .catch(error => {
			  this.detail = [];
			  this.error = error;
		  });
  }
}
