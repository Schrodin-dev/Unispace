const db = require('../models/index');
const ical = require('node-ical');

let plannings = {};

exports.chargerGroupes = () => {
    plannings = {};
    db.groupe.findAll({attributes: ['nomGroupe', 'lienICalGroupe']})
        .then(async groupes => {
            for (const groupe of groupes) {
                await ical.async.fromURL(groupe.lienICalGroupe)
                    .then(calendrier => {
                        let planning = [];
                        let i = 0;
                        for(const c in calendrier){
                            const cours = calendrier[c];
                            if(cours.type === 'VEVENT'){
                                planning[i] = genererCours(cours);
                                i++;
                            }
                        }
                        plannings[groupe.nomGroupe] = planning;
                    })
                    .catch(() => {
                        console.error('impossible de mettre à jour le planning du groupe ' + groupe.nomGroupe);
                    })

            }
        }).then(() => {
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

function genererCours(cours){
    return {
        nom: cours.summary,
        debut: cours.start,
        fin: cours.end,
        profs: parseDescription(cours.description),
        salles: cours.location
    }
}

exports.recupererEdt = (req, res, next) => {
    db.groupe.findOne({where: {nomGroupe: req.auth.userGroupe}})
        .then(groupe => {
            if(groupe === null){
                res.status(400).json({message: 'impossible de trouver votre groupe.'});
            }

            let edt = [];
            let i = 0;
            const planning = plannings[req.auth.userGroupe];
            for(const c in planning){
                const cours = planning[c];
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
            console.error(error);
            res.status(500).json(error)
        });


};