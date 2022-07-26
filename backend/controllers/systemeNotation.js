const db = require('../models/index');

exports.ajouterUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(401).json({message: "Vous devez être admin pour créer une UE."});
	}

	db.UE.create({
		nomUE: req.body.nom,
		numeroUE : req.body.numeroUE,
		nomSemestre: req.body.semestre
	})
		.then(() => {
			return res.status(201).json({message: "L'UE a bien été créée."});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.supprimerUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(401).json({message: "Vous devez être admin pour supprimer une UE."});
	}

	db.UE.findOne({where: {idUE: req.body.UE}})
		.then(UE => {
			if(UE === null){
				return res.status(400).json({message: "Impossible de trouver l'UE que vous essayez de supprimer."});
			}

			UE.destroy()
				.then(() => {
					return res.status(201).json({message: "L'UE a bien été supprimée."});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.recupererUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(401).json({message: "vous n'avez pas les droits suffisants pour afficher les UE."});
	}

	db.UE.findAll()
		.then(UE => {
			return res.status(201).json(UE);
		})
		.catch(error => {res.status(500).json(error);});
};



exports.ajouterRessource = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour ajouter une ressource"});
	}

	db.ressource.create({
		nomRessource: req.body.nom
	})
		.then(() => {
			return res.status(201).json({message: "La ressource a bien été créée."});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.supprimerRessource = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour supprimer une ressource."});
	}

	db.ressource.findOne({where: {idRessource: req.body.ressource}})
		.then(ressource => {
			if(ressource === null){
				return res.status(400).json({message: "Impossible de trouver la ressource que vous essayez de supprimer."});
			}

			ressource.destroy()
				.then(() => {
					return res.status(201).json({message: "La ressource a bien été supprimée."});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.recupererRessource = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(401).json({message: "Vous devez être admin pour afficher les ressources."})
	}

	db.ressource.findAll()
		.then(ressources => {
			return res.status(201).json(ressources);
		})
		.catch(error => {res.status(500).json(error);});
};



exports.lierRessourceUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(401).json({message: "Vous devez être admin pour lier une UE et une ressource."});
	}

	db.etreLieUE.create({
		UEIdUE: req.body.UE,
		ressourceIdRessource: req.body.ressource,
		coeffRessource: req.body.coeff
	})
		.then(() => {
			return res.status(201).json({message: "L'UE a bien été liée à la ressource."});
		})
		.catch(error => {res.status(500).json(error);});
};

exports.modifierCoeffRessourceUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(401).json({message: "Vous devez être admin pour modifier le coefficient entre une UE et une ressource."});
	}

	db.etreLieUE.findOne({where: {
			ressourceIdRessource: req.body.ressource,
			UEIdUE: req.body.UE
		}})
		.then(lien => {
			if(lien === null){
				return res.status(400).json({message: "Cette ressource et cette UE ne sont pas liées."})
			}

			lien.coeffRessource = req.body.coeff;
			lien.save()
				.then(() => {
					return res.status(201).json({message: "Le coefficient a bien été modifié."});
				})
				.catch(error => {res.status(500).json(error);});
		})
		.catch(error => {res.status(500).json(error);});
};

exports.supprimerLienRessourceUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(401).json({message: "Vous devez être admin pour supprimer le lien entre une UE et une ressource."});
	}

	db.etreLieUE.findOne({where: {
			ressourceIdRessource: req.body.ressource,
			UEIdUE: req.body.UE
		}})
		.then(lien => {
			if(lien === null){
				return res.status(400).json({message: "Cette ressource et cette UE ne sont pas liées."})
			}

			lien.destroy()
				.then(() => {
					return res.status(201).json({message: "Le lien entre cette UE et cette ressource a bien été supprimé."});
				})
				.catch(error => {res.status(500).json(error);});
		})
		.catch(error => {res.status(500).json(error);});
}



