import {Component, Input, OnInit} from '@angular/core';
import {Note} from "../../models/note.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
	@Input() note!: Note;

	couleurPrincipale!: String;
	couleurTexte!: String;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur});


  }

}
