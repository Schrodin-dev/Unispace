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
		return res.status(401).json({message: "Vous devez être admin pour créer une année universitaire."});
	}

	db.anneeUniv.create({
		nomAnneeUniv: req.body.nom
	})
		.then(() => {
			return res.status(201).json({message: "L'année universitaire a bien été créée."});
		})
		.catch(error => {return res.status(500).json(error);});
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
		return res.status(401).json({message: "Vous devez être admin pour supprimer une année universitaire."});
	}

	db.anneeUniv.findOne({where: {nomAnneeUniv: req.body.anneeUniv}})
		.then(anneeUniv => {
			if(anneeUniv === null){
				return res.status(400).json({message: "L'année universitaire que vous souhaitez supprimer n'existe pas."});
			}

			anneeUniv.destroy()
				.then(() => {
					return res.status(201).json({message: "L'année universitaire a bien été supprimée."});
				})
				.catch(error => {return res.status(500).json(erorr);});
		})
		.catch(error => {return res.status(500).json(error)});
};