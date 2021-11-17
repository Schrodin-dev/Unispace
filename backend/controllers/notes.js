const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "noobnote"
});

exports.getNotes = (req, res, next) => {
    db.query("SELECT n.matiere, note, coeff FROM notes n JOIN matieres m ON n.matiere = m.matiere WHERE email='" + req.body.email + "';", (err, notes) => {
        res.status(200).json(notes);
    });
}

exports.postNotes = (req, res, next) => {
    let body = req.body;
    db.query("INSERT INTO notes(email, matiere, note) VALUES('" + body.email + "', '" + body.matiere + "', '" + body.note + "');", (err, result) => {
        if(err){
            res.status(500).json({ err });
        }else{
            res.status(200).json({ message: "note ajoutée." });
        }
    });
}