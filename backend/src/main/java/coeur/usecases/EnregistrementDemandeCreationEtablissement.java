package coeur.usecases;

import coeur.entitees.Etablissement;
import coeur.repositories.EtablissementRepository;

import java.util.regex.Pattern;

public class EnregistrementDemandeCreationEtablissement {
    private final EtablissementRepository repository;
    private final Pattern emailPattern = Pattern.compile("^[\\w\\-.]+@([\\w-]+\\.)+[\\w-]{2,}$");

    public EnregistrementDemandeCreationEtablissement(EtablissementRepository repository) {
        this.repository = repository;
    }

    public void execute(InputDto inputDto) throws IllegalArgumentException {
        if (inputDto.nom == null || inputDto.nom.isBlank()) {
            throw new IllegalArgumentException("Veuillez préciser un nom d'établissement.");
        }
        if (inputDto.nom.length() > 100) {
            throw new IllegalArgumentException("Le nom ne doit pas dépasser 100 caractères.");
        }
        if (inputDto.imageBase64 == null || inputDto.imageBase64.isEmpty()) {
            throw new IllegalArgumentException("Veuillez ajouter une image d'établissement.");
        }
        if (inputDto.emailContact == null || inputDto.emailContact.isBlank()) {
            throw new IllegalArgumentException("Veuillez préciser un email de contact.");
        }
        if (inputDto.emailContact.length() > 100) {
            throw new IllegalArgumentException("L'email de contact ne doit pas dépasser 100 caractères.");
        }
        if (!emailPattern.matcher(inputDto.emailContact).matches()) {
            throw new IllegalArgumentException("Veuillez préciser une email valide.");
        }

        Etablissement etablissement = new Etablissement(
                inputDto.nom,
                inputDto.imageBase64,
                inputDto.emailContact
        );

        repository.insert(etablissement);
    }

    public record InputDto(String nom, String imageBase64, String emailContact){}
}
