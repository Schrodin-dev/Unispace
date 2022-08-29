import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Note} from "../../models/note.model";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UE} from "../../models/UE.model";
import {AuthService} from "../../services/auth.service";
import {Ressource} from "../../models/ressource.model";
import {RequestsService} from "../../services/requests.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-ajouter-modifier-note',
  templateUrl: './ajouter-modifier-note.component.html',
  styleUrls: ['./ajouter-modifier-note.component.scss']
})
export class AjouterModifierNoteComponent implements OnInit {
	@Input() inputUe!: Subject<UE>;
	@Input() inputRessource!: Subject<Ressource>;
	@Input() inputNote!: Subject<Note>;
	@Input() inputDetail!: Subject<UE[]>;
	@Output() modification: EventEmitter<boolean> = new EventEmitter<boolean>();
	type!: string; //(modifier ou ajouter)
	form!: FormGroup;

	ue!: UE | undefined;
	ressource!: Ressource | undefined;
	note!: Note | undefined;
	detail!: UE[];

	couleurFond!: String;
	couleurTexte!: String;

	error!: String;
	message!: String;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private requestsService: RequestsService) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});

	  this.inputUe.subscribe(value => {this.form.patchValue({'UE': value.nom});});
	  this.inputRessource.subscribe(value => {this.form.patchValue({'Ressource': value.nom});});
	  this.inputNote.subscribe(value => {
		  this.form.patchValue({'Devoir': value.id});
		  if(value.note.toString() !== '??'){
			  this.form.patchValue({'Note': value.note});
		  }else{
			  this.form.patchValue({'Note': ''});
		  }
	  });
	  this.inputDetail.subscribe(value => {this.detail = value;});

	  this.setType();

	  this.form = this.formBuilder.group({
		  UE: [null, Validators.required],
		  Ressource: [null, Validators.required],
		  Devoir: [null, Validators.required],
		  Note: [null, Validators.required]
	  });

      if(this.ue !== undefined) this.form.patchValue({'UE': this.ue.nom});
      if(this.ressource !== undefined) this.form.patchValue({'Ressource': this.ressource.nom});
	  if(this.note !== undefined) this.form.patchValue({'Devoir': this.note.id});
	  if(this.type === 'modifier') { // @ts-ignore
          this.form.patchValue({'Note': this.note.note});
      }

	  this.form.valueChanges
		  .subscribe(value => {
			  if(value.UE && (this.ue === undefined || value.UE !== this.ue.nom)){
				  for(let UE of this.detail){
					  if(UE.nom === value.UE){
						  this.ue = UE;
						  this.ressource = undefined;
						  this.form.patchValue({'Ressource': undefined}, {emitEvent: false});
						  this.note = undefined
                          this.form.patchValue({'Note': undefined}, {emitEvent: false});
					  }
				  }
			  }

			  if(value.Ressource && this.ue && (this.ressource === undefined || value.Ressource !== this.ressource.nom)){
				  for(let Ressource of this.ue.ressources){
					  if(Ressource.nom === value.Ressource){
						  this.ressource = Ressource;
                          this.note = undefined
                          this.form.patchValue({'Note': undefined}, {emitEvent: false});
                      }
				  }
			  }

			  if(value.Devoir && this.ressource){
				  for(let Note of this.ressource.notes){
					  if(Note.id === Number(value.Devoir)){
						  this.note = Note;
						  this.setType();
					  }
				  }
			  }
		  })


  }

  setType(){
	  if(this.note === undefined || this.note.note.toString() === '??'){
		  this.type = 'ajouter';
	  }else{
		  this.type = 'modifier';
	  }
  }

    onSubmit() {
		// vérifications simples
		if(this.note === undefined ){
			this.message = '';
			this.error = 'Une erreur est survenue, tentez de recharger la page.';
			return;
		}

		if(this.form.value.Note > this.note?.bareme){
			this.message = '';
			this.error = 'Le devoir est noté sur ' + this.note.bareme;
			return;
		}

		switch(this.type){
			case 'modifier':
				this.requestsService.modifierNote(this.note.id, this.form.value.Note)
					.then(message => {
						this.error = '';
						this.message = message;
						this.modification.emit(true);
					})
					.catch(error => {
						this.message = '';
						this.error = error.error.message;
					});
				break;
			case 'ajouter':
				this.requestsService.ajouterNote(this.note.id, this.form.value.Note)
					.then(message => {
						this.error = '';
						this.message = message;
						this.modification.emit(true);
					})
					.catch(error => {
						this.message = '';
						this.error = error.error.message;
					});
				break;

			default:
				this.message = '';
				this.error = 'Une erreur est survenue, tentez de recharger la page.';
				break;
		}
    }
}
