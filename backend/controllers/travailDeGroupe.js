const db = require('../models/index');
const {Op} = require("sequelize");

exports.creerTravail = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour créer un travail de groupe."});
	}

	db.travailDeGroupe.create({
		nomTravailDeGroupe: req.body.nom,
		membresMin: req.body.min,
		membresMax: req.body.max
	})
		.then(async travailDeGroupe => {
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

								await travailDeGroupe.addGroupe(groupe.nomGroupe)
									.catch(error => {
										throw error;
									})
							})
							.catch(error => {
								throw error;
							});
					}

					return res.status(201).json({message: "Le travail de groupe a bien été créé."});
				})
				.catch(error => {
					throw error;
				});
		})
		.catch(error => {
			return res.status(500).json(error);
		});
};

exports.supprimerTravail = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour supprimer un travail de groupe."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			db.travailDeGroupe.findOne({
				where: {idTravailDeGroupe: req.body.travail},
				include: {
					model: db.groupe,
					where: {
						nomClasse: userGroupe.nomClasse
					}
				}
			})
				.then(travail => {
					if(!travail){
						return res.status(400).json("Impossible de trouver le travail de groupe.");
					}

					travail.destroy()
						.then(() => {
							return res.status(200).json("Le travail de groupe a bien été supprimé.");
						})
						.catch(error => {return res.status(500).json(error);});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
}