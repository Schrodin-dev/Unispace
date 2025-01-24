package coeur.entitees;

public class Etablissement {
    private String nom;
    private String imageBase64;
    private String emailContact;
    private boolean estValide;

    public Etablissement(String nom, String imageBase64, String emailContact) {
        this.nom = nom;
        this.imageBase64 = imageBase64;
        this.emailContact = emailContact;
        this.estValide = false;
    }
}
