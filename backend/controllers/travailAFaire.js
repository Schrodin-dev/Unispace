const db = require('../models/index');

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
		.then(travailAFaire => {
			try{
				//ajout des groupes
				travailAFaire.setGroupes(req.body.groupes)
					.catch(error => {throw error});

				// ajout des documents liés au travail
				for(const document of req.body.documents){
					db.docsTravailARendre.create({
						nomDoc: document.nom,
						lienDoc: document.lienDoc,
						idTravailAFaire: travailAFaire.idTravailAFaire
					})
						.catch(error => {throw error});
				}

				return res.status(201).json({message: "Le travail à faire a bien été ajouté."});
			}catch(error){
				return res.status(500).json(error);
			}
		})
		.catch(error => {return res.status(500).json(error);});
};