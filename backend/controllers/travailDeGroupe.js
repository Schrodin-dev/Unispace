const db = require('../models/index');
const {Op} = require("sequelize");
const crypto = require('crypto');
const randomUUID = crypto.randomUUID;

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
					required:true,
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
};

exports.modifierTravail = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'publicateur' && req.auth.droitsUser !== 'délégué'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour modifier un travail de groupe."});
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			db.travailDeGroupe.findOne({
				where: {idTravailDeGroupe: req.body.travail},
				include: {
					model: db.groupe,
					required:true,
					where: {nomClasse: userGroupe.nomClasse}
				}
			})
				.then(async travailDeGroupe => {
					if (!travailDeGroupe) {
						return res.status(400).json({message: "Impossible de trouver le travail de groupe."});
					}

					if (req.body.nom.length > 0) {
						travailDeGroupe.nomTravailDeGroupe = req.body.nom;
					}
					if (String.valueOf(req.body.min).length > 0) {
						travailDeGroupe.membresMin = req.body.min;
					}
					if (String.valueOf(req.body.max).length > 0) {
						travailDeGroupe.membresMax = req.body.max;
					}

					let erreurAjoutGroupe = false;
					if (req.body.groupes.length > 0) {
						travailDeGroupe.setGroupes([]);
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

										await travailDeGroupe.addGroupe(groupe.nomGroupe)
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

					if(!erreurAjoutGroupe) travailDeGroupe.save()
						.then(() => {
							return res.status(201).json({message: "Le travail de groupe a bien été modifié."});
						})
						.catch(error => {
							return res.status(500).json(error);
						});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
}

exports.creerGroupe = (req, res, next) => {
	if(req.auth.droitsUser === 'non validé'){
		return res.status(401).json("Vous n'avez pas les droits nécessaires pour créer un groupe de travail.");
	}

		db.travailDeGroupe.findOne({
			where: {idTravailDeGroupe: req.body.travail},
			include: {
				model: db.groupe,
				required:true,
				where: {nomGroupe: req.auth.userGroupe}
			}
		})
			.then(travail => {
				if(!travail){
					return res.status(500).json({message: "Impossible de trouver le travail de groupe."});
				}

				db.groupeDeTravail.findOne({where: {
						idTravailDeGroupe: travail.idTravailDeGroupe
					},
					include: {
						model: db.travailler,
						required: true,
						where: {
							userEmailUser: req.auth.userEmail
						}
					}})
					.then(ancienGroupe => {
						if(ancienGroupe && ancienGroupe.travaillers[0].UUIDInvitation === null){
							return res.status(400).json({message: "Vous devez quitter votre groupe actuel avant d'en créer un nouveau."});
						}

						db.groupeDeTravail.create({
							idTravailDeGroupe: travail.idTravailDeGroupe
						})
							.then(groupe => {
								db.travailler.create({
									groupeDeTravailIdGroupeDeTravail: groupe.idGroupeDeTravail,
									userEmailUser: req.auth.userEmail
								})
									.then(() => {
										return res.status(200).json({message: "Le groupe de travail a bien été créé."});
									})
									.catch(error => {return res.status(500).json(error);});
							})
					})
					.catch(error => {return res.status(500).json(error);});
			})
			.catch(error => {return res.status(500).json(error);});
}

exports.inviterGroupe = (req, res, next) => {
	if(req.auth.droitsUser === 'non validé'){
		return res.status(401).json("Vous n'avez pas les droits nécessaires pour inviter quelqu'un dans un groupe de travail.");
	}

	//vérifier que l'utilisateur fait partie du groupe
	db.travailler.findOne({
		where: {
			groupeDeTravailIdGroupeDeTravail: req.body.groupe,
			userEmailUser: req.auth.userEmail
		}
	})
		.then(travaillerUser => {
			if(!travaillerUser || travaillerUser.UUIDInvitation !== null){
				return res.status(401).json({message: "Vous ne pouvez pas inviter quelqu'un à un groupe dont vous n'êtes pas membre."});
			}

			//vérifier que l'utilisateur cible n'est pas déjà dans le groupe
			db.travailler.findOne({where: {
					groupeDeTravailIdGroupeDeTravail: req.body.groupe,
					userEmailUser: req.body.user
				}})
				.then(travailler => {
					if(travailler){
						return res.status(401).json({message: "l'utilisateur est déjà dans le groupe."});
					}

					const UUID = randomUUID();

					db.travailler.create({
						userEmailUser: req.body.user,
						groupeDeTravailIdGroupeDeTravail: req.body.groupe,
						UUIDInvitation: UUID
					})
						.then(() => {
							require('../mailsender').envoyerMailPersonne(req.body.user, 'Invitation à un groupe de travail', '<p>Vous avez reçu une nouvelle invitation pour un groupe. Pour le rejoindre, cliquez sur ce lien (ou copiez-le dans votre navigateur) : <a href="' + require('../config/appli.json').lienInvitationGroupe + UUID + '">' + require('../config/appli.json').lienInvitationGroupe + UUID + '</a></p>');
						})
						.then(() => {
							return res.status(200).json({message: "Une invitation a été envoyée à l'utilisateur."});
						})
						.catch(error => {return res.status(500).json(error);});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
}

exports.accepterInvitationGroupe = (req, res, next) => {
	if(req.auth.droitsUser === 'non validé'){
		return res.status(401).json("Vous n'avez pas les droits nécessaires pour rejoindre un groupe de travail.");
	}

	db.travailler.findOne({
		where: {
			userEmailUser: req.auth.userEmail,
			UUIDInvitation: req.body.uuid
		},
		include:{
			model: db.groupeDeTravail,
			required: true
		}
	})
		.then(travailler => {
			if(!travailler){
				return res.status(400).json({message: "Impossible de trouver l'invitation correspondante."});
			}

			db.travailler.count({where: {
				[Op.and]: [
					{groupeDeTravailIdGroupeDeTravail: travailler.groupeDeTravailIdGroupeDeTravail},
					{UUIDInvitation: null}
				]
			}})
				.then(nbPersonnesGroupe => {
					if(nbPersonnesGroupe >= travailler.groupeDeTravail.membresMax){
						return res.status(400).json({message: "Le groupe est déjà plein."});
					}

					travailler.UUIDInvitation = null;
					travailler.save()
						.then(() => {
							return res.status(200).json({message: "Vous avez rejoint le groupe."});
						})
						.catch(error => {return res.status(500).json(error);});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
}

exports.refuserInvitationGroupe = (req, res, next) => {
	if(req.auth.droitsUser === 'non validé'){
		return res.status(401).json("Vous n'avez pas les droits nécessaires pour refuser une invitation à un groupe de travail.");
	}

	db.travailler.findOne({
		where: {
			userEmailUser: req.auth.userEmail,
			UUIDInvitation: req.body.uuid
		},
		include:{
			model: db.groupeDeTravail,
			required: true
		}
	})
		.then(travailler => {
			if(!travailler){
				return res.status(400).json({message: "Impossible de trouver l'invitation correspondante."});
			}

			travailler.destroy()
				.then(() => {
					return res.status(200).json({message: "Vous avez bien refusé l'invitation."});
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
}

exports.quitterGroupe = (req, res, next) => {
	if(req.auth.droitsUser === 'non validé'){
		return res.status(401).json("Vous n'avez pas les droits nécessaires pour quitter un groupe de travail.");
	}

	db.travailler.findOne({
		where: {
			userEmailUser: req.auth.userEmail,
		},
		include:{
			model: db.groupeDeTravail,
			required: true,
			where: {
				idGroupeDeTravail: req.body.groupe
			}
		}
	})
		.then(travailler => {
			if(!travailler){
				return res.status(400).json({message: "Impossible de trouver le groupe correspondant."});
			}

			db.travailler.count({where: {
					[Op.and]: [
						{groupeDeTravailIdGroupeDeTravail: travailler.groupeDeTravailIdGroupeDeTravail},
						{UUIDInvitation: null}
					]
				}})
				.then(nbPersonnesGroupe => {
					if(nbPersonnesGroupe === 1){
						travailler.groupeDeTravail.destroy()
							.then(() => {
								return res.status(200).json({message: "Vous avez bien quitté le groupe."});
							})
							.catch(error => {return res.status(500).json(error);});
					}else{
						travailler.destroy()
							.then(() => {
								return res.status(200).json({message: "Vous avez bien quitté le groupe."});
							})
							.catch(error => {return res.status(500).json(error);});
					}
				})
				.catch(error => {return res.status(500).json(error);});
		})
		.catch(error => {return res.status(500).json(error);});
}

exports.recupererGroupes = (req, res, next) => {
	//affiche les groupes (avec leur ID) + les groupes auxquels l'utilisateur est invité, avec son UUID
	if(req.auth.droitsUser === 'non validé'){
		return res.status(401).json("Vous n'avez pas les droits nécessaires pour afficher ce travail de groupe.");
	}

	db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
		.then(userGroupe => {
			db.travailDeGroupe.findOne({
				where: {idTravailDeGroupe: req.body.travail},
				include: [
					{
						model: db.groupeDeTravail,
						include: {
							model: db.travailler,
							include: {
								model: db.user,
								required: true,
								attributes: ["nomUser", "prenomUser"]
							}
						}
					},
					{
						model: db.groupe,
						where: {
							nomClasse: userGroupe.nomClasse
						},
						required: true,
						attributes: []
					}
				]
			})
				.then(groupes => {
					if(!groupes){
						return res.status(400).json({message: "Impossible de trouver le travail de groupe."});
					}

					return res.status(200).json(groupesParser(groupes));
				})
				.catch(error => {
					return res.status(500).json(error);
				});
		})
}

function groupesParser(travail){
	let parsed = {};

	//infos du travail
	parsed.nom = travail.nomTravailDeGroupe;
	parsed.membresMin = travail.membresMin;
	parsed.membresMax = travail.membresMax;
	parsed.groupes = [];

	//infos de chaque groupe
	for(const groupeIndex in travail.groupeDeTravails){
		const groupe = travail.groupeDeTravails[groupeIndex];

		parsed.groupes[groupeIndex] = {
			id: groupe.idGroupeDeTravail,
			membres: []
		};

		//info des membres du groupe
		for(const membreIndex in groupe.travaillers){
			const membre = groupe.travaillers[membreIndex];

			parsed.groupes[groupeIndex].membres[membreIndex] = {
				nom: membre.user.nomUser,
				prenom: membre.user.prenomUser,
				UUIDInvitation: membre.UUIDInvitation
			}
		}
	}

	return parsed;
}