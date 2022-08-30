import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SupprService} from "../../services/suppr.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-suppr-receiver',
  templateUrl: './suppr-receiver.component.html',
  styleUrls: ['./suppr-receiver.component.scss']
})
export class SupprReceiverComponent implements OnInit {
	afficherBoite: boolean = false;
	nomObjetASupprimer: String = '';
	emitter!: Subject<boolean>;

	constructor(private supprService: SupprService) { }

	ngOnInit(): void {
		this.supprService.getNomObjet().subscribe(nom => {this.nomObjetASupprimer = nom;});
		this.supprService.getEmitter().subscribe(emitter => {this.emitter = emitter;});
	}

	onSupprimer(valeur: boolean){
		this.afficherBoite = false;
		this.emitter.next(valeur);
		this.nomObjetASupprimer = '';
	}

}
