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
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour ajouter un travail à faire."});
	}

	// création du travail
	db.travailAFaire.create({
		dateTravailAFaire: req.body.date,
		descTravailAFaire: req.body.description,
		estNote: req.body.estNote,
		nomCours: req.body.cours
	})
		.then(travailAFaire => {
			let listePromesses = [];

			//ajout des groupes
			listePromesses.push(db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
				.then(userGroupe => {
					let listePromessesGroupes = [];

					for (const groupe of req.body.groupes) {
						listePromessesGroupes.push(db.groupe.findOne({
								where: {
									[Op.and]: {
										nomClasse: userGroupe.nomClasse,
										nomGroupe: groupe
									}
								}
							})
								.then(groupe => {
									if (!groupe) {
										throw new Error("Impossible de trouver l'un des groupes.");
									}

									return travailAFaire.addGroupe(groupe.nomGroupe);
								})
						);
					}

					return Promise.all(listePromessesGroupes);
				})
			);

			// ajout des documents liés au travail
			for(const document of req.body.documents){
				listePromesses.push(db.docsTravailARendre.create({
						nomDoc: document.nom,
						lienDoc: document.lienDoc,
						idTravailAFaire: travailAFaire.idTravailAFaire
					})
						.catch(() => {
							throw new Error("Impossible de créer l'un des documents.");
						})
				);
			}

			return Promise.all(listePromesses)
				.then(() => {
					return travailAFaire;
				})
		})
		.then(travailAFaire => {
			return travailAFaire.save();
		})
		.then(() => {
			return res.status(201).json({message: "Le travail à faire de cours a bien été ajouté."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
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
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour supprimer un travail à faire."});
	}


	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(groupe => {
			//vérification du groupe
			return db.travailAFaire.findOne({
				where: {idTravailAFaire: req.body.travailAFaire},
				include: {
					model: db.groupe,
					required:true,
					where: {nomClasse: groupe.nomClasse}
				}
			})
		})
		.then(travailAFaire => {
			if(!travailAFaire){
				throw new Error("Impossible de trouver le travail à faire.");
			}

			return travailAFaire.destroy();
		})
		.then(() => {
			return res.status(201).json({message: "Le travail à faire a bien été supprimé."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
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
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour modifier un travail à faire."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			//récupération du travail à faire
			return db.travailAFaire.findOne({
				where: {idTravailAFaire: req.body.travailAFaire},
				include: {
					model: db.groupe,
					required:true,
					where: {nomClasse: userGroupe.nomClasse}
				}
			})
				.then(travailAFaire => {
					if (!travailAFaire) {
						throw new Error("Impossible de trouver le travail à faire.");
					}

					let promesses = [];

					if (req.body.date !== undefined && req.body.date.length > 0) {
						travailAFaire.dateTravailAFaire = req.body.date;
					}
					if (req.body.description !== undefined && req.body.description.length > 0) {
						travailAFaire.descTravailAFaire = req.body.description;
					}
					if (req.body.estNote !== undefined) {
						travailAFaire.estNote = req.body.estNote;
					}
					if (req.body.cours !== undefined && req.body.cours.length > 0) {
						promesses.push(db.cours.findOne({where: {nomCours: req.body.cours}})
							.then(cours => {
								if(cours){
									travailAFaire.nomCours = cours.nomCours;
								}
							})
						);
					}

					if (req.body.groupes !== undefined && req.body.groupes.length > 0) {
						//modification des groupes
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
							);
						}

						promesses.push(
							Promise.all(promessesGroupes)
								.then(() => {
									travailAFaire.setGroupes(req.body.groupes);
								})
						);
					}

					return Promise.all(promesses)
						.then(() => {
							return travailAFaire;
						})
				})
		})
		.then(travailAFaire => {
			return travailAFaire.save();
		})
		.then(() => {
			return res.status(201).json({message: "Le travail à faire a bien été modifié."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
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
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour ajouter un document à un travail à faire."});
	}

	db.travailAFaire.findOne({where: {idTravailAFaire: req.body.travailAFaire}})
		.then(travailAFaire => {
			return travailAFaire.getGroupes()
				.catch(() => {
					throw new Error("Impossible de récupérer la liste des groupes pour ce travail à faire.");
				})
				.then(groupes => {
					db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
						.then(userGroupe => {
							//vérification des groupes
							let groupeValide = false;
							for(const groupe of groupes){
								if (groupe.nomClasse === userGroupe.nomClasse){
									groupeValide = true;
									break;
								}
							}

							if(!groupeValide){
								throw new Error("Vous ne pouvez pas ajouter de document à ce devoir.");
							}

							return db.docsTravailARendre.create({
								nomDoc: req.body.nom,
								lienDoc: req.body.lienDoc,
								idTravailAFaire: travailAFaire.idTravailAFaire
							})
								.catch(() => {
									throw new Error("Impossible de créer le nouveau document.");
								});
						})
				});
		})
		.then(() => {
			return res.status(201).json({message: "Le document a bien été ajouté au travail à faire."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
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
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour modifier un document à un travail à faire."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			//récupération du document
			return db.docsTravailARendre.findOne({
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
				.catch(() => {
					throw new Error("Impossible de trouver le document à modifier.");
				});
		})
		.then(doc => {
			//application des modifications
			if(!doc){
				throw new Error("Impossible de trouver le document à modifier.");
			}

			if(req.body.nom.length > 0){
				doc.nomDoc = req.body.nom;
			}
			if(req.body.lienDoc.length > 0){
				doc.lienDoc = req.body.lienDoc;
			}

			return doc.save()
				.catch(() => {
					throw new Error("Impossible de modifier le document.");
				});
		})
		.then(() => {
			return res.status(200).json({message: "Le document a bien été modifié."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
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
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour supprimer un document à un travail à faire."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			//récupération du document
			return db.docsTravailARendre.findOne({
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
				.catch(() => {
					throw new Error("Impossible de trouver le document à supprimer.");
				});
		})
		.then(doc => {
			//suppression du document
			if(!doc){
				throw new Error("Impossible de trouver le document à supprimer.");
			}

			return doc.destroy();
		})
		.then(() => {
			return res.status(200).json({message: "Le document a bien été supprimé."});
		})
		.catch(error => {
			return res.status(500).json({message: error.message});
		});
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
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour afficher les travails à faire."});
	}

	//récupération de la date du devoir le plus proche dans le futur à partir de maintenant
	db.travailAFaire.min('dateTravailAFaire', {
		where: {
			dateTravailAFaire: {[Op.gte]: Date.now()}
		}
	})
		.then(min => {
			//récupération des prochains devoirs
			if(!min){
				return {};
			}

			return db.travailAFaire.findAll({
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
		})
		.then(travails => {
			return res.status(200).json(travails);
		})
		.catch(() => {
			return res.status(500).json({message: "Impossible de récupérer les prochains travail à faire."});
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
		return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour afficher les travails à faire."});
	}

	// code from: https://stackoverflow.com/questions/42236837/how-to-perform-a-search-with-conditional-where-parameters-using-sequelize
	// si le nom du cours est précisé, on filtre les travails à faire que l'on retourne
	let whereStatement = {};
	if(req.body.cours !== undefined && req.body.cours.length > 0){
		whereStatement.nomCours = req.body.cours;
	}

	//récupération de la liste des travails à faire
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
			return res.status(500).json({message: "Impossible de charger la liste de travails à faire."});
		});
}