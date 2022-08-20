import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import {FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {RequestsService} from "../../services/requests.service";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.scss']
})
export class RegisterComponentComponent implements OnInit {
	couleurFond!: String;
	couleurTexte!: String;

	classes$!: Observable<any>;
	form!: FormGroup;
	groupes$!: Observable<any>;

  constructor(private authService: AuthService, private requests: RequestsService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
	  this.authService.couleurFond.subscribe(couleur => {this.couleurFond = couleur;});
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
	  this.classes$ = this.requests.getClasses();

	  this.form = this.formBuilder.group({
		  nom: [null, [Validators.required, Validators.maxLength(40)]],
		  prenom: [null, [Validators.required, Validators.maxLength(40)]],
		  email: [null, [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z]+\.[a-zA-Z]+@etu\.umontpellier\.fr$/i), Validators.maxLength(128)]],
		  classe: ["classe", [Validators.required, notValueValidator('classe')]],
		  groupe: ["groupe", [Validators.required, notValueValidator('groupe')]],
		  password: [null, [Validators.required]]
	  });

	  this.groupes$ = this.form.valueChanges.pipe(
		  map(async value => {
			  let res: any[] = [];
			  await this.classes$.forEach(classes => {
				  classes.forEach((classe: any) => {
					  if(classe.nomClasse === value.classe){
						  res = classe.groupes;
					  }
				  });
			  });
			  return res;
		  })
	  );
  }

  onRegister(){
    this.authService.register(this.form.value.nom, this.form.value.prenom, this.form.value.email, this.form.value.password, this.form.value.classe, this.form.value.groupe);
  }


}

/* vérifie que la valeur de l'input n'est pas celle indiquée */
export const notValueValidator = (valeurNonVoulue: string): ValidatorFn => (control) => {
	const { value } = control;
	const erreur = (value as string) !== valeurNonVoulue;
	return erreur ? null : { erreur: 'Veuillez choisir un/une ' + valeurNonVoulue };
};
