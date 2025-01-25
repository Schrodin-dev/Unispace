package spring.controleurs;

import coeur.usecases.EnregistrementDemandeCreationEtablissement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/etablissement")
public class ControleurEtablissement {
    private EnregistrementDemandeCreationEtablissement enregistrementDemandeCreationEtablissement;

    @Autowired
    public ControleurEtablissement(EnregistrementDemandeCreationEtablissement enregistrementDemandeCreationEtablissement) {
        this.enregistrementDemandeCreationEtablissement = enregistrementDemandeCreationEtablissement;
    }

    @PostMapping("/demande")
    public void demandeEtablissement(
            @RequestBody EnregistrementDemandeCreationEtablissement.InputDto inputDto
    ) {
        try {
            enregistrementDemandeCreationEtablissement.execute(inputDto);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
