const db = require('../models/index');
const {Op, literal} = require("sequelize");
const groupeCtrl = require('../controllers/groupe');

/*
* BUT: ajouter un contenu de cours à l'agenda d'un ou de plusieurs groupes de la classe
*
* paramètres: groupes (=groupe.nomGroupe), date (=dateContenuCours), desc (=descContenuCours), cours (=cours.nomCours), docs
*
* droits requis: publicateur, délégué, admin
* */
exports.ajouterContenuCours = async (req, res, next) => {
	if (req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué') {
		return res.status(500).json("Vous n'avez pas les droits suffisants pour ajouter un contenu de cours.");
	}

	db.cours.findOne({where: {nomCours: req.body.cours}})
		.then(cours => {
			if(!cours){
				return res.status(500).json("Impossible de trouver le cours correspondant.");
			}

			return db.contenuCours.create({
				dateContenuCours: req.body.date,
				descContenuCours: req.body.description,
				nomCours: req.body.cours,
			})
				.then(contenuCours => {
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

											return contenuCours.addGroupe(groupe.nomGroupe);
										})
									);
								}

								return Promise.all(listePromessesGroupes);
							})
						);

						// ajout des documents liés au travail
						for(const document of req.body.documents){
							listePromesses.push(db.docsContenuCours.create({
								nomDoc: document.nom,
								lienDoc: document.lienDoc,
								idContenuCours: contenuCours.idContenuCours
							})
								.catch(error => {
									throw new Error("Impossible de créer l'un des documents.");
								})
							);
						}

						return Promise.all(listePromesses)
							.then(() => {
								return contenuCours;
							})
					})
				})
		.then(contenuCours => {
			return contenuCours.save();
		})
		.then(() => {
			return res.status(201).json({message: "Le contenu de cours a bien été ajouté."});
		})
		.catch(error => {return res.status(500).json(error.message);});
};

/*
* BUT: supprimer un contenu de cours de l'agenda, SSI appartient à la classe dont la groupe a l'agenda
*
* paramètres: contenuCours (=contenuCours.idContenuCours)
*
* droits requis: publicateur, délégué, admin
* */
exports.supprimerContenuCours = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(500).json("Vous n'avez pas les droits suffisants pour supprimer un contenu de cours à faire.");
	}


	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(groupe => {
			//récupération du contenu de cours
			return db.contenuCours.findOne({
				where: {idContenuCours: req.body.contenuCours},
				include: {
					model: db.groupe,
					required:true,
					where: {nomClasse: groupe.nomClasse}
				}
			})
		})
		.then(contenuCours => {
			//suppression du contenu de cours
			if(!contenuCours){
				throw new Error("Impossible de trouver le contenu de cours.");
			}

			return contenuCours.destroy();
		})
		.then(() => {
			return res.status(201).json({message: "Le contenu de cours a bien été supprimé."});
		})
		.catch(error => {return res.status(500).json(error.message);});
};

/*
* BUT: modifier un contenu de cours SSI l'utilisateur appartient à la classe dont le groupe possède l'agenda
*
* paramètres: date (=dateContenuCours), description (=descContenuCours), cours (=cours.nomCours), groupes (=groupe.nomGroupe)
*
* droits requis: publicateur, délégué, admin
* */
exports.modifierContenuCours = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(500).json("Vous n'avez pas les droits suffisants pour modifier un contenu de cours.");
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(groupe => {
			//récupération du contenu de cours
			return db.contenuCours.findOne({
				where: {idContenuCours: req.body.contenuCours},
				include: {
					model: db.groupe,
					required:true,
					where: {nomClasse: groupe.nomClasse}
				}
			})
		})
		.then(contenuCours => {
			//modification des différents champs
			if (!contenuCours) {
				throw new Error("Impossible de trouver le contenu de cours.");
			}

			if (req.body.date.length > 0) {
				contenuCours.dateContenuCours = req.body.date;
			}
			if (req.body.description.length > 0) {
				contenuCours.descContenuCours = req.body.description;
			}

			let promessesCours = [];
			if (req.body.cours.length > 0) {
				promessesCours.push(db.cours.findOne({where: {nomCours: req.body.cours}})
					.then(cours => {
						if(cours){
							contenuCours.nomCours = cours.nomCours;
						}
					})
				);
			}

			return Promise.all(promessesCours)
				.then(() => {
					return contenuCours;
				})
		})
		.then(contenuCours => {
			//modification des groupes liés
			let promessesGroupes = [];

			if (req.body.groupes.length > 0) {
				db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
					.then(userGroupe => {
						//vérification de la validité des groupes
						for(const groupe of req.body.groupes){
							promessesGroupes.push(db.groupe.findOne({where: {
									[Op.and]: {
										nomClasse: userGroupe.nomClasse,
										nomGroupe: groupe
									}
								}})
								.catch(error => {
									throw new Error("Impossible de modifier l'un des groupes");
								})
							);
						}
					})
					.then(() => {
						contenuCours.setGroupes(req.body.groupes);
					});
			}

			return Promise.all(promessesGroupes)
				.then(() => {
					return contenuCours;
				})
		})
		.then(contenuCours => {
			return contenuCours.save()
		})
		.then(() => {
			return res.status(201).json({message: "Le contenu de cours a bien été modifié."});
		})
		.catch(error => {return res.status(500).json(error.message);});
};

