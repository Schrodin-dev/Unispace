CREATE TABLE etablissement
(
    id            UUID NOT NULL,
    nom           VARCHAR(255),
    image_base64  VARCHAR(255),
    email_contact VARCHAR(255),
    est_valide    BOOLEAN,
    CONSTRAINT pk_etablissement PRIMARY KEY (id)
);