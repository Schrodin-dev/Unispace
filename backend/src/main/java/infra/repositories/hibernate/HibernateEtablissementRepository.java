package infra.repositories.hibernate;

import coeur.entitees.Etablissement;
import coeur.repositories.EtablissementRepository;

public class HibernateEtablissementRepository implements EtablissementRepository {
    private final HibernateEntityRepository<Etablissement> etablissementRepository;

    public HibernateEtablissementRepository(HibernateEntityRepository<Etablissement> etablissementRepository) {
        this.etablissementRepository = etablissementRepository;
    }

    @Override
    public void insert(Etablissement etablissement) {
        etablissementRepository.create(etablissement);
    }
}
