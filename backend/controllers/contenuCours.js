const db = require('../models/index');
const {Op} = require("sequelize");
const groupeCtrl = require('../controllers/groupe');

exports.ajouterContenuCours = async (req, res, next) => {
	if (req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué') {
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour ajouter un contenu de cours."});
	}

	db.cours.findOne({where: {nomCours: req.body.cours}})
		.then(cours => {
			if(!cours){
				return res.status(400).json({message: "Impossible de trouver le cours correspondant."});
			}

			db.contenuCours.create({
				dateContenuCours: req.body.date,
				descContenuCours: req.body.description,
				nomCours: req.body.cours,
			})
				.then(async contenuCours => {
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

											await contenuCours.addGroupe(groupe.nomGroupe)
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
							db.docsContenuCours.create({
								nomDoc: document.nom,
								lienDoc: document.lienDoc,
								idContenuCours: contenuCours.idContenuCours
							})
								.catch(error => {
									throw error
								});
						}

						return res.status(201).json({message: "Le contenu de cours a bien été ajouté."});
					} catch (error) {
						return res.status(500).json(error);
					}
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.supprimerContenuCours = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour supprimer un contenu de cours à faire."});
	}


	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(groupe => {
			db.contenuCours.findOne({
				where: {idContenuCours: req.body.contenuCours},
				include: {
					model: db.groupe,
					required:true,
					where: {nomClasse: groupe.nomClasse}
				}
			})
				.then(contenuCours => {
					if(!contenuCours){
						return res.status(400).json({message: "Impossible de trouver le contenu de cours."});
					}

					contenuCours.destroy()
						.then(() => {
							return res.status(201).json({message: "Le contenu de cours a bien été supprimé."});
						})
						.catch(error => {return res.status(500).json(error);});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.modifierContenuCours = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour modifier un contenu de cours."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(groupe => {
			db.contenuCours.findOne({
				where: {idContenuCours: req.body.contenuCours},
				include: {
					model: db.groupe,
					required:true,
					where: {nomClasse: groupe.nomClasse}
				}
			})
				.then(async contenuCours => {
					if (!contenuCours) {
						return res.status(400).json({message: "Impossible de trouver le contenu de cours."});
					}

					if (req.body.date.length > 0) {
						contenuCours.dateContenuCours = req.body.date;
					}
					if (req.body.description.length > 0) {
						contenuCours.descContenuCours = req.body.description;
					}
					if (req.body.cours.length > 0) {
						await db.cours.findOne({where: {nomCours: req.body.cours}})
							.then(cours => {
								if(cours){
									contenuCours.nomCours = cours.nomCours;
								}
							})
					}

					let erreurAjoutGroupe = false;
					if (req.body.groupes.length > 0) {
						contenuCours.setGroupes([]);
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
												erreurAjoutGroupe = true;
												return res.status(401).json({message: "Impossible de trouver l'un des groupes."});
											}

											await contenuCours.addGroupe(groupe.nomGroupe)
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
							})
							.catch(error => {
								erreurAjoutGroupe = true;
								return res.status(500).json(error);
							});
					}

					if(!erreurAjoutGroupe) contenuCours.save()
						.then(() => {
							return res.status(201).json({message: "Le contenu de cours a bien été modifié."});
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
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour ajouter un document à un contenu de cours."});
	}

	db.contenuCours.findOne({where: {idContenuCours: req.body.contenuCours}})
		.then(contenuCours => {
			contenuCours.getGroupes()
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
								return res.status(401).json({message: "Vous ne pouvez pas ajouter de document à ce contenu de cours."});
							}

							db.docsContenuCours.create({
								nomDoc: req.body.nom,
								lienDoc: req.body.lienDoc,
								idContenuCours: contenuCours.idContenuCours
							})
								.then(doc => {
									doc.save()
										.then(() => {
											return res.status(201).json({message: "Le document a bien été ajouté au contenu de cours."});
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
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour supprimer un document d'un contenu de cours."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			db.docsContenuCours.findOne({
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