package coeur.entitees;

import java.util.Objects;

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

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Etablissement that)) return false;

        return Objects.equals(nom, that.nom) && Objects.equals(imageBase64, that.imageBase64) && Objects.equals(emailContact, that.emailContact);
    }

    @Override
    public int hashCode() {
        int result = Objects.hashCode(nom);
        result = 31 * result + Objects.hashCode(imageBase64);
        result = 31 * result + Objects.hashCode(emailContact);
        return result;
    }
}
