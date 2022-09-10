const db = require('../models/index');
const {Op, literal} = require("sequelize");

/*
* BUT: ajouter à l'agenda d'un ou plusieurs groupes d'une classe un nouveau travail à faire (comme un devoir)
*
* paramètres: date (=dateTravailAFaire), description (=descTravailAFaire), estNote, cours (=cours.nomCours), groupes (=groupe.nomGroupe), documents (liste des documents)
*
* droits requis: publicateur, délégué, admin
* */
exports.ajouterTravailAFaire = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour ajouter un travail à faire."});
	}

	// création du travail
	db.travailAFaire.create({
		dateTravailAFaire: req.body.date,
		descTravailAFaire: req.body.description,
		estNote: req.body.estNote,
		nomCours: req.body.cours
	})
		.then(async travailAFaire => {
			try {
				//ajout des groupes
				await db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
					.then(async userGroupe => {
						for (const groupe of req.body.groupes) {
							await db.groupe.findOne({
								where: {
									[Op.and]: {
										nomClasse: userGroupe.nomClasse,
										nomGroupe: groupe
									}
								}
							})
								.then(async groupe => {
									if (!groupe) {
										throw {message: "Impossible de trouver l'un des groupes."};
									}

									await travailAFaire.addGroupe(groupe.nomGroupe)
										.catch(error => {
											throw error;
										})
								})
								.catch(error => {
									throw error;
								});
						}
					})
					.catch(error => {
						throw error;
					});

				// ajout des documents liés au travail
				for (const document of req.body.documents) {
					db.docsTravailARendre.create({
						nomDoc: document.nom,
						lienDoc: document.lienDoc,
						idTravailAFaire: travailAFaire.idTravailAFaire
					})
						.catch(error => {
							throw error
						});
				}

				return res.status(201).json({message: "Le travail à faire a bien été ajouté."});
			} catch (error) {
				return res.status(500).json({messsage: error});
			}
		})
		.catch(error => {return res.status(500).json(error);});
};

/*
* BUT: supprimer un travail à faire (devoir) pour un groupe de la classe de l'utilisateur
*
* paramètres: travailAFaire (=idTravailAFaire)
*
* droits requis: publicateur, délégué, admin
* */
exports.supprimerTravailAFaire = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour supprimer un travail à faire."});
	}


	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(groupe => {
			db.travailAFaire.findOne({
				where: {idTravailAFaire: req.body.travailAFaire},
				include: {
					model: db.groupe,
					required:true,
					where: {nomClasse: groupe.nomClasse}
				}
			})
				.then(travailAFaire => {
					if(!travailAFaire){
						return res.status(400).json({message: "Impossible de trouver le travail à faire."});
					}

					travailAFaire.destroy()
						.then(() => {
							return res.status(201).json({message: "Le travail à faire a bien été supprimé."});
						})
						.catch(error => {return res.status(500).json(error);});
				})
				.catch(error => {return res.status(500).json(error);});
	})
	.catch(error => {return res.status(500).json(error);});
};

