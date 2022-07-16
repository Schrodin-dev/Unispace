const db = require('../models/index');

exports.ajouterUE = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(401).json({message: "Vous devez être admin pour créer une UE."});
	}

	db.UE.create({
		nomUE: req.body.nom
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

exports.ajouterRessource = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour ajouter une ressource"});
	}

	db.ressource.create({
		nomRessource: req.body.nom,
		coeffRessource: req.body.coeff,
		nomAnneeUniv: req.body.anneeUniv,
		idUE: req.body.UE
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
		.then(() => {
			return res.status(201).json({message: "Le devoir a bien été créé."});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.supprimerDevoir = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué' && req.auth.droitsUser !== 'publicateur'){
		return res.status(401).json({message: "Vous n'avez pas les droits suffisants pour supprimer un devoir."});
	}

	db.devoir.findOne({where: {idDevoir: req.body.devoir}})
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
};

exports.ajouterNote = (req, res, next) => {
	db.note.create({
		emailUser: req.auth.userEmail,
		idDevoir: req.body.devoir,
		noteDevoir: req.body.note
	})
		.then(() => {
			return res.status(201).json({message: "La note a bien été ajoutée."});
		})
		.catch(error => {return res.status(500).json(error);});
};

exports.modifierNote = (req, res, next) => {
	db.note.findOne({where: {
		emailUser: req.auth.userEmail,
		idDevoir: req.body.devoir
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
			emailUser: req.auth.userEmail,
			idDevoir: req.body.devoir
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
			required: true,
			include: {
				model: db.devoir,
				required: true,
				include: {
					model: db.note,
					where: {emailUser: req.auth.userEmail},
					attributes: ['noteDevoir']
				},
				attributes: ['nomDevoir', 'coeffDevoir', 'noteMaxDevoir']
			},
			attributes: ['nomRessource', 'coeffRessource']
		},
		attributes : ['nomUE']
	})
		.then(detail => {
			if(detail === null){
				return res.status(400).json({message: "Aucune note trouvée."});
			}

			return res.status(201).json(detail);
		})
		.catch(error => {return res.status(500).json(error);});
};