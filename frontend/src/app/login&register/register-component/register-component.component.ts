import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {RequestsService} from "../../services/requests.service";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.scss']
})
export class RegisterComponentComponent implements OnInit {
	classes$!: Observable<any>;
	form!: FormGroup;
	groupes$!: Observable<any>;

  constructor(private authService: AuthService, private requests: RequestsService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
	  this.classes$ = this.requests.getClasses();

	  this.form = this.formBuilder.group({
		  nom: [null],
		  prenom: [null],
		  email: [null],
		  classe: [null],
		  groupe: [null],
		  password: [null]
	  });

	  this.groupes$ = this.form.valueChanges.pipe(
		  filter(value => value.classe !== null),
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
