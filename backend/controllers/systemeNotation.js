const db = require('../models/index');
const {Op, literal} = require("sequelize");

/*
* BUT: ajouter une UE (équivalent d'une Compétence)
*
* paramètres: nom (=nomUE), numeroUE, parcours (=parcours.nomParcours)
*
* droits requis: admin
* */
exports.ajouterUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous devez être admin pour créer une UE."});
	}

	db.UE.create({
		nomUE: req.body.nom,
		numeroUE : req.body.numeroUE,
		nomParcours: req.body.parcours
	})
		.then(() => {
			return res.status(201).json({message: "L'UE a bien été créée."});
		})
		.catch(() => {
			return res.status(500).json({message: "Impossible de créer l'UE."});
		});
};

/*
* BUT: supprimer une UE (équivalent d'une Compétence)
*
* paramètres: UE (=idUE)
*
* droits requis: admin
* */
exports.supprimerUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message:"Vous devez être admin pour supprimer une UE."});
	}

	db.UE.findOne({where: {idUE: req.body.UE}})
		.then(UE => {
			if(!UE){
				throw new Error("Impossible de trouver l'UE que vous essayez de supprimer.");
			}

			return UE.destroy();
		})
		.then(() => {
			return res.status(201).json({message: "L'UE a bien été supprimée."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
};

/*
* BUT: afficher la liste des UE
*
* paramètres: AUCUN
*
* droits requis: admin
* */
exports.recupererUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "vous n'avez pas les droits suffisants pour afficher les UE."});
	}

	db.UE.findAll()
		.then(UE => {
			return res.status(201).json(UE);
		})
		.catch(() => {
			res.status(500).json({message: "Impossible de récupérer les UE."});
		});
};

/*
* BUT: ajouter une ressource
*
* paramètres: nom (=nomRessource)
*
* droits requis: admin
* */
exports.ajouterRessource = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour ajouter une ressource"});
	}

	db.ressource.create({
		nomRessource: req.body.nom
	})
		.then(() => {
			return res.status(201).json({message: "La ressource a bien été créée."});
		})
		.catch(() => {
			return res.status(500).json({message: "Impossible de créer la ressource."});
		});
};

/*
* BUT: supprimer une ressource
*
* paramètres: ressource (=idRessource)
*
* droits requis: admin
* */
exports.supprimerRessource = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour supprimer une ressource."});
	}

	db.ressource.findOne({where: {idRessource: req.body.ressource}})
		.then(ressource => {
			if(!ressource){
				throw new Error("Impossible de trouver la ressource que vous essayez de supprimer.");
			}

			return ressource.destroy();
		})
		.then(() => {
			return res.status(201).json({message: "La ressource a bien été supprimée."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
};

/*
* BUT: afficher la liste des ressource
*
* paramètres: AUCUN
*
* droits requis: admin
* */
exports.recupererRessource = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous devez être admin pour afficher les ressources."});
	}

	db.ressource.findAll()
		.then(ressources => {
			return res.status(201).json(ressources);
		})
		.catch(() => {
			res.status(500).json({message: "Impossible de récupérer les ressources."});
		});
};

/*
* BUT: lier une ressource et une UE (Compétence) entre elles avec un coefficient donné
*
* paramètres: UE (=UE.idUE), ressource (=ressource.idRessource), coeff (=coeffRessource)
*
* droits requis: admin
* */
exports.lierRessourceUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous devez être admin pour lier une UE et une ressource."});
	}

	db.etreLieUE.create({
		UEIdUE: req.body.UE,
		ressourceIdRessource: req.body.ressource,
		coeffRessource: req.body.coeff
	})
		.then(() => {
			return res.status(201).json({message: "L'UE a bien été liée à la ressource."});
		})
		.catch(() => {
			res.status(500).json({message: "Impossible de lier l'UE à la ressource."});
		});
};

