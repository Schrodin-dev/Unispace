const db = require('../models/index');

/*
* BUT: créer une nouvelle classe
*
* paramètres: nomClasse,anneeUniv (=anneeUniv.nomAnneeUniv), nomParcours (=parcours.nomParcours)
*
* droits requis: admin
* */
exports.creerClasse = (req, res, next) => {
    if(req.auth.droitsUser !== 'admin'){
        return res.status(401).json({message: "Vous devez être admin pour créer une classe."})
    }

    db.classe.create({
        nomAnneeUniv: req.body.anneeUniv,
        nomClasse: req.body.nomClasse,
        nomParcours: req.body.nomParcours
    })
        .then(classe=> {
            if(!classe){
                throw new Error("Impossible de créer la classe.");
            }

            res.status(201).json({message: "La classe a bien été créée."});
        })
        .catch(error => {
            res.status(500).json(error.message);
        });
}

/*
* BUT: supprimer une classe
*
* paramètres: classe (=nomClasse)
*
* droits requis: admin
* */
exports.supprimerClasse = (req, res, next) => {
    if(req.auth.droitsUser !== 'admin'){
        return res.status(401).json({message: "Vous devez être admin pour supprimer une classe."})
    }

    db.classe.findOne({where: {nomClasse: req.body.classe}})
        .then(classe => {
            return classe.destroy();
        })
        .then(() => {
            return res.status(201).json({message: "La classe a bien été supprimée."});
        })
        .catch(error => {
            return res.status(500).json("Impossible de supprimer la classe.");
        })
}