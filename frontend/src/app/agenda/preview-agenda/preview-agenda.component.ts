import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TravailAFaire} from "../../models/travailAFaire.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-preview-agenda',
  templateUrl: './preview-agenda.component.html',
  styleUrls: ['./preview-agenda.component.scss']
})
export class PreviewAgendaComponent implements OnInit {
	@Input() travail!: TravailAFaire;
	@Input() type!: string;
	@Output() modifier: EventEmitter<TravailAFaire> = new EventEmitter<TravailAFaire>();

	couleurFond!: String;
	couleurTexte!: String;
	couleurPrincipale!: String;
	isDelegue!: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur;});
	  this.isDelegue = this.authService.isPublicateur();

  }

	edit() {
		this.modifier.emit(this.travail);
	}
}
