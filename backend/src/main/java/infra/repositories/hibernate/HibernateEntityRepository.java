package infra.repositories.hibernate;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.io.Serializable;
import java.util.List;

public class HibernateEntityRepository<T> {

    private final HibernateUtils hibernateUtils;
    private final Class<T> type;

    public HibernateEntityRepository(HibernateUtils hibernateUtils, Class<T> type) {
        this.hibernateUtils = hibernateUtils;
        this.type = type;
    }

    public List<T> findAll() {

        EntityManager entityManager = hibernateUtils.getEntityManager();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> criteria = builder.createQuery(type);
        criteria.from(type);

        return entityManager.createQuery(criteria).getResultList();
    }

    public T findById(Serializable id) {
        EntityManager entityManager = hibernateUtils.getEntityManager();
        Session session = entityManager.unwrap(Session.class);
        return session.get(type, id);
    }

    public void update(T entity) throws Exception {

        EntityManager entityManager = hibernateUtils.getEntityManager();
        Session session = entityManager.unwrap(Session.class);
        Transaction transaction = session.beginTransaction();
        try {
            session.merge(entity);
            session.flush();
            transaction.commit();
        } catch (Exception e) {
            transaction.rollback();
            throw e;
        }
    }

    public void create(T entity) {
        EntityManager entityManager = hibernateUtils.getEntityManager();
        Session session = entityManager.unwrap(Session.class);
        Transaction transaction = session.beginTransaction();
        session.persist(entity);
        session.flush();
        transaction.commit();
    }

    public void delete(T entity) {
        EntityManager entityManager = hibernateUtils.getEntityManager();
        Session session = entityManager.unwrap(Session.class);
        Transaction transaction = session.beginTransaction();
        session.remove(entity);
        session.flush();
        transaction.commit();
    }

    public void createOrUpdate(T entity) throws Exception {
        update(entity);
    }

    public void testConnection() throws HibernateException {
        hibernateUtils.getSessionFactory();
    }

    public void close() {
        if (hibernateUtils.getEntityManager() != null && hibernateUtils.getEntityManager().isOpen())
            hibernateUtils.getEntityManager().close();
        if (hibernateUtils.getSessionFactory() != null && hibernateUtils.getSessionFactory().isOpen())
            hibernateUtils.getSessionFactory().close();
    }
}