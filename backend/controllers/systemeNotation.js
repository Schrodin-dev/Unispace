const db = require('../models/index');
const {Op} = require("sequelize");

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
		noteMaxDevoir: req.body.noteMaxDevoir,
		idRessource: req.body.ressource
	})
		.then(async devoir => {
			groupesModifies = true;

			await db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
				.then(async userGroupe => {
					for(const groupe of req.body.groupes){
						await db.groupe.findOne({where: {
								[Op.and]: {
									nomClasse: userGroupe.nomClasse,
									nomGroupe: groupe
								}
							}})
							.then(async groupe => {
								if(!groupe){
									groupesModifies = false;
									return res.status(401).json({message: "Impossible de trouver l'un des groupes."});
								}

								await devoir.addGroupe(groupe.nomGroupe)
									.catch(error => {
										groupesModifies = false;
										return res.status(500).json(error);
									})
							})
							.catch(error => {
								groupesModifies = false;
								return res.status(500).json(error);
							})
					}
				})
				.catch(error => {
					groupesModifies = false;
					return res.status(500).json(error);
				})

			if(groupesModifies) devoir.save()
				.then(() => {
					return res.status(201).json({message: "Le devoir a bien été créé."});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.modifierDevoir = (req, res, next) => {
	console.log(req.body);

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
					if (req.body.coeff !== undefined) {
						devoir.coeffDevoir = req.body.coeff;
					}
					if (req.body.noteMaxDevoir !== undefined) {
						devoir.noteMaxDevoir = req.body.noteMaxDevoir;
						console.log(devoir);
					}
					if (req.body.ressource.length !== undefined) {
						devoir.idRessource = req.body.ressource;
					}

					let groupesModifies = true;
					devoir.setGroupes([]);
					if (req.body.groupes.length > 0) {
						await db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
							.then(async userGroupe => {
								for(const groupe of req.body.groupes){
									await db.groupe.findOne({where: {
											[Op.and]: {
												nomClasse: userGroupe.nomClasse,
												nomGroupe: groupe
											}
										}})
										.then(async groupe => {
											if(!groupe){
												groupesModifies = false;
												return res.status(401).json({message: "Impossible de trouver l'un des groupes."});
											}

											await devoir.addGroupe(groupe.nomGroupe)
												.catch(error => {
													groupesModifies = false;
													return res.status(500).json(error);
												})
										})
										.catch(error => {
											groupesModifies = false;
											return res.status(500).json(error);
										})
								}
							})
							.catch(error => {
								groupesModifies = false;
								return res.status(500).json(error);
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
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'élève'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour ajouter une note."});
	}

	db.devoir.findOne({where: {idDevoir: req.body.devoir}})
		.then(devoir => {
			if(devoir.noteMaxDevoir < req.body.note){
				return res.status(500).json({message: "La note doit être inférieure au barème du devoir."});
			}

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
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'élève'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour modifier une note."});
	}

	db.note.findOne({
		where: {
		userEmailUser: req.auth.userEmail,
		devoirIdDevoir: req.body.devoir
	}, include: {
			model: db.devoir,
			attributes: ['noteMaxDevoir']
		}
	})
		.then(note => {
			if(note === null){
				return res.status(400).json({message: "Impossible de trouver la note que vous souhaitez modifier."});
			}
			if(note.devoir.noteMaxDevoir < req.body.note){
				return res.status(500).json({message: "La note doit être inférieure au barème du devoir."});
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
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'élève'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour supprimer une note."});
	}

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
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'élève'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour afficher le détail des notes."});
	}

	db.UE.findAll({
		include: {
			model: db.ressource,
			include: {
				model: db.devoir,
				include: [
					{
						required: false,
						model: db.note,
						where: {userEmailUser: req.auth.userEmail},
						attributes: ['noteDevoir']
					},
					{
						required: true,
						model: db.groupe,
						attributes: ['nomGroupe'],
						where: {nomGroupe: req.auth.userGroupe}
					}
				],
				attributes: ['nomDevoir', 'coeffDevoir', 'noteMaxDevoir', 'idDevoir']
			},
		},
		attributes : ['nomUE', 'numeroUE'],
		order: ['numeroUE']
	})
		.then(detail => {
			if(detail === null){
				return res.status(400).json({message: "Aucune note trouvée."});
			}

			return res.status(201).json(calculateurMoyennes(detail));
		})
		.catch(error => {console.error(error);return res.status(500).json(error);});
};

exports.dernieresNotes = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'élève'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour afficher des notes."});
	}

	db.note.findAll({
		where: {
			userEmailUser: req.auth.userEmail
		},
		include:{
			model: db.devoir,
			required: true,
			attributes: ['nomDevoir', 'noteMaxDevoir']
		},
		attributes: ['noteDevoir', 'createdAt'],
		limit: 5,
		order: [['createdAt', 'DESC']]
	})
		.then(notes => {
			return res.status(200).json(notes);
		})
		.catch(error => {return res.status(500).json(error)});
};

function calculateurMoyennes(detail){
	let parsedNotes = [];

	for(let indexUE in detail ){
		const UE = detail[indexUE];

		parsedNotes[indexUE] = {};
		parsedNotes[indexUE].nom = 'C' + UE.numeroUE + ' ' + UE.nomUE;
		parsedNotes[indexUE].ressources = [];

		let sommePondereeRessources = 0.0;
		let sommePoidsRessources = 0.0;
		for(let indexRessource in UE.ressources){
			const ressource = UE.ressources[indexRessource];

			parsedNotes[indexUE].ressources[indexRessource] = {};
			parsedNotes[indexUE].ressources[indexRessource].nom = ressource.nomRessource;
			parsedNotes[indexUE].ressources[indexRessource].id = ressource.idRessource;
			parsedNotes[indexUE].ressources[indexRessource].devoirs = [];

			let sommePondereeDevoirs = 0.0;
			let sommePoidsDevoirs = 0.0;
			for(let indexDevoir in ressource.devoirs){
				const devoir = ressource.devoirs[indexDevoir]

				parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir] = {};
				parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].nom = devoir.nomDevoir;
				parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].id = devoir.idDevoir;
				parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].coeff = devoir.coeffDevoir;
				parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].groupes = []
				for(const groupe of devoir.groupes){
					parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].groupes.push(groupe.nomGroupe);
				}

				if(devoir.notes[0] !== undefined){
					sommePondereeDevoirs += adjustTo20(devoir.notes[0].noteDevoir, devoir.noteMaxDevoir) * devoir.coeffDevoir;
					sommePoidsDevoirs += devoir.coeffDevoir;

					parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].note = devoir.notes[0].noteDevoir;
				}else{
					parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].note = "??";
				}
				parsedNotes[indexUE].ressources[indexRessource].devoirs[indexDevoir].bareme = devoir.noteMaxDevoir;
			}

			if(sommePoidsDevoirs !== 0){
				parsedNotes[indexUE].ressources[indexRessource].moyenne = sommePondereeDevoirs/sommePoidsDevoirs;
				sommePondereeRessources += parsedNotes[indexUE].ressources[indexRessource].moyenne * ressource.etreLieUE.coeffRessource;
				sommePoidsRessources += ressource.etreLieUE.coeffRessource;
			}else{
				parsedNotes[indexUE].ressources[indexRessource].moyenne = "??";
			}
		}
		if(sommePoidsRessources !== 0){
			parsedNotes[indexUE].moyenne = sommePondereeRessources/sommePoidsRessources;
		}else{
			parsedNotes[indexUE].moyenne = "??";
		}


	}

	return lessDetailledNotes(parsedNotes);
}

function lessDetailledNotes(detail){
	let result = {
		UE: [],
		ressources: []
	};

	for(const ue of detail){
		result.UE.push({
			nom: ue.nom,
			moyenne: ue.moyenne
		});

		for(const ressource of ue.ressources){
			result.ressources[ressource.id - 1] = ressource;
		}
	}

	return result;
}

function adjustTo20(note, bareme){
	return (note*20)/bareme;
}