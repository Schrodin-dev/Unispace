package coeur.usecases;

import coeur.entitees.Etablissement;
import coeur.repositories.EtablissementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;

class EnregistrementDemandeCreationEtablissementTest {
    private EtablissementRepository repository;
    private EnregistrementDemandeCreationEtablissement usecase;
    private String base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsSAAALEgHS3X78AAAAZUlEQVR42mPo7+//X19f/x9Ew9glJSX/MzIywGwGZAEQDcLz/r3+n/r1MZgNVnD1/zewALJJME0M6LqRFcOtAGGQIEwhTAxsBcxhMAEQH+QG2wdPESYgC8CsgJnGADMS5i10bwMAYaSo/zl46awAAAAASUVORK5CYII=";

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(EtablissementRepository.class);

        usecase = new EnregistrementDemandeCreationEtablissement(repository);
    }

    @Test
    void testDemandeDeCreationAvecUnEtablissementValide() {
        EnregistrementDemandeCreationEtablissement.InputDto inputDto = new EnregistrementDemandeCreationEtablissement.InputDto(
                "nom",
                base64Image,
                "email@etik.com"
        );

        usecase.execute(inputDto);

        Etablissement resultatAttendu = new Etablissement(
                "nom",
                base64Image,
                "email@etik.com"
        );
        Mockito.verify(repository, Mockito.times(1)).insert(resultatAttendu);
    }

    @Test
    void testDemandeDeCreationSansNom() {
        EnregistrementDemandeCreationEtablissement.InputDto inputDto = new EnregistrementDemandeCreationEtablissement.InputDto(
                null,
                base64Image,
                "email@etik.com"
        );

        assertThrows(IllegalArgumentException.class, () -> usecase.execute(inputDto));
    }

    @Test
    void testDemandeDeCreationAvecNomVide() {
        EnregistrementDemandeCreationEtablissement.InputDto inputDto = new EnregistrementDemandeCreationEtablissement.InputDto(
                "   ",
                base64Image,
                "email@etik.com"
        );

        assertThrows(IllegalArgumentException.class, () -> usecase.execute(inputDto));
    }

    @Test
    void testDemandeDeCreationAvecNomTropLong() {
        EnregistrementDemandeCreationEtablissement.InputDto inputDto = new EnregistrementDemandeCreationEtablissement.InputDto(
                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                base64Image,
                "email@etik.com"
        );

        assertThrows(IllegalArgumentException.class, () -> usecase.execute(inputDto));
    }

    @Test
    void testDemandeDeCreationSansImage() {
        EnregistrementDemandeCreationEtablissement.InputDto inputDto = new EnregistrementDemandeCreationEtablissement.InputDto(
                "nom",
                null,
                "email@etik.com"
        );

        assertThrows(IllegalArgumentException.class, () -> usecase.execute(inputDto));
    }

    @Test
    void testDemandeDeCreationSansEmail() {
        EnregistrementDemandeCreationEtablissement.InputDto inputDto = new EnregistrementDemandeCreationEtablissement.InputDto(
                "nom",
                base64Image,
                null
        );

        assertThrows(IllegalArgumentException.class, () -> usecase.execute(inputDto));
    }

    @Test
    void testDemandeDeCreationAvecEmailVide() {
        EnregistrementDemandeCreationEtablissement.InputDto inputDto = new EnregistrementDemandeCreationEtablissement.InputDto(
                "nom",
                base64Image,
                ""
        );

        assertThrows(IllegalArgumentException.class, () -> usecase.execute(inputDto));
    }

    @Test
    void testDemandeDeCreationAvecEmailInvalide() {
        EnregistrementDemandeCreationEtablissement.InputDto inputDto = new EnregistrementDemandeCreationEtablissement.InputDto(
                "nom",
                base64Image,
                "emailInvalide.com"
        );

        assertThrows(IllegalArgumentException.class, () -> usecase.execute(inputDto));
    }
}