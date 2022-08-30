import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Note} from "../../models/note.model";
import {
	FormGroup,
	FormBuilder,
	Validators,
	ValidatorFn,
	AsyncValidatorFn,
	FormArray,
	FormControl
} from "@angular/forms";
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
	@Input() inputRessource!: Subject<Ressource>;
	@Input() inputNote!: Subject<Note>;
	@Input() inputDetail!: Subject<Ressource[]>;
	@Output() modification: EventEmitter<boolean> = new EventEmitter<boolean>();
	type!: string; //(modifier ou ajouter)
	mode: String = 'note'; // mode ajout/modification d'une note ou d'un devoir (note ou devoir)
	form!: FormGroup;
	noteForm!: FormGroup;
	devoirForm!: FormGroup;

	ressource!: Ressource | undefined;
	note!: Note | undefined;
	detail!: Ressource[];
	groupes: String[] = [];

	couleurFond!: String;
	couleurTexte!: String;
	isDelegue!: boolean;

	error!: String;
	message!: String;
	show: boolean = true;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private requestsService: RequestsService) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.isDelegue = this.authService.isPublicateur();

	  if(this.isDelegue) this.requestsService.getClasses().toPromise()
		  .then(classes => {
			  for(let classe of classes){
				  for(let g of classe.groupes){
					  if(g.nomGroupe === this.authService.getGroupe()){
						  for(let groupe of classe.groupes){
							  this.groupes.push(groupe.nomGroupe);
						  }
						  return;
					  }
				  }
			  }
		  })
		  .catch(error => {
			  this.message = '';
			  this.error = error.error.message;
		  })


	  this.inputRessource.subscribe(value => {this.form.patchValue({'Ressource': value.nom});});
	  this.inputNote.subscribe(value => {
		  this.form.patchValue({'Devoir': value.id});
		  if(value.note.toString() !== '??'){
			  this.noteForm.patchValue({'Note': value.note});
		  }else{
			  this.noteForm.patchValue({'Note': ''});
		  }
	  });
	  this.inputDetail.subscribe(value => {
		  this.detail = value;
		  this.form.patchValue({'Ressource': null});
		  this.ressource = undefined;
		  this.form.patchValue({'Devoir': null});
		  this.noteForm.patchValue({'Note': ''});
	  });

	  this.setType();

	  this.form = this.formBuilder.group({
		  Ressource: [null, Validators.required],
		  Devoir: [null, Validators.required],
	  });
	  this.noteForm = this.formBuilder.group({
		  Note: [null, [Validators.min(0), Validators.required]],
	  });
	  this.devoirForm = this.formBuilder.group({
		  nomDevoir: [null, [Validators.minLength(1), Validators.required]],
		  coefficient: [1, [Validators.min(0), Validators.required]],
		  bareme: [20, [Validators.min(1), Validators.required]],
		  groupes: this.formBuilder.array([], Validators.required)
	  });

      if(this.ressource !== undefined) this.form.patchValue({'Ressource': this.ressource.nom});
	  if(this.note !== undefined) this.form.patchValue({'Devoir': this.note.id});
	  if(this.type === 'modifier') { // @ts-ignore
          this.noteForm.patchValue({'Note': this.note.note});
      }

	  this.form.valueChanges
		  .subscribe(value => {
			  /*if(value.UE && (this.ue === undefined || value.UE !== this.ue.nom)){
				  for(let UE of this.detail){
					  if(UE.nom === value.UE){
						  this.ue = UE;
						  this.ressource = undefined;
						  this.form.patchValue({'Ressource': undefined}, {emitEvent: false});
						  this.note = undefined
                          this.noteForm.patchValue({'Note': undefined}, {emitEvent: false});
					  }
				  }
			  }*/

			  if(value.Ressource && (this.ressource === undefined || value.Ressource !== this.ressource.nom)){
				  for(let Ressource of this.detail){
					  if(Ressource.nom === value.Ressource){
						  this.ressource = Ressource;
                          this.note = undefined
                          this.noteForm.patchValue({'Note': undefined}, {emitEvent: false});
                      }
				  }
			  }

			  if( value.Devoir && this.ressource && (this.note === undefined || value.Devoir !== this.note.id)){
				  if(value.Devoir === 'x'){
					  this.note = undefined;
					  this.setType();
					  this.mode = 'devoir';
					  this.devoirForm.patchValue({'nomDevoir': undefined});
					  this.devoirForm.patchValue({'bareme': undefined});
					  this.devoirForm.patchValue({'coefficient': undefined});
					  return;
				  }

				  for(let Note of this.ressource.notes){
					  if(Note.id === Number(value.Devoir)){
						  this.note = Note;
						  this.devoirForm.patchValue({'nomDevoir': Note.nomDevoir});
						  this.devoirForm.patchValue({'bareme': Note.bareme});
						  this.devoirForm.patchValue({'coefficient': Note.coeff});
						  const groupesForm: FormArray = this.devoirForm.get('groupes') as FormArray;
						  groupesForm.clear();
						  for(let groupe of Note.groupes){
							  groupesForm.push(new FormControl(groupe));
						  }
						  console.log(this.devoirForm.value);
						  this.setType();
					  }
				  }

				  this.reload();
			  }

		  })


  }

  setType(){
	  if(this.note === undefined || (this.note.note.toString() === '??' && this.mode !== 'devoir')){
		  this.type = 'ajouter';
	  }else{
		  this.type = 'modifier';
	  }
  }

    onSubmit() {
		// vérifications simples
		switch(this.mode){
			case 'note':
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
						this.requestsService.modifierNote(this.note.id, this.noteForm.value.Note)
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
						this.requestsService.ajouterNote(this.note.id, this.noteForm.value.Note)
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
				break;
			case 'devoir':
				switch(this.type){
					case 'modifier':
						if(this.note === undefined || this.ressource === undefined){
							this.message = '';
							this.error = 'Une erreur est survenue, tentez de recharger la page.';
							return;
						}

						this.requestsService.modifierDevoir(this.note.id, this.devoirForm.value.nomDevoir, this.devoirForm.value.coefficient, this.devoirForm.value.bareme, this.ressource.id, this.devoirForm.value.groupes)
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
						if(this.ressource === undefined){
							this.message = '';
							this.error = 'Une erreur est survenue, tentez de recharger la page.';
							return;
						}

						this.requestsService.ajouterDevoir(this.devoirForm.value.nomDevoir, this.devoirForm.value.coefficient, this.devoirForm.value.bareme, this.ressource.id, this.devoirForm.value.groupes)
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
				break;

			default:
				this.message = '';
				this.error = 'Une erreur est survenue, tentez de recharger la page.';
				break;
		}
    }

	/* code from : https://remotestack.io/angular-checkboxes-tutorial-example/ */
	onCbChange(e: Event) {
		const groupes: FormArray = this.devoirForm.get('groupes') as FormArray;

		// @ts-ignore
		if (e.target.checked) {
			// @ts-ignore
			groupes.push(new FormControl(e.target.value));
		} else {
			let i: number = 0;
			// @ts-ignore
			groupes.controls.forEach((item: FormControl) => {
				// @ts-ignore
				if (item.value == e.target.value) {
					groupes.removeAt(i);
					return;
				}
				i++;
			});
		}

	}

	reload() {
		this.show = false;
		setTimeout(() => this.show = true);
	}

	supprimerDevoir($event: boolean) {
		if(!$event || this.note === undefined) return;

		this.requestsService.supprimerDevoir(this.note.id)
			.then(message => {
				this.error = '';
				this.message = message;
				this.modification.emit(true);
				this.devoirForm.patchValue({'nomDevoir': null});
				this.devoirForm.patchValue({'bareme': null});
				this.devoirForm.patchValue({'coefficient': null});
				this.devoirForm.patchValue({'groupes': []});
				this.mode = 'note';
				this.setType();
			})
			.catch(error => {
				this.message = '';
				this.error = error.error.message;
			})
	}
}
