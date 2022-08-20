import { Component, OnInit } from '@angular/core';
import {RequestsService} from "../../services/requests.service";
import {Note} from "../../models/note.model";
import {Subject} from "rxjs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-embed-notes',
  templateUrl: './embed-notes.component.html',
  styleUrls: ['./embed-notes.component.scss']
})
export class EmbedNotesComponent implements OnInit {
	couleurFond!: String;
	couleurTexte!: String;

	notes!: Promise<Note[]>;

  constructor(private requestsService: RequestsService, private authService: AuthService) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => this.couleurFond = couleur);
	  this.authService.couleurTexte.subscribe(couleur => this.couleurTexte = couleur);

	  this.notes = this.requestsService.getNoteEmbed();
  }

}
