const ICAL = require('ical.js');
const mysql = require('mysql');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "noobnote"
});

const liens = [
    {
        "classe": "S3",
        "groupe": 1,
        "link": "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c4a5f10b982f9b914f8b3df9a16d82f493dc5c094f7d1a811b903031bde802c7f56c5ce5d7b8d9b880fb6990772f87c6e42988e4003796ffd7b370c710463ddfae61a0aedc214bdb367a3cbb1ac24a15da166c54e36382c1aa3eb0ff5cb8980cdb,1"
    },
    {
        "classe": "S3",
        "groupe": 2,
        "link": "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c4a5f10b982f9b914f8b3df9a16d82f493dc5c094f7d1a811b903031bde802c7f56c5ce5d7b8d9b880fb6990772f87c6e42988e4003796ffd7b370c710463ddfae0ff22cc9831f21caada71a153a185315166c54e36382c1aa3eb0ff5cb8980cdb,1"
    }
]

exports.getEdt = (req, res, next) => {
    let body = req.body;

    db.query("SELECT classe, groupe FROM users WHERE email = '" + body.email + "';", (err, result) => {
        if(err) throw err;
        console.log(result);

        let request = new XMLHttpRequest();
        let groupe;
        for(let lien of liens){
            if(result[0].classe === lien.classe && result[0].groupe === lien.groupe){
                groupe = {
                    "classe": lien.classe,
                    "groupe": lien.groupe,
                    "link": lien.link
                }
            }
        }

        request.open(
            "GET",
            groupe.link
        );
        request.send(null);
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader("Content-Type");
                if (type.indexOf("text") !== 1) {
                    let jcalData = ICAL.parse(request.responseText);
                    let vcalendar = new ICAL.Component(jcalData);
                    let vevent = vcalendar.getAllSubcomponents("vevent");

                    res.status(200).json(vevent);
                }
            }else{
                res.status(501).json({error: "connection au calendrier impossible."});
            }
        }

    });

}