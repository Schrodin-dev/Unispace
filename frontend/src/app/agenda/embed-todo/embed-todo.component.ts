import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {TravailAFaire} from "../../models/travailAFaire.model";
import {RequestsService} from "../../services/requests.service";

@Component({
  selector: 'app-embed-todo',
  templateUrl: './embed-todo.component.html',
  styleUrls: ['./embed-todo.component.scss']
})
export class EmbedTodoComponent implements OnInit {
	@Output() error = new EventEmitter<String>();
	couleurFond!: String;
	couleurPrincipale!: String;
	couleurTexte!: String;

	travails!: Promise<TravailAFaire[]>;

  constructor(private authService: AuthService, private requestsService: RequestsService) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur});
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur});

	  this.travails = this.requestsService.getTravailAFaireEmbed();
	  this.travails
		  .then(() => {
			  this.error.emit('');
		  })
		  .catch(error => {
		this.error.emit(error.error.message || 'Impossible de récupérer les travails à faire, veuillez réessayer.');
	  });
  }

}
