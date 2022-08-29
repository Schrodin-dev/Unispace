import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Note} from "../../models/note.model";
import {FormGroup, FormBuilder, Validators, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {UE} from "../../models/UE.model";
import {AuthService} from "../../services/auth.service";
import {Ressource} from "../../models/ressource.model";
import {RequestsService} from "../../services/requests.service";
import {BehaviorSubject, Subject} from "rxjs";

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
	mode: String = 'note'; // mode ajout/modification d'une note ou d'un devoir (note ou devoir)
	form!: FormGroup;
	isValidForm:boolean = false;

	ue!: UE | undefined;
	ressource!: Ressource | undefined;
	note!: Note | undefined;
	detail!: UE[];

	couleurFond!: String;
	couleurTexte!: String;
	isDelegue!: boolean;

	error!: String;
	message!: String;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private requestsService: RequestsService) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.isDelegue = this.authService.isDelegue();


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

		  // arguments pour l'ajout/modification d'une note
		  Note: [null, [Validators.min(0), this.requireModeValidator('note').bind(this)]],

		  // arguments pour l'ajout/modification d'un devoir
		  nomDevoir: [null, [Validators.minLength(1), this.requireModeValidator('devoir').bind(this)]]/*,
		  coefficient: [null, [Validators.min(0), this.requireModeValidator('devoir').bind(this)]],
		  bareme: [null, [Validators.min(0), this.requireModeValidator('devoir').bind(this)]],
		  groupes: [null, this.requireModeValidator('devoir').bind(this)]*/
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

			  if( value.Devoir && this.ressource && (this.note === undefined || value.Devoir !== this.note.id)){
				  if(value.Devoir === 'x'){
					  this.note = undefined;
					  this.setType();
					  this.mode = 'devoir';
					  return;
				  }

				  for(let Note of this.ressource.notes){
					  if(Note.id === Number(value.Devoir)){
						  this.note = Note;
						  this.setType();
					  }
				  }
			  }

			  this.isValidForm = this.form.invalid;
		  })


  }

  changeMode(){
	  this.form.controls.Note.updateValueAndValidity();
	  this.form.controls.nomDevoir.updateValueAndValidity();
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

	requireModeValidator = (modeRequis: String): ValidatorFn => (control) => {
		const { value } = control;
		const erreur = this.mode === modeRequis && value === null;

		console.log(this.mode);
		if(erreur){
			return {erreur : ''}
		}else{
			return null;
		}
	}
}
