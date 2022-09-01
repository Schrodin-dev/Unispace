const db = require('../models/index');
const ical = require('node-ical');
const couleurs = require('../config/couleurCours.json');

let plannings = {};
let couleurCours = {};

exports.chargerGroupes = () => {
    let newPlannings = {};
    db.groupe.findAll({attributes: ['nomGroupe', 'lienICalGroupe']})
        .then(async groupes => {
            for (const groupe of groupes) {
                await ical.async.fromURL(groupe.lienICalGroupe)
                    .then(async calendrier => {
                        let planning = [];
                        let i = 0;
                        for (const c in calendrier) {
                            const cours = calendrier[c];
                            if (cours.type === 'VEVENT') {
                                planning[i] = await genererCours(cours);
                                i++;
                            }
                        }
                        newPlannings[groupe.nomGroupe] = planning;
                    })
                    .catch(() => {
                        console.error('impossible de mettre à jour le planning du groupe ' + groupe.nomGroupe);
                    })

            }
        }).then(() => {
            plannings = newPlannings;
            console.log('groupes chargés');
    })

};

function parseDescription(description){
    let nouvelleDescription = [];
    let i = 0;
    const lignes = description.split(/\r\n|\r|\n/);

    for(const ligne of lignes){
        const mots = ligne.split('   ');
        if(mots.length === 2 && ligne.toUpperCase() === ligne){
            nouvelleDescription[i] = mots[0] + ' ' + mots[1];
            i++
        }
    }

    return nouvelleDescription;
}

async function genererCours(cours){
    const couleur = await chargerCouleur(cours.summary);
    return {
        nom: cours.summary,
        debut: cours.start,
        fin: cours.end,
        profs: parseDescription(cours.description),
        salles: cours.location,
        couleur: couleur
    }
}

exports.recupererEdt = (req, res, next) => {
    db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
        .then(groupe => {
            if(groupe === null){
                res.status(400).json({message: 'Impossible de trouver votre groupe.'});
            }

            let edt = [];
            let i = 0;
            const planning = plannings[req.auth.userGroupe];

            for(const cours of planning){
                const finSansTemps = new Date(cours.fin);
                finSansTemps.setHours(0,0,0,0);
                if( cours.debut.getTime() >= new Date(req.body.debut).getTime() && finSansTemps.getTime() <= new Date(req.body.fin).getTime()){
                    edt[i] = cours;
                    i++
                }
            }

            return res.status(200).json(edt);
        })
        .catch(error => {
            res.status(500).json({message: error});
        });


};

exports.recupererListeCours = (req, res, next) => {
    db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
        .then(groupe => {
            if(groupe === null){
                res.status(400).json({message: 'Impossible de trouver votre groupe.'});
            }

            let i = 0;
            const planning = plannings[req.auth.userGroupe];
            let nomCours = [];
            let listeCours = [];

            for(const cours of planning){
                if(!nomCours.includes(cours.nom)){
                    nomCours.push(cours.nom);
                    listeCours.push({
                        nom: cours.nom,
                        couleur: cours.couleur
                    })
                };
            }

            return res.status(200).json(listeCours);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({message: error});
        });
}

async function chargerCouleur(nomCours) {
    if (! (nomCours in couleurCours)) {
        await db.cours.findOne({where: {nomCours: nomCours}})
            .then(async cours => {
                if (cours === null) {
                    await db.cours.create({
                        nomCours: nomCours,
                        couleurCours: couleurs[Math.floor(Math.random() * couleurs.length)]
                    }).then(cours => {
                        couleurCours[nomCours] = cours.couleurCours;
                    }).catch(error => {
                        console.error(error);
                    });
                } else {
                    couleurCours[nomCours] = cours.couleurCours;
                }
            }).catch(error => {
                console.error(error);
            });
    }
    return couleurCours[nomCours];
}

exports.creerGroupe = (req, res, next) => {
    if(req.auth.droitsUser !== 'admin'){
        return res.status(401).json({message: "Vous devez être admin pour créer un groupe."});
    }

    db.groupe.create({
        nomGroupe: req.body.nom,
        lienICalGroupe: req.body.lienICal,
        nomClasse: req.body.classe
    })
        .then(() => {
            return res.status(201).json({message: "Le groupe a bien été créé."})
        })
        .catch(error => {res.status(500).json(error)});
}

exports.modifierLienICal = (req, res, next) => {
    if(req.auth.droitsUser !== 'admin'){
        return res.status(401).json({message: "Vous devez être admin pour modifier un groupe."});
    }

    db.groupe.findOne({where: {nomGroupe: req.body.nom}})
        .then(groupe => {
            if(groupe === null){
                return res.status(401).json({message: "Impossible de trouver le groupe correspondant."});
            }

            groupe.lienICalGroupe = req.body.lienICal;
            groupe.save()
                .then(() => {
                    return res.status(201).json({message: "Le lien ICal du groupe a bien été mis à jour."});
                })
                .catch(error => {return res.status(500).json(error);});
        })
        .catch(error => {return res.status(500).json(error);});
}

exports.supprimerGroupe = (req, res, next) => {
    if(req.auth.droitsUser !== 'admin'){
        return res.status(401).json({message: "Vous devez être admin pour supprimer un groupe."});
    }

    db.groupe.findOne({where: {nomGroupe: req.body.groupe}})
        .then(groupe => {
            if(groupe === null){
                return res.status(400).json({message: "Le groupe que vous souhaitez supprimer n'existe pas."});
            }

            groupe.destroy()
                .then(() => {
                    return res.status(201).json({message: "Le groupe a bien été supprimé."});
                })
                .catch(error => {return res.status(500).json(error)});
        })
        .catch(error => {return res.status(500).json(error)});
}

//non utilisé
exports.verifierExistanceCours = async (dateDebut, nomCours, userGroupe) => {
    let returnValue = undefined;
    await db.groupe.findOne({where: {nomGroupe: userGroupe}})
        .then(groupe => {
            if(groupe === undefined){
                return returnValue = false;
            }

            const planning = plannings[groupe.nomGroupe];

            for(const c in planning){
                const cours = planning[c];
                console.log(cours);
                if(cours.debut.getTime() === new Date(dateDebut).getTime() && cours.nom === nomCours){
                    return returnValue = true;
                }
            }
            return returnValue = false;
        })
        .catch(error => {
            return returnValue = false;
        });

    return returnValue;
};