import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TravailAFaire} from "../../models/travailAFaire.model";
import {AuthService} from "../../services/auth.service";
import {RequestsService} from "../../services/requests.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Doc} from "../../models/doc.model";
import {BehaviorSubject, Subject} from "rxjs";
import {formatDate} from "@angular/common";
import {v4 as uuid} from "uuid";

@Component({
  selector: 'app-edit-agenda',
  templateUrl: './edit-agenda.component.html',
  styleUrls: ['./edit-agenda.component.scss']
})
export class EditAgendaComponent implements OnInit {
	@Input() travail!: TravailAFaire;
	@Input() mode!: String;
	@Input() type!: String;
	@Input() matieres!: {nom: String, couleur: String}[];
	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	couleurFond!: String;
	couleurTexte!: String;
	couleurPrincipale!: String;
	couleurMatiere!: String;

	form!: FormGroup;
	addedDocs: {doc: Doc, subject: Subject<Doc>}[] = [];
	editedDocs: {doc: Doc, subject: Subject<Doc>}[] = [];
	deletedDocs: Doc[] = [];

	error!: String;
	groupes: String[] = [];

  constructor(private authService: AuthService, private requestsService: RequestsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {
		  this.couleurTexte = couleur;
		  if(!this.couleurMatiere) this.couleurMatiere = couleur;
	  });
	  this.authService.couleurPrincipale.subscribe(couleur => {this.couleurPrincipale = couleur;});