/*
* BUT: modifier le coefficient qui lie une ressource à une UE (compétence)
*
* paramètres: ressource (=ressource.idRessource), UE (=UE.idUE), coeff (=coeffRessource)
*
* droits requis: admin
* */
exports.modifierCoeffRessourceUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous devez être admin pour modifier le coefficient entre une UE et une ressource."});
	}

	db.etreLieUE.findOne({where: {
			ressourceIdRessource: req.body.ressource,
			UEIdUE: req.body.UE
		}})
		.then(lien => {
			if(!lien){
				throw new Error("Cette ressource et cette UE ne sont pas liées.");
			}

			lien.coeffRessource = req.body.coeff;
			return lien.save()
		})
		.then(() => {
			return res.status(201).json({message: "Le coefficient a bien été modifié."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
};

/*
* BUT: supprimer le lien entre une ressource et une UE (Compétence)
*
* paramètres: ressource (=ressource.idRessource), UE (=UE.idUE)
*
* droits requis: admin
* */
exports.supprimerLienRessourceUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous devez être admin pour supprimer le lien entre une UE et une ressource."});
	}

	db.etreLieUE.findOne({where: {
			ressourceIdRessource: req.body.ressource,
			UEIdUE: req.body.UE
		}})
		.then(lien => {
			if(!lien){
				throw new Error("Cette ressource et cette UE ne sont pas liées.");
			}

			return lien.destroy()
		})
		.then(() => {
			return res.status(201).json({message: "Le lien entre cette UE et cette ressource a bien été supprimé."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
}

/*
* BUT: ajouter un nouveau devoir pour une ressource (équivalent d'une matière, SAÉ, portfolio) donnée
*
* paramètres: nom (=nomDevoir), coeff (=coeffDevoir), noteMaxDevoir, ressource (=ressource.idRessource)
*
* droits requis: publicateur, délégué, admin
* */
exports.ajouterDevoir = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour ajouter un devoir."});
	}

	db.devoir.create({
		nomDevoir: req.body.nom,
		coeffDevoir: req.body.coeff,
		noteMaxDevoir: req.body.noteMaxDevoir,
		idRessource: req.body.ressource
	})
		.then(devoir => {
			return db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
				.then(userGroupe => {
					//vérification des groupes
					let promessesGroupes = [];

					for(const groupeConst of req.body.groupes){
						promessesGroupes.push(db.groupe.findOne({where: {
								[Op.and]: {
									nomClasse: userGroupe.nomClasse,
									nomGroupe: groupeConst
								}
							}})
							.then(groupe => {
								if(!groupe){
									throw new Error("Impossible de trouver l'un des groupes.");
								}

								devoir.addGroupe(groupe.nomGroupe);
							})
							.catch(error => {
								throw new Error("Impossible de trouver l'un des groupes.");
							})
						);
					}

					return Promise.all(promessesGroupes)
						.then(() => {
							return devoir;
						})
				})
		})
		.then(devoir => {
			return devoir.save();
		})
		.then(() => {
			return res.status(201).json({message: "Le devoir a bien été créé."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
};

/*
* BUT: modifier un devoir pour un groupe de sa classe
*
* paramètres: devoir (=idDevoir), nom (=nomDevoir), coeff (=coeffDevoir), noteMaxDevoir, ressource (=ressource.idRessource)
*
* droits requis: publicateur, délégué, admin
* */
exports.modifierDevoir = (req, res, next) => {
	console.log(req.body);

	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour modifier un devoir."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			return db.devoir.findOne({
				where: {idDevoir: req.body.devoir},
				include: {
					model: db.groupe,
					required: true,
					where: {nomClasse: userGroupe.nomClasse}
				}
			})
				.catch(() => {
					throw new Error("Impossible de trouver le devoir que vous essayez de modifier.");
				})
		})
		.then(devoir => {
			if (!devoir) {
				throw new Error("Impossible de trouver le devoir que vous essayez de modifier.");
			}

			if (req.body.nom.length > 0) {
				devoir.nomDevoir = req.body.nom;
			}
			if (req.body.coeff !== undefined) {
				devoir.coeffDevoir = req.body.coeff;
			}
			if (req.body.noteMaxDevoir !== undefined) {
				devoir.noteMaxDevoir = req.body.noteMaxDevoir;
			}
			if (req.body.ressource.length !== undefined) {
				devoir.idRessource = req.body.ressource;
			}

			let promesse = [];
			if (req.body.groupes.length > 0) {
				//modification des groupes
				promesse.push(db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
					.then(userGroupe => {
						//vérification de l'existance des groupes :)
						let promessesGroupes = [];

						for(const groupe of req.body.groupes){
							promessesGroupes.push(db.groupe.findOne({where: {
									[Op.and]: {
										nomClasse: userGroupe.nomClasse,
										nomGroupe: groupe
									}
								}})
								.then(groupe => {
									if(!groupe){
										throw new Error("Impossible de trouver l'un des groupes.");
									}
								})
								.catch(() => {
									throw new Error("Impossible de trouver l'un des groupes.");
								})
							);
						}

						return Promise.all(promessesGroupes);
					})
					.then(() => {
						return devoir.setGroupes(req.body.groupes);
					})
					.then(() => {
						return devoir.save();
					})
				)
			}

			return Promise.all(promesse);
		})
		.then(() => {
			return res.status(200).json({message: "Le devoir a bien été modifié."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
};

/*
* BUT: supprimer un devoir pour un groupe de la classe de l'utilisateur
*
* paramètres: devoir (=idDevoir)
*
* droits requis: publicateur, délégué, admin
* */
exports.supprimerDevoir = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour supprimer un devoir."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			return db.devoir.findOne({
				where: {idDevoir: req.body.devoir},
				include: {
						model: db.groupe,
						required: true,
						where: {nomClasse: userGroupe.nomClasse}
				}
			})
		})
		.then(devoir => {
			if(!devoir){
				throw new Error("Impossible de trouver le devoir que vous essayez de supprimer.");
			}

			return devoir.destroy()
		})
		.then(() => {
			return res.status(201).json({message: "Le devoir a bien été supprimé."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
};

/*
* BUT: ajouter une note à un devoir
*
* paramètres: devoir (=devoir.idDevoir), note (=noteDevoir)
*
* droits requis: élève, publicateur, délégué, admin
* */
exports.ajouterNote = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'élève'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour ajouter une note."});
	}

	db.devoir.findOne({where: {idDevoir: req.body.devoir}})
		.then(devoir => {
			if(!devoir){
				throw new Error("Impossible de trouver le devoir.");
			}

			if(devoir.noteMaxDevoir < req.body.note){
				throw new Error("La note doit être inférieure au barème du devoir.");
			}

			return devoir.getGroupes();
		})
		.then(groupes => {
			// vérifie si les groupes sont valides
			let groupeValide = false;
			for(const groupe of groupes){
				if(groupe.idGroupe === req.auth.groupeUser){
					groupeValide = true;
					break;
				}
			}
			if(!groupeValide){
				throw new Error("Ce devoir ne concerne pas votre groupe.");
			}

			return db.note.create({
				userEmailUser: req.auth.userEmail,
				devoirIdDevoir: req.body.devoir,
				noteDevoir: req.body.note
			})
				.catch(() => {
					throw new Error("Impossible de trouver le devoir.");
				})
		})
		.then(() => {
			return res.status(201).json({message: "La note a bien été ajoutée."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
};

/*
* BUT: modifier la note obtenue à un devoir
*
* paramètres:  devoir (=devoir.idDevoir), note (=noteDevoir)
*
* droits requis: élève, publicateur, délégué, admin
* */
exports.modifierNote = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'élève'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour modifier une note."});
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
			if(!note){
				throw new Error("Impossible de trouver la note que vous souhaitez modifier.");
			}
			if(note.devoir.noteMaxDevoir < req.body.note){
				throw new Error("La note doit être inférieure au barème du devoir.");
			}

			note.noteDevoir = req.body.note;

			return note.save()
				.catch(() => {
					throw new Error("Impossible de modifier la note.");
				});
		})
		.then(() => {
			return res.status(201).json({message: "Votre note a bien été modifiée."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
};

/*
* BUT: supprimer une note à un devoir
*
* paramètres: devoir (=devoir.idDevoir)
*
* droits requis: élève, publicateur, délégué, admin
* */
exports.supprimerNote = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'élève'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour supprimer une note."});
	}

	db.note.findOne({where: {
			userEmailUser: req.auth.userEmail,
			devoirIdDevoir: req.body.devoir
	}})
		.then(note => {
			if(!note){
				throw new Error("Impossible de trouver la note que vous essayez de supprimer.");
			}

			return note.destroy()
				.catch(() => {
					throw new Error("Impossible de supprimer la note.");
				});
		})
		.then(() => {
			return res.status(201).json({message: "La note a bien été supprimée."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
};

/*
* BUT: afficher le bulletin de notes détaillé avec d'une part les ressources et ses devoirs, et d'autre part un résumé des moyennes obtenues pour chaque UE (Compétence)
*
* paramètres: AUCUN
*
* droits requis: élève, publicateur, délégué, admin
* */
exports.detailDesNotes = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'élève'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour afficher le détail des notes."});
	}

	db.classe.findOne({
		include: {
			model: db.groupe,
			required: true,
			where: {
				nomGroupe: req.auth.userGroupe
			}
		},
		attributes: ['nomParcours']
	})
		.then(classe => {
			if(!classe){
				throw new Error("Impossible de trouver le parcours de votre classe.");
			}

			return db.UE.findAll({
				include: [
					{
						model: db.ressource,
						include: {
							model: db.devoir,
							required: false,
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
								}
							],
							where: {idDevoir: {[Op.in]: literal("(SELECT DISTINCT idDevoir FROM aPourDevoir WHERE nomGroupe = '" + req.auth.userGroupe + "')")}},
							attributes: ['nomDevoir', 'coeffDevoir', 'noteMaxDevoir', 'idDevoir']
						},
					}
				],
				/*where: {
					nomParcours: classe.nomParcours
				},*/
				attributes: ['nomUE', 'numeroUE', 'nomParcours'],
				order: ['numeroUE']
			});
		})
		.then(detail => {
			if(!detail){
				throw new Error("Aucune note trouvée.");
			}

			return res.status(201).json(calculateurMoyennes(detail));
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
};

/*
* BUT: afficher un bref aperçu des dernières notes (jusqu'à 5) de l'utilisateur
*
* paramètres: AUCUN
*
* droits requis: élève, publicateur, délégué, admin
* */
exports.dernieresNotes = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'élève'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour afficher des notes."});
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
		.catch(() => {
			return res.status(500).json({message: "Impossible de charger les nouvelles notes."});
		});
};

/*
* BUT: calculer les moyennes des ressources et des UE en fonction des coefficients définis
*
* paramètres: detail
*
* droits requis: AUCUN
* */
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

/*
* BUT: séparer dans le tableau de notes avec les moyennes, les ressources et les UE (puisqu'un UE peut avoir plusieurs ressources)
*
* paramètres: detail
*
* droits requis: AUCUN
* */
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
			let ressourceAlreadyExist = false;

			for(const r of result.ressources){
				if(ressource.id === r.id) ressourceAlreadyExist = true;
			}

			if(!ressourceAlreadyExist) result.ressources.push(ressource);
		}
	}

	return result;
}

/*
* BUT: ramener une note sur 20
*
* paramètres: note, bareme
*
* droits requis: AUCUN
* */
function adjustTo20(note, bareme){
	return (note*20)/bareme;
}

/*
* BUT: lister les différents parcours au sein du BUT
*
* paramètres: AUCUN
*
* droits requis: admin
* */
exports.listeParcours = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour afficher la liste des semestres."});
	}

	db.parcours.findAll({attributes: ['nomParcours']})
		.then(parcours => {
			return res.status(200).json(parcours);
		})
		.catch(() => {
			return res.status(500).json({message: "Impossible de charger la liste des semestres."});
		});
}

/*
* BUT: afficher la liste des UE et des ressources pour un parcours donné, ainsi que les coefficients, s'ils existent, qui lient une ressource à une UE
*
* paramètres: parcours (=parcours.nomParcours)
*
* droits requis: admin
* */
exports.afficherRessourcesUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour afficher la liste ressources et des U.E.."});
	}

	let objetRetourne = {
		ressources: [],
		UE: [],
		coeffs: []
	};

	db.parcours.findOne({where: {nomParcours: req.body.parcours}})
		.then(parcours => {
			if(!parcours){
				throw new Error("Impossible de trouver le parcours.");
			}

			return parcours;
		})
		.then(parcours => {
			//récupérer les ressources
			return db.ressource.findAll()
				.then(ressources => {
					if(ressources !== undefined){
						for(let ressource of ressources){
							objetRetourne.ressources.push({id: ressource.idRessource, nom: ressource.nomRessource});
						}
					}
				})
				.then(() => {
					//récupérer les UE
					return db.UE.findAll({
							where: {nomParcours: parcours.nomParcours}
						})
						.then(listeUE => {
							if(listeUE !== undefined){
								for(let UE of listeUE){
									objetRetourne.UE.push({id: UE.idUE, nom: UE.nomUE});
								}
							}
						})
						.then(() => {
							//récupérer les coeff
							return db.etreLieUE.findAll({
								include: {
									model: db.UE,
									required: true,
									where: {nomParcours: parcours.nomParcours}
								}
							})
								.then(liens => {
									if(liens !== undefined){
										for(let lien of liens){
											objetRetourne.coeffs.push({
												ressource: lien.ressourceIdRessource,
												UE: lien.UEIdUE,
												coeff: lien.coeffRessource
											})
										}
									}
								})
								.then(() => {
									return res.status(200).json(objetRetourne);
								})
						})
				})
		})
		.catch(() => {
			return res.status(500).json({message: "Une erreur est survenue."});
		});
};

/*
* BUT: récupérer la liste des parcours
*
* paramètres: AUCUN
*
* droits requis: admin
* */
exports.recupererParcours = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour afficher la liste des parcours."});
	}

	db.parcours.findAll({
		attributes: ['nomParcours']
	})
		.then(parcours => {
			return res.status(200).json(parcours);
		})
		.catch(() => {
			return res.status(500).json({message: "Impossible de charger la liste des parcours."});
		});
};

/*
* BUT: ajouter un nouveau parcours
*
* paramètres: nomParcours
*
* droits requis: admin
* */
exports.ajouterParcours = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour ajouter un parcours."});
	}

	db.parcours.create({
		nomParcours: req.body.nomParcours
	})
		.then(() => {
			return res.status(200).json({message: "Le parcours a bien été créé."});
		})
		.catch(() => {
			return res.status(500).json({message: "Impossible de créer le parcours."});
		});
};

/*
* BUT: supprimer un parcours
*
* paramètres: parcours (=parcours.nomParcours)
*
* droits requis: admin
* */
exports.supprimerParcours = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour supprimer un parcours."});
	}

	db.parcours.findOne({where: {
			nomParcours: req.body.parcours
		}})
		.then(parcours => {
			if(!parcours){
				throw new Error("Impossible de trouver le parcours.");
			}

			return parcours.destroy();
		})
		.then(() => {
			return res.status(200).json({message: "Le parcours a bien été supprimé."});
		})
		.catch(() => {
			return res.status(500).json({message: "Impossible de supprimer le parcours."});
		});
};