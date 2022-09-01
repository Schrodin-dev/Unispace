import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Doc} from "../../models/doc.model";
import {Subject} from "rxjs";
import { v4 as uuid } from "uuid";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
	@Input() docSubject!: Subject<Doc>;
	@Output() supprimer: EventEmitter<Doc> = new EventEmitter<Doc>();

	couleurFond!: String;
	couleurTexte!: String;

	form!: FormGroup;
	doc!: Doc;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});

	  this.docSubject.subscribe(doc => {this.doc = doc;});

	  this.creerForm();

	  this.updateDoc();
  }

  creerForm(){
	  this.form = this.formBuilder.group({
		  nom: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
		  lien: [null, [Validators.required, Validators.minLength(1)]]
	  });

	  if(this.doc){
		  this.form.patchValue({'nom': this.doc.nom});
		  this.form.patchValue({'lien': this.doc.lien});
	  }
  }

  updateDoc(){
	  this.form.valueChanges.subscribe(value => {
		  if(this.form.valid){
			  if(this.doc){
				  this.docSubject.next(new Doc(this.doc.id, value.nom, value.lien));
			  }else{
				  this.docSubject.next(new Doc(uuid(), value.nom, value.prenom));
			  }
		  }
	  })
  }

	onSupprimer($event: boolean) {
		if($event )this.supprimer.emit(this.doc);
	}
}