exports.ajouterDevoir = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour ajouter un devoir."});
	}

	db.devoir.create({
		nomDevoir: req.body.nom,
		coeffDevoir: req.body.coeff,
		noteMaxDevoir: req.body.bareme,
		idRessource: req.body.ressource
	})
		.then(devoir => {
			devoir.setGroupes(req.body.groupes)
				.then(() => {
					devoir.save()
						.then(() => {
							return res.status(201).json({message: "Le devoir a bien été créé."});
						})
						.catch(error => {return res.status(500).json(error);});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.modifierDevoir = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour modifier un devoir."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			db.devoir.findOne({
				where: {idDevoir: req.body.devoir},
				include: {
					model: db.groupe,
					required: true,
					where: {nomClasse: userGroupe.nomClasse}
				}
			})
				.then(async devoir => {
					if (devoir === null) {
						return res.status(400).json({message: "Impossible de trouver le devoir que vous essayez de modifier."});
					}

					if (req.body.nom.length > 0) {
						devoir.nomDevoir = req.body.nom;
					}
					if (req.body.coeff.length > 0) {
						devoir.coeffDevoir = req.body.coeff;
					}
					if (req.body.noteMaxDevoir.length > 0) {
						devoir.noteMaxDevoir = req.body.noteMaxDevoir;
					}
					if (req.body.ressource.length > 0) {
						devoir.idRessource = req.body.ressource;
					}
					let groupesModifies = true;
					if (req.body.groupes.length > 0) {
						await devoir.setGroupes(req.body.groupes)
							.catch(() => {
								groupesModifies = false;
								return res.status(500).json({message: "Impossible de modifier les groupes."});
							})
					}

					if (groupesModifies) devoir.save()
						.then(() => {
							return res.status(201).json({message: "Le devoir a bien été modifié."});
						})
						.catch(error => {
							return res.status(500).json(error);
						});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.supprimerDevoir = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour supprimer un devoir."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			db.devoir.findOne({
				where: {idDevoir: req.body.devoir},
				include: {
						model: db.groupe,
						required: true,
						where: {nomClasse: userGroupe.nomClasse}
				}
			})
				.then(devoir => {
					if(devoir === null){
						return res.status(400).json({message: "Impossible de trouver le devoir que vous essayez de supprimer."});
					}

					devoir.destroy()
						.then(() => {
							return res.status(201).json({message: "Le devoir a bien été supprimé."});
						})
						.catch(error => {return res.status(500).json(error);});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.ajouterNote = (req, res, next) => {
	db.devoir.findOne({where: {idDevoir: req.body.devoir}})
		.then(devoir => {
			devoir.getGroupes()
				.then(groupes => {
					let groupeValide = false;
					for(const groupe of groupes){
						if(groupe.idGroupe === req.auth.groupeUser){
							groupeValide = true;
							break;
						}
					}
					console.log(groupes);
					if(!groupeValide){
						return res.status(401).json({message: "Ce devoir ne concerne pas votre groupe."});
					}else{
						db.note.create({
							userEmailUser: req.auth.userEmail,
							devoirIdDevoir: req.body.devoir,
							noteDevoir: req.body.note
						})
							.then(() => {
								return res.status(201).json({message: "La note a bien été ajoutée."});
							})
							.catch(error => {return res.status(500).json(error);});
					}
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {console.error(error);res.status(400).json({message: "Impossible de trouver le devoir."})});
};

exports.modifierNote = (req, res, next) => {
	db.note.findOne({where: {
		userEmailUser: req.auth.userEmail,
		devoirIdDevoir: req.body.devoir
	}})
		.then(note => {
			if(note === null){
				return res.status(400).json({message: "Impossible de trouver la note que vous souhaitez modifier."});
			}

			note.noteDevoir = req.body.note;

			note.save()
				.then(() => {
					return res.status(201).json({message: "Votre note a bien été modifiée."});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.supprimerNote = (req, res, next) => {
	db.note.findOne({where: {
			userEmailUser: req.auth.userEmail,
			devoirIdDevoir: req.body.devoir
	}})
		.then(note => {
			if(note === null){
				return res.status(400).json({message: "Impossible de trouver la note que vous essayez de supprimer."});
			}

			note.destroy()
				.then(() => {
					return res.status(201).json({message: "La note a bien été supprimée."});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.detailDesNotes = (req, res, next) => {
	db.UE.findAll({
		include: {
			model: db.ressource,
			//required: true,
			include: {
				model: db.devoir,
				include: {
					required: false,
					model: db.note,
					where: {userEmailUser: req.auth.userEmail},
					attributes: ['noteDevoir']
				},
				attributes: ['nomDevoir', 'coeffDevoir', 'noteMaxDevoir']
			},
		},
		attributes : ['nomUE']
	})
		.then(detail => {
			if(detail === null){
				return res.status(400).json({message: "Aucune note trouvée."});
			}

			//return res.status(201).json(detail);
			return res.status(201).json(calculateurMoyennes(detail));
		})
		.catch(error => {console.error(error);return res.status(500).json(error);});
};

function calculateurMoyennes(detail){
	let parsedNotes = [];

	for(let indexUE in detail ){
		const UE = detail[indexUE];

		parsedNotes[indexUE] = {};
		parsedNotes[indexUE].nom = UE.nomUE;
		parsedNotes[indexUE].ressources = [];

		let sommePondereeRessources = 0.0;
		let sommePoidsRessources = 0.0;
		for(let indexRessource in UE.ressources){
			const ressource = UE.ressources[indexRessource];

			parsedNotes[indexUE].ressources[indexRessource] = {};
			parsedNotes[indexUE].ressources[indexRessource].nom = ressource.nomRessource;
			parsedNotes[indexUE].ressources[indexRessource].devoirs = [];

			let sommePondereeDevoirs = 0.0;
			let sommePoidsDevoirs = 0.0;
			for(let indexDevoir in ressource.devoirs){
				const devoir = ressource.devoirs[indexDevoir]

				parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir] = {};
				parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].nom = devoir.nomDevoir;
				if(devoir.notes[0] !== undefined){
					sommePondereeDevoirs += devoir.notes[0].noteDevoir * devoir.coeffDevoir;
					sommePoidsDevoirs += devoir.coeffDevoir;

					parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].note = devoir.notes[0].noteDevoir;
				}else{
					parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].note = "non renseigné";
				}
				parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].bareme = devoir.noteMaxDevoir;
			}

			if(sommePoidsDevoirs !== 0){
				parsedNotes[indexUE].ressources[indexRessource].moyenne = sommePondereeDevoirs/sommePoidsDevoirs;
				sommePondereeRessources += parsedNotes[indexUE].ressources[indexRessource].moyenne * ressource.etreLieUE.coeffRessource;
				sommePoidsRessources += ressource.etreLieUE.coeffRessource;
			}else{
				parsedNotes[indexUE].ressources[indexRessource].moyenne = "non renseigné";
			}
		}
		if(sommePoidsRessources !== 0){
			parsedNotes[indexUE].moyenne = sommePondereeRessources/sommePoidsRessources;
		}else{
			parsedNotes[indexUE].moyenne = "non renseigné";
		}


	}

	return parsedNotes;
}