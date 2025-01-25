package infra.repositories.hibernate;

public interface HibernateConfiguration {
    String jdbcUrl();

    String jdbcUser();

    String jdbcPassword();

    boolean jdbcShowSql();

    boolean jdbcFormatSql();

    boolean jdbcHighlightSql();

    boolean enableHibernateSchemaValidation();

    String migrationBaselineVersion();

    String migrationTargetVersion();
}
