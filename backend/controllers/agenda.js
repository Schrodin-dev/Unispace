const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "noobnote"
});

exports.get = (req, res, next) => {
    db.query("SELECT *, contenu FROM agenda", (err, agenda) => {
        if(err){
            res.status(501).json({err});
        }else{
            res.status(200).json(agenda);
        }
    });
}

exports.add = (req, res, next) => { //DATETIME : YYYY-MM-DD HH-mm-ss
    let body = req.body;
    db.query("INSERT INTO agenda(matiere, debut, fin, contenu) VALUES('" + body.matiere + "', '" + body.debut + "', '" + body.fin + "', '" + body.contenu + "');", (err, agenda) => {
        if(err){
            res.status(501).json({err});
        }else{
            res.status(200).json({ message: "ajouté à l'agenda." });
            console.log("added");
        }
    });
}

exports.modify = (req, res, next) => {
    let body = req.body;
    db.query("UPDATE agenda SET matiere='" + body.matiere + "', debut='" + body.debut + "', fin='" + body.fin + "', contenu='" + body.contenu + "' WHERE id='" + body.id + "';", (err, agenda) => {
        if(err){
            res.status(501).json({err});
        }else{
            res.status(200).json({ message: "agenda modifié." });
            console.log("modified");
        }
    });
}

exports.remove = (req, res, next) => {
    let body = req.body;
    db.query("DELETE FROM agenda WHERE id='" + body.id + "';", (err, agenda) => {
        if(err){
            res.status(501).json({err});
        }else{
            res.status(200).json({ message: "agenda supprimé." });
            console.log("removed");
        }
    });
}