import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {RequestsService} from "../../services/requests.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-ajouter-ressource-ue',
  templateUrl: './ajouter-ressource-ue.component.html',
  styleUrls: ['./ajouter-ressource-ue.component.scss']
})
export class AjouterRessourceUEComponent implements OnInit {
	@Input() semestre!: number;
	@Input() type!: String;
	@Output() ajout: EventEmitter<any> = new EventEmitter<any>();

	couleurFond!: String;
	couleurTexte!: String;

	form!: FormGroup;
	error!: String;

  constructor(private authService: AuthService, private requestsService: RequestsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
	  this.chargerCouleurs();
	  this.creerForm();


  }

  private chargerCouleurs(){
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
  }

  private creerForm(){
	  if(this.type === 'UE'){
		  this.form = this.formBuilder.group({
			  nom: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
			  numeroUE: [null, Validators.required]
		  });
	  }else{
		  this.form = this.formBuilder.group({
			  nom: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(256)]]
		  });
	  }
  }

  onSubmit(){
	  if(this.type === 'UE'){
		  this.requestsService.ajouterUE(this.form.value.nom, this.form.value.numeroUE, this.semestre)
			  .then(() => {
				  this.ajout.emit();
			  })
			  .catch(error => {
				  this.error = error.error.message;
			  });
	  }else{
		  this.requestsService.ajouterRessource(this.form.value.nom)
			  .then(() => {
				  this.ajout.emit();
			  })
			  .catch(error => {
				  this.error = error.error.message;
			  });
	  }
  }
}
