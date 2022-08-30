import {Subject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class SupprService{
	private nomObjet: Subject<String> = new Subject<String>();
	private emitter: Subject<Subject<boolean>> = new Subject<Subject<boolean>>();


	constructor() {}

	emit(nomObjet: String): Subject<boolean>{
		this.nomObjet.next(nomObjet);
		let emitter: Subject<boolean> = new Subject<boolean>();
		this.emitter.next(emitter);

		return emitter;
	}

	getEmitter(): Subject<Subject<boolean>>{
		return this.emitter;
	}

	getNomObjet(): Subject<String>{
		return this.nomObjet;
	}
}