/*
* BUT: modifier un travail à faire (devoir) pour un ou plusieurs groupe.s de la classe de l'utilisateur
*
* paramètres: travailAFaire (=idTravailAFaire), date (=dateTravailAFaire), description (=descTravailAFaire), estNote, cours (=cours.nomCours), groupes (=groupe.nomGroupe)
*
* droits requis: publicateur, délégué, admin
* */
exports.modifierTravailAFaire = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour modifier un travail à faire."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			db.travailAFaire.findOne({
				where: {idTravailAFaire: req.body.travailAFaire},
				include: {
					model: db.groupe,
					required:true,
					where: {nomClasse: userGroupe.nomClasse}
				}
			})
				.then(async travailAFaire => {
					if (!travailAFaire) {
						return res.status(400).json({message: "Impossible de trouver le travail à faire."});
					}

					if (req.body.date !== undefined && req.body.date.length > 0) {
						travailAFaire.dateTravailAFaire = req.body.date;
					}
					if (req.body.description !== undefined && req.body.description.length > 0) {
						travailAFaire.descTravailAFaire = req.body.description;
					}
					if (req.body.estNote !== undefined && req.body.estNote.length > 0) {
						travailAFaire.estNote = req.body.estNote;
					}
					if (req.body.cours !== undefined && req.body.cours.length > 0) {
						await db.cours.findOne({where: {nomCours: req.body.cours}})
							.then(cours => {
								if(cours){
									travailAFaire.nomCours = cours.nomCours;
								}
							})
					}

					let erreurAjoutGroupe = false;
					if (req.body.groupes !== undefined && req.body.groupes.length > 0) {
							for(const groupe of req.body.groupes){
								await db.groupe.findOne({where: {
									[Op.and]: {
										nomClasse: userGroupe.nomClasse,
										nomGroupe: groupe
									}
								}})
									.then(async groupe => {
										if(!groupe){
											erreurAjoutGroupe = true;
											return res.status(401).json({message: "Impossible de trouver l'un des groupes."});
										}

									})
									.then(() => {
										travailAFaire.setGroupes(req.body.groupes)
									})
									.catch(error => {
										console.error(error);
										erreurAjoutGroupe = true;
										return res.status(500).json(error);
									});
							}
					}

					if(!erreurAjoutGroupe) travailAFaire.save()
						.then(() => {
							return res.status(201).json({message: "Le travail à faire a bien été modifié."});
						})
						.catch(error => {
							return res.status(500).json(error);
						});
				})
				.catch(error => {console.error(error);return res.status(500).json(error);});
		})
		.catch(error => {console.error(error);return res.status(500).json(error);});
};

/*
* BUT: ajouter un document à un travail à faire (devoir) --> le document est un lien vers un autre site
*
* paramètres: travailAFaire (=travailAFaire.idTravailAFaire), nom (=nomDoc), lienDoc
*
* droits requis: publicateur, délégué, admin
* */
exports.ajouterDocument = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour ajouter un document à un travail à faire."});
	}

	db.travailAFaire.findOne({where: {idTravailAFaire: req.body.travailAFaire}})
		.then(travailAFaire => {
			travailAFaire.getGroupes()
				.then(groupes => {
					db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
						.then(userGroupe => {
							let groupeValide = false;
							for(const groupe of groupes){
								if (groupe.nomClasse === userGroupe.nomClasse){
									groupeValide = true;
									break;
								}
							}

							if(!groupeValide){
								return res.status(401).json({message: "Vous ne pouvez pas ajouter de document à ce devoir."});
							}

							db.docsTravailARendre.create({
								nomDoc: req.body.nom,
								lienDoc: req.body.lienDoc,
								idTravailAFaire: travailAFaire.idTravailAFaire
							})
								.then(doc => {
									doc.save()
										.then(() => {
											return res.status(201).json({message: "Le document a bien été ajouté au travail à faire."});
										})
										.catch(error => {return res.status(500).json(error);});
								})
								.catch(error => {return res.status(500).json(error);});
						})
						.catch(error => {return res.status(500).json(error);});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

/*
* BUT: modifier un document d'un travail à faire (devoir)
*
* paramètres: doc (=docTravailARendre.idDoc), nom (=nomDoc), lienDoc
*
* droits requis: publicateur, délégué, admin
* */
exports.modifierDocument = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour modifier un document à un travail à faire."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			db.docsTravailARendre.findOne({
				include: {
					model: db.travailAFaire,
					required: true,
					include: {
						model: db.groupe,
						required: true,
						where: {nomclasse: userGroupe.nomClasse}
					}
				},
				where: {idDoc: req.body.doc}
			})
				.then(doc => {
					if(req.body.nom.length > 0){
						doc.nomDoc = req.body.nom;
					}
					if(req.body.lienDoc.length > 0){
						doc.lienDoc = req.body.lienDoc;
					}

					doc.save()
						.then(() => {
							return res.status(201).json({message: "Le document a bien été modifié."});
						})
						.catch(error => {return res.status(500).json(error);});
				})
				.catch(error => {return res.status(401).json({message: "Impossible de trouver le document à modifier."});});
		})
		.catch(error => {return res.status(500).json(error);});
};

