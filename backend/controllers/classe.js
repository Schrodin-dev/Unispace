const db = require('../models/index');

exports.creerClasse = (req, res, next) => {
    if(req.auth.droitsUser !== 'admin'){
        return res.status(401).json({message: "Vous devez être admin pour créer une classe."})
    }

    db.classe.create({
        nomAnneeUniv: req.body.anneeUniv,
        nomClasse: req.body.nomClasse,
        nomParcours: req.body.nomParcours
    })
        .then(() => {
            res.status(201).json({message: "La classe a bien été créée."});
        })
        .catch(error => {
            res.status(500).json(error);
        });
}

exports.supprimerClasse = (req, res, next) => {
    if(req.auth.droitsUser !== 'admin'){
        return res.status(401).json({message: "Vous devez être admin pour supprimer une classe."})
    }

    db.classe.findOne({where: {nomClasse: req.body.classe}})
        .then(classe => {
            classe.destroy()
                .then(() => {
                    return res.status(201).json({message: "La classe a bien été supprimée."});
                })
                .catch(error => {return res.status(500).json(error);});
        })
        .catch(error => {
            return res.status(500).json(error);
        })
}