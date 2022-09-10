const db = require('../models/index');

/*
* BUT: ajouter une année universitaire
*
* paramètres: nomAnneeUniv
*
* droits requis: admin
* */
exports.creerAnneeUniv = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json("Vous devez être admin pour créer une année universitaire.");
	}

	db.anneeUniv.create({
		nomAnneeUniv: req.body.nom
	})
		.then(() => {
			return res.status(201).json({message: "L'année universitaire a bien été créée."});
		})
		.catch(error => {return res.status(500).json("Impossible de créer l'année universitaire");});
};

/*
* BUT: supprimer une année universitaire
*
* paramètres: anneeUniv (=nomAnneeUniv)
*
* droits requis: admin
* */
exports.supprimerAnneeUniv = (req, res, next) => {
	if(req.auth.droitsUser !== 'admin'){
		return res.status(500).json("Vous devez être admin pour supprimer une année universitaire.");
	}

	db.anneeUniv.findOne({where: {nomAnneeUniv: req.body.anneeUniv}})
		.then(anneeUniv => {
			if(anneeUniv === null){
				throw new Error("L'année universitaire que vous souhaitez supprimer n'existe pas.");
			}

			return anneeUniv.destroy();
		})
		.then(() => {
			return res.status(200).json({message: "L'année universitaire a bien été supprimée."});
		})
		.catch(error => {return res.status(500).json(error.message)});
};