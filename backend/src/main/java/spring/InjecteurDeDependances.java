package spring;

import coeur.entitees.Etablissement;
import coeur.repositories.EtablissementRepository;
import coeur.usecases.EnregistrementDemandeCreationEtablissement;
import infra.repositories.hibernate.*;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class InjecteurDeDependances {
    /* infrastructure */
    @Bean
    @Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
    public EtablissementRepository etablissementRepository(
            HibernateUtils hibernateUtils
    ) {
        HibernateEntityRepository<Etablissement> entityRepository = new HibernateEntityRepository<>(hibernateUtils, Etablissement.class);

        return new HibernateEtablissementRepository(entityRepository);
    }

    @Bean
    @Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
    public HibernateUtils hibernateUtils(HibernateConfiguration hibernateConfiguration) {
        return new HibernateUtils(hibernateConfiguration);
    }

    @Bean
    public HibernateConfiguration hibernateConfiguration() {
        return new DockerHibernateConfiguration();
    }

    /* use cases */
    @Bean
    public EnregistrementDemandeCreationEtablissement enregistrementDemandeCreationEtablissement(
            EtablissementRepository etablissementRepository
    ) {
        return new EnregistrementDemandeCreationEtablissement(etablissementRepository);
    }

    /* spring */

}