	  this.loadForm();
	  }

  private loadForm(){
	  this.form = this.formBuilder.group({
		  date: [null, [Validators.required]],
		  matiere: [null, [Validators.required]],
		  desc: [null, [Validators.required]],
		  estNote: [false],
		  groupes: this.formBuilder.array([], Validators.required)
	  });

	  if(this.travail && this.mode === 'modifier'){
		  // @ts-ignore
		  if(new Date(this.travail.date) !== "Invalid Date" && !isNaN(new Date(this.travail.date).getDate())){
			  // source du code : https://stackoverflow.com/questions/55660262/how-can-i-set-my-reactive-form-date-input-value
			  this.form.patchValue({'date': formatDate(this.travail.date,'yyyy-MM-ddTHH:mm','en')});
		  }
		  this.form.patchValue({'matiere': this.travail.nomCours});
		  this.form.patchValue({'desc': this.travail.desc});
		  if(this.type === 'travail à faire') this.form.patchValue({'estNote': this.travail.estNote});
		  this.loadDocs(this.travail.documents);

		  const groupes = this.form.get('groupes')as FormArray;
		  for(let g of this.travail.groupes){
			  groupes.push(new FormControl(g));
		  }
	  }

	  this.requestsService.getClasses().toPromise()
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
			  this.error = error.error.message;
		  });
  }

  private loadDocs(docs: Doc[]){
	  for(let doc of docs){
		  this.docSubscribe(doc, new BehaviorSubject<Doc>(doc), false);
	  }
  }

  nouveauDocument(){
	  let doc = new Doc(uuid(), '', '');
	  this.docSubscribe(doc, new BehaviorSubject<Doc>(doc), true);
  }

  docSubscribe(doc: Doc, subject: Subject<Doc>, estUnNouveauDocument: boolean){
	  if(estUnNouveauDocument){
		  this.addedDocs.push({doc: doc, subject: subject});

		  subject.subscribe(doc => {
			  for(let i = 0; i < this.addedDocs.length; i++){
				  const document = this.addedDocs[i];
				  if(document.doc.id === doc.id){
					  this.addedDocs[i].doc = doc;
				  }
			  }
		  });
	  }else{
		  this.editedDocs.push({doc: doc, subject: subject});

		  subject.subscribe(doc => {
			  for(let i = 0; i < this.editedDocs.length; i++){
				  const document = this.editedDocs[i];
				  if(document.doc.id === doc.id){
					  this.editedDocs[i].doc = doc;
				  }
			  }
		  });
	  }
  }

  supprimerDocument(doc: Doc){
	  for(let i = 0; i < this.editedDocs.length; i++){
		  const document = this.editedDocs[i];
		  if(document.doc.id === doc.id){
			  this.deletedDocs.push(this.editedDocs.splice(i, 1)[0].doc);
		  }
	  }

	  for(let i = 0; i < this.addedDocs.length; i++){
		  const document = this.addedDocs[i];
		  if(document.doc.id === doc.id){
			  this.addedDocs.splice(i, 1)[0].doc;
		  }
	  }
  }

	onSubmit() {
	  	switch(this.type){
			case 'travail à faire':
				switch(this.mode){
					case 'ajouter':
						let docs: Doc[] = [];
						for(let doc of this.addedDocs){
							docs.push(doc.doc);
						}

						this.requestsService.ajouterTravailAFaire(this.form.value.date, this.form.value.desc, this.form.value.estNote, this.form.value.groupes, this.form.value.matiere, docs)
							.then(() => {
								this.close.emit(true);
							})
							.catch(error => {
								if(error !== undefined && error.message != undefined){
									this.error = error;
								}else{
									this.error = error;
								}
							});

						break;
					case 'modifier':
						this.requestsService.modifierTravailAFaire(Number(this.travail.id), this.form.value.date, this.form.value.desc, this.form.value.estNote, this.form.value.groupes, this.form.value.matiere)
							.then(async () => {
								//ajout des nouveaux documents
								for (let doc of this.addedDocs) {
									await this.requestsService.ajouterDocumentTravailAFaire(Number(this.travail.id), doc.doc.nom, doc.doc.lien)
										.catch(error => {
											if (error !== undefined && error.message != undefined) {
												this.error = error;
											} else {
												this.error = error;
											}
										});
								}

								//modification des documents
								for (let doc of this.editedDocs) {
									await this.requestsService.modifierDocumentTravailAFaire(Number(doc.doc.id), doc.doc.nom, doc.doc.lien)
										.catch(error => {
											if (error !== undefined && error.message != undefined) {
												this.error = error;
											} else {
												this.error = error;
											}
										});
								}

								//suppression des documents
								for (let doc of this.deletedDocs) {
									console.log(doc.id)
									await this.requestsService.supprimerDocumentTravailAFaire(Number(doc.id))
										.catch(error => {
											if (error !== undefined && error.message != undefined) {
												this.error = error;
											} else {
												this.error = error;
											}
										});
								}
							})
							.then(() => {
								this.close.emit(true);
							})
							.catch(error => {
								if(error !== undefined && error.message != undefined){
									this.error = error;
								}else{
									this.error = error;
								}
							});

						break;
					default:
						this.error = "Une erreur est survenue, tentez de recharger la page.";
						break;
				}
				break;

			case 'contenu de cours':
				switch(this.mode){
					case 'ajouter':
						let docs: Doc[] = [];
						for(let doc of this.addedDocs){
							docs.push(doc.doc);
						}

						this.requestsService.ajouterContenuCours(this.form.value.date, this.form.value.desc, this.form.value.groupes, this.form.value.matiere, docs)
							.then(() => {
								this.close.emit(true);
							})
							.catch(error => {
								if(error !== undefined && error.message != undefined){
									this.error = error;
								}else{
									this.error = error;
								}
							});

						break;
					case 'modifier':
						this.requestsService.modifierContenuCours(Number(this.travail.id), this.form.value.date, this.form.value.desc, this.form.value.groupes, this.form.value.matiere)
							.then(async () => {
								//ajout des nouveaux documents
								for (let doc of this.addedDocs) {
									await this.requestsService.ajouterDocumentContenuCours(Number(this.travail.id), doc.doc.nom, doc.doc.lien)
										.catch(error => {
											if (error !== undefined && error.message != undefined) {
												this.error = error;
											} else {
												this.error = error;
											}
										});
								}

								//modification des documents
								for (let doc of this.editedDocs) {
									await this.requestsService.modifierDocumentContenuCours(Number(doc.doc.id), doc.doc.nom, doc.doc.lien)
										.catch(error => {
											if (error !== undefined && error.message != undefined) {
												this.error = error;
											} else {
												this.error = error;
											}
										});
								}

								//suppression des documents
								for (let doc of this.deletedDocs) {
									console.log(doc.id)
									await this.requestsService.supprimerDocumentContenuCours(Number(doc.id))
										.catch(error => {
											if (error !== undefined && error.message != undefined) {
												this.error = error;
											} else {
												this.error = error;
											}
										});
								}
							})
							.then(() => {
								this.close.emit(true);
							})
							.catch(error => {
								if(error !== undefined && error.message != undefined){
									this.error = error;
								}else{
									this.error = error;
								}
							});

						break;
					default:
						this.error = "Une erreur est survenue, tentez de recharger la page.";
						break;
				}
				break;

			default:
				this.error = "Une erreur est survenue, tentez de recharger la page.";
				break;
		}
	}

	/* code from : https://remotestack.io/angular-checkboxes-tutorial-example/ */
	onCbChange(e: Event) {
		const groupes: FormArray = this.form.get('groupes') as FormArray;

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

	onSupprimer($event: boolean) {
		if(this.mode === 'modifier'){
			switch(this.type){
				case 'travail à faire':
					this.requestsService.supprimerTravailAFaire(Number(this.travail.id))
						.then(() => {
							this.close.emit(true);
						})
						.catch(error => {
							if(error !== undefined && error.message != undefined){
								this.error = error;
							}else{
								this.error = error;
							}
						});
					break;
				case 'contenu de cours':
					this.requestsService.supprimerContenuCours(Number(this.travail.id))
						.then(() => {
							this.close.emit(true);
						})
						.catch(error => {
							if(error !== undefined && error.message != undefined){
								this.error = error;
							}else{
								this.error = error;
							}
						});
					break;
				default:
					this.error = "Une erreur est survenue, tentez de recharger la page.";
					break;
			}
		}


	}
}
