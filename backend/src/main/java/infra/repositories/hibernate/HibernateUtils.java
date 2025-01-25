package infra.repositories.hibernate;

import coeur.entitees.Etablissement;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceException;
import org.flywaydb.core.Flyway;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.JdbcSettings;
import org.hibernate.cfg.SchemaToolingSettings;
import org.hibernate.tool.schema.Action;

public class HibernateUtils {
    private final HibernateConfiguration configuration;
    private SessionFactory sessionFactory;
    private EntityManager activeEntityManager;

    public HibernateUtils(HibernateConfiguration connectionConfiguration) {
        this.configuration = connectionConfiguration;
    }

    public SessionFactory getSessionFactory() {

        if (sessionFactory == null) {
            // Database migration versioning.
            Flyway.configure()
                    .dataSource(configuration.jdbcUrl(), configuration.jdbcUser(), configuration.jdbcPassword())
                    .baselineOnMigrate(true) // Tell Flyway to start managing an existing database
                    .baselineVersion(configuration.migrationBaselineVersion())   // Set the baseline version (e.g., 1.0.2)
                    .target(configuration.migrationTargetVersion()) // Define wanted version
                    .load()
                    .migrate();

            sessionFactory = new Configuration()
                    // Annotated entities
                    .addAnnotatedClass(Etablissement.class)
                    .setProperty(JdbcSettings.JAKARTA_JDBC_URL, configuration.jdbcUrl())
                    // Credentials
                    .setProperty(JdbcSettings.JAKARTA_JDBC_USER, configuration.jdbcUser())
                    .setProperty(JdbcSettings.JAKARTA_JDBC_PASSWORD, configuration.jdbcPassword())
                    // Schema validation
                    .setProperty(SchemaToolingSettings.JAKARTA_HBM2DDL_DATABASE_ACTION,
                            configuration.enableHibernateSchemaValidation() ? Action.VALIDATE : Action.NONE)
                    // SQL statement logging
                    .setProperty(JdbcSettings.SHOW_SQL, configuration.jdbcShowSql())
                    .setProperty(JdbcSettings.FORMAT_SQL, configuration.jdbcFormatSql())
                    .setProperty(JdbcSettings.HIGHLIGHT_SQL, configuration.jdbcHighlightSql())
                    // Create a new SessionFactory
                    .buildSessionFactory();
        }

        return sessionFactory;
    }

    public EntityManager getEntityManager() {
        if (activeEntityManager == null || !activeEntityManager.isOpen()) {
            activeEntityManager = getSessionFactory().createEntityManager();
        }
        return activeEntityManager;
    }
}
