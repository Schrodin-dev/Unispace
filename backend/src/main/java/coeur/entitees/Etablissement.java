package coeur.entitees;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.Objects;
import java.util.UUID;

@Entity
public class Etablissement {
    @Id
    private UUID id;
    @Column
    private String nom;
    @Column(name = "image_base64")
    private String imageBase64;
    @Column(name = "email_contact")
    private String emailContact;
    @Column(name = "est_valide")
    private boolean estValide;

    public Etablissement() {
    }

    public Etablissement(String nom, String imageBase64, String emailContact) {
        this.id = UUID.randomUUID();
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