/*
* BUT: supprimer un document d'un travail à faire (devoir)
*
* paramètres: doc (docTravailARendre.idDoc)
*
* droits requis: publicateur, délégué, admin
* */
exports.supprimerDocument = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour supprimer un document à un travail à faire."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			db.docsTravailARendre.findOne({
				include: {
					model: db.travailAFaire,
					required: true,
					include: {
						model: db.groupe,
						required: true,
						where: {nomclasse: userGroupe.nomClasse}
					}
				},
				where: {idDoc: req.body.doc}
			})
				.then(doc => {
					doc.destroy()
						.then(() => {
							return res.status(201).json({message: "Le document a bien été supprimé."});
						})
						.catch(error => {return res.status(500).json(error);});
				})
				.catch(error => {return res.status(401).json({message: "Impossible de trouver le document à supprimer."});});
		})
		.catch(error => {return res.status(500).json(error);});
};

/*
* BUT: afficher un cours aperçu des prochains travails à faire (jusqu'à 3)
*
* paramètres: AUCUN
*
* droits requis: élève, publicateur, délégué, admin
* */
exports.recupererEmbed = (req, res, next) => {
	if (req.auth.droitsUser === 'non validé') {
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour afficher les travails à faire."});
	}

	db.travailAFaire.min('dateTravailAFaire', {
		where: {
			dateTravailAFaire: {[Op.gte]: Date.now()}
		}
	})
		.then(min => {
			if(!min){
				return res.status(200).json({});
			}

			db.travailAFaire.findAll({
				include: [
					{
						model: db.groupe,
						required: true,
						where: {nomGroupe: req.auth.userGroupe},
						attributes: []
					},
					{
						model: db.cours,
						required: true,
						attributes: ['couleurCours']
					}
				],
				where: {
					dateTravailAFaire: min
				},
				limit: 3,
				order: ['dateTravailAFaire']
			})
				.then(travails => {
					return res.status(200).json(travails);
				})
				.catch(error => {
					return res.status(500).json(error);
				});
		})
		.catch(error => {
			return res.status(500).json(error);
		});
};

/*
* BUT: afficher une page des travails à faire suivant une matière donnée, une date minimale de rendu et un numéro de page donnée. Retourne jusqu'à 10 travail à faire.
*
* paramètres: cours (=cours.nomCours), dateMin (=dateTravailAFaire), pagination (numéro de la page à afficher)
*
* droits requis: élève, publicateur, délégué, admin
* */
exports.afficher = (req, res, next) => {
	if (req.auth.droitsUser === 'non validé') {
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour afficher les travails à faire."});
	}

	// code from: https://stackoverflow.com/questions/42236837/how-to-perform-a-search-with-conditional-where-parameters-using-sequelize
	let whereStatement = {};
	if(req.body.cours !== undefined && req.body.cours.length > 0){
		whereStatement.nomCours = req.body.cours;
	}


	db.travailAFaire.findAll({
		include: [
			{
				model: db.groupe,
				required: true,
				/*where: {nomGroupe: req.auth.userGroupe},*/
				attributes: ['nomGroupe']
			},
			{
				model: db.cours,
				required: true,
				attributes: ['couleurCours'],
				where: whereStatement
			},
			{
				model: db.docsTravailARendre
			}
		],
		where: {
			[Op.and]: [
				{dateTravailAFaire: {[Op.gte]: req.body.dateMin}},
				{ idTravailAFaire: {[Op.in]: literal("(SELECT DISTINCT idTravailAFaire FROM doitFaire WHERE nomGroupe = '" + req.auth.userGroupe + "')")}}
			]
		},
		limit: 10,
		offset: req.body.pagination * 10,
		order: ['dateTravailAFaire']
	})
		.then(travails => {
			return res.status(200).json(travails);
		})
		.catch(error => {
			return res.status(500).json({messsage: error});
		});
}