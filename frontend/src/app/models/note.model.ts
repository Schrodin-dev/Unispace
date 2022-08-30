export class Note{
	note!: number;
	bareme!: number;
	date!: Date;
	nomDevoir!: String;
	id!: number;
	coeff!: number;
	groupes!: String[];

	constructor(note: number, bareme: number, nomDevoir: String) {
		this.note = note;
		this.bareme = bareme;
		this.nomDevoir = nomDevoir;
		this.groupes = [];
	}

	setDate(date: string): void{
		this.date = new Date(date);
	}

	setId(id: String){
		this.id = Number(id);
	}

	setCoeff(coeff: String){
		this.coeff = Number(coeff);
	}

	addGroupe(groupe: String){
		this.groupes.push(groupe);
	}

	setGroupes(groupes: String[]){
		this.groupes = groupes;
	}
}
