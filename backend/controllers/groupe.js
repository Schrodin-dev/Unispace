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