/*
* BUT: ajouter un document à un contenu de cours
*
* paramètres: nom (=nomDoc), lienDoc, idContenuCours (=contenuCours.idContenuCours)
*
* droits requis: publicateur, délégué, admin
* */
exports.ajouterDocument = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(500).json("Vous n'avez pas les droits suffisants pour ajouter un document à un contenu de cours.");
	}

	db.contenuCours.findOne({where: {idContenuCours: req.body.contenuCours}})
		.then(contenuCours => {
			// récupération des groupes du contenu de cours
			return contenuCours.getGroupes()
				.catch(() => {
					throw new Error("Impossible de récupérer la liste des groupes pour ce contenu de cours.");
				})
				.then(groupes => {
					return db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
						.then(userGroupe => {
							//vérifie si l'utilisateur a le droit d'ajouter un document à ce contenu de cours
							let groupeValide = false;
							for(const groupe of groupes){
								if (groupe.nomClasse === userGroupe.nomClasse){
									groupeValide = true;
									break;
								}
							}

							if(!groupeValide){
								throw new Error("Vous ne pouvez pas ajouter de document à ce contenu de cours.");
							}

							return db.docsContenuCours.create({
								nomDoc: req.body.nom,
								lienDoc: req.body.lienDoc,
								idContenuCours: contenuCours.idContenuCours
							})
								.catch(() => {
									throw new Error("Impossible de créer le nouveau document.");
								});
						});
				});

		})
		.then(() => {
			return res.status(201).json({message: "Le document a bien été ajouté au contenu de cours."});
		})
		.catch(error => {return res.status(500).json(error.message);});
};

/*
* BUT: modifier un document d'un contenu de cours
*
* paramètres: doc (=idDoc), nom (=nomDoc), lienDoc
*
* droits requis: publicateur, délégué, admin
* */
exports.modifierDocument = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(500).json("Vous n'avez pas les droits suffisants pour modifier un document d'un contenu de cours.");
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			//récupérer le document
			return db.docsContenuCours.findOne({
				include: {
					model: db.contenuCours,
					required: true,
					include: {
						model: db.groupe,
						required: true,
						where: {nomclasse: userGroupe.nomClasse}
					}
				},
				where: {idDoc: req.body.doc}
			})
				.catch(() => { throw new Error("Impossible de trouver le document à modifier.");});
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

			return doc.save();
		})
		.then(() => {
			return res.status(200).json({message: "Le document a bien été modifié."});
		})
		.catch(error => {return res.status(500).json(error.message);});
};

/*
* BUT: supprimer un document lié à un contenu de cours
*
* paramètres: doc (=idDoc)
*
* droits requis: publicateur, délégué, admin
* */
exports.supprimerDocument = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(500).json("Vous n'avez pas les droits suffisants pour supprimer un document d'un contenu de cours.");
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			//récupération du document
			return db.docsContenuCours.findOne({
				include: {
					model: db.contenuCours,
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
					throw new Error("Impossible de trouver le document.");
				})
		})
		.then(doc => {
			//suppresion du document
			if(!doc){
				throw new Error("Impossible de trouver le document.");
			}

			return doc.destroy();
		})
		.then(() => {
			return res.status(201).json({message: "Le document a bien été supprimé."});
		})
		.catch(error => {return res.status(500).json(error.message);});
};

/*
* BUT: afficher la liste des contenus de cours pour son groupe
*
* paramètres: cours (=cours.nomCours)
*
* droits requis: élève, publicateur, délégué, admin
* */
exports.afficher = (req, res, next) => {
	if (req.auth.droitsUser === 'non validé') {
		return res.status(500).json("Vous n'avez pas les droits suffisants pour afficher les contenus de cours.");
	}

	// code from: https://stackoverflow.com/questions/42236837/how-to-perform-a-search-with-conditional-where-parameters-using-sequelize
	let whereStatement = {};
	if(req.body.cours !== undefined && req.body.cours.length > 0){
		whereStatement.nomCours = req.body.cours;
	}


	db.contenuCours.findAll({
		include: [
			{
				model: db.groupe,
				required: true,
				attributes: ['nomGroupe']
			},
			{
				model: db.cours,
				required: true,
				attributes: ['couleurCours'],
				where: whereStatement
			},
			{
				model: db.docsContenuCours
			}
		],
		where: {
			[Op.and]: [
				{dateContenuCours: {[Op.gte]: req.body.dateMin}},
				{ idContenuCours: {[Op.in]: literal("(SELECT DISTINCT idContenuCours FROM aFait WHERE nomGroupe = '" + req.auth.userGroupe + "')")}}
			]
		},
		limit: 10,
		offset: req.body.pagination * 10,
		order: ['dateContenuCours']
	})
		.then(contenu => {
			if(!contenu){
				throw new Error("Impossible de charger la liste des contenus de cours.");
			}

			return res.status(200).json(contenu);
		})
		.catch(error => {
			return res.status(500).json("Impossible de charger la liste des contenus de cours.");
		});
}