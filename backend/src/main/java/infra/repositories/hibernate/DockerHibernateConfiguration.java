package infra.repositories.hibernate;

public class DockerHibernateConfiguration implements HibernateConfiguration {
    @Override
    public String jdbcUrl() {
        return "jdbc:postgresql://localhost:5001/unispace_db?currentSchema=public";
    }

    @Override
    public String jdbcUser() {
        return "unispace_user";
    }

    @Override
    public String jdbcPassword() {
        return "unispace_password";
    }

    @Override
    public boolean jdbcShowSql() {
        return true;
    }

    @Override
    public boolean jdbcFormatSql() {
        return true;
    }

    @Override
    public boolean jdbcHighlightSql() {
        return true;
    }

    @Override
    public boolean enableHibernateSchemaValidation() {
        return true;
    }

    @Override
    public String migrationBaselineVersion() {
        return "2.0.0";
    }

    @Override
    public String migrationTargetVersion() {
        return "2.0.0";
    }
}