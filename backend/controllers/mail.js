const db = require('../models/index');
const { Op } = require("sequelize");

exports.annonce = async (req, res, next) => {

    if(req.body.destinataires === undefined){
        return res.status(400).json({message: 'Veuillez préciser un destinataire.'});
    }

    if (req.body.destinataires === 'promo') {
        //annonce à toute la promo
        if(req.auth.droitsUser !== 'admin'){
            return res.status(401).json({message: 'Vous n\'avez pas les droits suffisants.'});
        }

        db.user.findAll({
            where: {accepteRecevoirAnnonces: true},
            attributes: ['emailUser']
        })
            .then(users => {
                envoyerMails(users, req, res);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    }else if(await db.anneeUniv.findOne({where: {nomAnneeUniv: req.body.destinataires}}) !== null){
        // annonce à une promo (année univ)
        if(req.auth.droitsUser !== 'admin'){
            return res.status(401).json({message: 'Vous n\'avez pas les droits suffisants.'});
        }

        db.user.findAll({
            include: {
                model: db.groupe,
                required: true,
                include: {
                    model: db.classe,
                    required: true,
                    where: {nomAnneeUniv: req.body.destinataires}
                }
            },
            where: {accepteRecevoirAnnonces: true},
            attributes: ['emailUser'],
        })
            .then(users => {
                envoyerMails(users, req, res);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    }else if(await db.groupe.findOne({where: {nomGroupe: req.body.destinataires}}) !== null) {
        // annonce à un groupe
        if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué'){
            return res.status(401).json({message: 'Vous n\'avez pas les droits suffisants.'});
        }

        let err = false
        if (req.auth.droitsUser === 'délégué') {
            await db.groupe.findOne({where: {nomGroupe: req.body.destinataires}}).then(async dest => {
                await db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}}).then(sender => {
                    if (dest.nomClasse !== sender.nomClasse) {
                        err = true;
                    }
                }).catch(error => {
                    res.status(500).json(error);
                });
            }).catch(error => {
                res.status(500).json(error);
            });
        }

        if(err){
            return res.status(401).json({message: 'Vous n\'êtes pas délégué de cette classe.'});
        }

        db.user.findAll({
            attributes: ['emailUser'],
            where: {[Op.and]: [
            {nomGroupe: req.body.destinataires},
            {accepteRecevoirAnnonces: true}
        ]}
        })
            .then(users => {
                envoyerMails(users, req, res);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    }else if(await db.classe.findOne({where: {nomClasse: req.body.destinataires}}) !== null){
        // annonce à une classe
        if(req.auth.droitsUser !== 'admin' && req.auth.droitsUser !== 'délégué'){
            return res.status(401).json({message: 'Vous n\'avez pas les droits suffisants.'});
        }

        let err = false;
        if(req.auth.droitsUser === 'délégué') {
            await db.groupe.findOne({where: {[Op.and]: [{nomClasse: req.body.destinataires}, {nomGroupe: req.auth.userGroupe}]}}).then(rep => {
                if(rep === null) err = true;
            }).catch(error => {
                res.status(500).json(error);
            });
        }

        if(err){
            return res.status(401).json({message: "Vous n'êtes pas délégué de cette classe."});
        }

        db.user.findAll({
            include: {
                model: db.groupe,
                required: true,
                where: {nomClasse: req.body.destinataires},
                attributes: []
            },
            where: {accepteRecevoirAnnonces: true},
            attributes: ['emailUser']
        })
            .then(users => {
                envoyerMails(users, req, res);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    }else{
        return res.status(400).json({message: 'impossible de trouver le destinataire.'})
    }


};

function envoyerMails(destinataires, req, res){
    let emails = [];
    let i = 0;

    for(const destinataire of destinataires){
        if(destinataire.emailUser !== undefined){
            emails[i] = destinataire.emailUser;
            i++;
        }
    }

    if(emails.length === 0){
        return res.status(400).json({message: 'Impossible d\'envoyer l\'annonce, aucun destinataire trouvé.'});
    }

    try{
        require('../mailsender').envoyerMailGroupe(emails, req.body.subject, '<p>' + req.body.contenu + '</p>');
    }catch(error){
        return res.status(500).json({error});
    }


    res.status(201).json({message: 'Votre annonce a bien été envoyée'});
}

exports.listeDestinataires = (req, res, next) => {
    let destinataires = [];

    switch(req.auth.droitsUser){
        case 'admin':
            destinataires.push('promo');

            db.anneeUniv.findAll({
                include: {
                    model: db.classe,
                    required: false,
                    include: {
                        model: db.groupe,
                        required: false,
                        attributes: ['nomGroupe'],
                        order: ['nomGroupe']
                    },
                    attributes: ['nomClasse'],
                    order: ['nomClasse']
                },
                attributes: ['nomAnneeUniv'],
                order: ['nomAnneeUniv']
            })
                .then(anneesUniv => {
                    for(let anneeUniv of anneesUniv){
                        destinataires.push(anneeUniv.nomAnneeUniv);
                        for(let classe of anneeUniv.classes){
                            destinataires.push(classe.nomClasse);
                            for(let groupe of classe.groupes){
                                destinataires.push(groupe.nomGroupe);
                            }
                        }
                    }

                    return res.status(200).json(destinataires);
                });
            break;
        case 'délégué':
            db.groupe.findOne({
                where: {
                    nomGroupe: req.auth.userGroupe
                }
            })
                .then(userGroupe => {
                    if(!userGroupe) return res.status(500).json({message: "Impossible de trouver votre classe."});

                    destinataires.push(userGroupe.nomClasse);

                    return db.groupe.findAll({
                        where: {
                            nomClasse: userGroupe.nomClasse
                        },
                        attributes: ['nomGroupe'],
                        order: ['nomGroupe']
                    })
                })
                .then(groupes => {
                    for(let groupe of groupes){
                        destinataires.push(groupe.nomGroupe);
                    }

                    return res.status(200).json(destinataires);
                })
            break;
        default:
            return res.status(500).json({message: "Vous n'avez pas les droits suffisants pour afficher la liste des destinataires."});
            break;
    }
}