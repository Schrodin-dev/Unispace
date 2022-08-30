import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SupprService} from "../../services/suppr.service";

@Component({
  selector: 'app-suppr-emitter',
  templateUrl: './suppr-emitter.component.html',
  styleUrls: ['./suppr-emitter.component.scss']
})
export class SupprEmitterComponent implements OnInit {
	@Input() nomObjetASupprimer!: String;

	@Output() supprimer: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private supprService: SupprService) { }

	ngOnInit(): void {

	}

	onSupprimer(){
		this.supprService.emit(this.nomObjetASupprimer).subscribe(value => {this.supprimer.emit(value);});
	}
}
