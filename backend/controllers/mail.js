const db = require('../models/index');

exports.annonce = async (req, res, next) => {

    if(req.body.destinataires === undefined){
        return res.status(400).json({message: 'Veuillez préciser un destinataire.'});
    }

    if (req.body.destinataires === 'promo') {
        //annonce à toute la promo
        if(req.auth.droitsUser !== 'admin'){
            return res.status(401).json({message: 'Vous n\'avez pas les droits suffisants.'});
        }

        db.user.findAll({attributes: ['emailUser']})
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

        db.user.findAll({
            attributes: ['emailUser'],
            where: {nomGroupe: req.body.destinataires}
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

        db.user.findAll({
            include: {
                model: db.groupe,
                required: true,
                where: {nomClasse: req.body.destinataires},
                attributes: []
            },
            attributes: ['emailUser'],
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
