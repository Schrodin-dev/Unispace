import {Component, Input, OnInit} from '@angular/core';
import {TravailAFaire} from "../../models/travailAFaire.model";
import {AuthService} from "../../services/auth.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-travail-a-faire',
  templateUrl: './travail-a-faire.component.html',
  styleUrls: ['./travail-a-faire.component.scss']
})
export class TravailAFaireComponent implements OnInit {
	@Input() travail!: TravailAFaire;
	@Input() emitter!: Subject<TravailAFaire>;
	@Input() isEmbed: boolean = true;
	@Input() type!: String;

	couleurTexte!: String;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
	  this.authService.couleurTexte.subscribe(couleur => {this.couleurTexte = couleur;});
  }

	dateToHoursString(date: Date): String{
		let result = '';
		result += date.getUTCHours();
		result += 'h';
		if(date.getUTCMinutes() > 0){
			result += date.getUTCMinutes();
		}

		return result;

	}

	afficher() {
	  	if(this.isEmbed) return;
		this.emitter.next(this.travail);
	}

	description(): String{
	  if(this.travail.desc.length > 500){
		  return this.travail.desc.slice(0, 500) + '[...]';
	  }

	  return this.travail.desc;
	}
}
