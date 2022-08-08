const db = require('../models/index');
const {Op} = require("sequelize");

exports.ajouterTravailAFaire = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour ajouter un travail à faire."});
	}

	// création du travail
	db.travailAFaire.create({
		dateTravailAFaire: req.body.date,
		descTravailAFaire: req.body.description,
		estNote: req.body.estNote,
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
				return res.status(500).json(error);
			}
		})
		.catch(error => {return res.status(500).json(error);});
};

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

					if (req.body.date.length > 0) {
						travailAFaire.dateTravailAFaire = req.body.date;
					}
					if (req.body.description.length > 0) {
						travailAFaire.descTravailAFaire = req.body.description;
					}
					if (req.body.estNote.length > 0) {
						travailAFaire.estNote = req.body.estNote;
					}

					let erreurAjoutGroupe = false;
					if (req.body.groupes.length > 0) {
						travailAFaire.setGroupes([]);
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

										await travailAFaire.addGroupe(groupe.nomGroupe)
											.catch(error => {
												erreurAjoutGroupe = true;
												return res.status(500).json(error);
											})
									})
									.catch(error => {
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
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

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