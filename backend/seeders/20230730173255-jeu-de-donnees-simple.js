'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert('anneeUniv', [
			{
				nomAnneeUniv: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomAnneeUniv: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomAnneeUniv: 3,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});

		await queryInterface.bulkInsert('parcours', [
			{
				nomParcours: "A1",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomParcours: "RACDV",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomParcours: "IAMSI",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomParcours: "DACS",
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});

		await queryInterface.bulkInsert('classe', [
			{
				nomClasse: "S1",
				nomAnneeUniv: 1,
				nomParcours: "A1",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomClasse: "Q1",
				nomAnneeUniv: 2,
				nomParcours: "RACDV",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomClasse: "Q3",
				nomAnneeUniv: 2,
				nomParcours: "IAMSI",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomClasse: "Q4",
				nomAnneeUniv: 2,
				nomParcours: "DACS",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomClasse: "C1",
				nomAnneeUniv: 3,
				nomParcours: "RACDV",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomClasse: "C3",
				nomAnneeUniv: 3,
				nomParcours: "IAMSI",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomClasse: "C4",
				nomAnneeUniv: 3,
				nomParcours: "DACS",
				createdAt: new Date(),
				updatedAt: new Date()
			},
		], {});

		await queryInterface.bulkInsert('groupe', [
			{
				nomGroupe: "S1A",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "S1",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "S1B",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "S1",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "Q1A",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "Q1",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "Q1B",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "Q1",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "Q3A",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "Q3",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "Q3B",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "Q3",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "Q4A",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "Q4",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "Q4B",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "Q4",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "C1A",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "C1",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "C1B",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "C1",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "C3A",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "C3",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "C3B",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "C3",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "C4A",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "C4",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				nomGroupe: "C4B",
				lienICalGroupe: "https://proseconsult.umontpellier.fr/jsp/custom/modules/plannings/direct_cal.jsp?data=58c99062bab31d256bee14356aca3f2423c0f022cb9660eba051b2653be722c41984e67bbcf32a85131abbfce0350104dc5c094f7d1a811b903031bde802c7f5b399f9e7c3bba8f521c90cbeee2cb06b969dc7dae33d5165dfd2e1d1262ac6031c01fccee9700258ab7941d9ca9b1a79,1",
				nomClasse: "C4",
				createdAt: new Date(),
				updatedAt: new Date()
			},
		], {});

		await queryInterface.bulkInsert('theme', [
			{
				idTheme: 1,
				sourceTheme: "",
				couleurPrincipaleTheme: "CD00FF",
				couleurFond: "FFFFFF",
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});

		await queryInterface.bulkInsert('user', [
			{
				emailUser: "jean.lafontaine@etu.umontpellier.fr",
				nomUser: "La Fontaine",
				prenomUser: "Jean",
				droitsUser: -1,
				mdpUser: "$2b$10$Wp0XgMKIa5q6bdfns9zQT.ZUMVB3NpbVSJRChNTmSPeg07XfOxdS6",
				accepteRecevoirAnnonces: true,
				codeVerification: "58ed352e-c2d9-4e79-8e4e-a0ebf6bb6bce",
				expirationCodeVerification: null,
				nomGroupe: "Q1A",
				idTheme: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				emailUser: "emile.zola@etu.umontpellier.fr",
				nomUser: "Zola",
				prenomUser: "Émile",
				droitsUser: 0,
				mdpUser: "$2b$10$Wp0XgMKIa5q6bdfns9zQT.ZUMVB3NpbVSJRChNTmSPeg07XfOxdS6",
				accepteRecevoirAnnonces: true,
				codeVerification: "58ed352e-c2d9-4e79-8e4e-a0ebf6bb6bce",
				expirationCodeVerification: null,
				nomGroupe: "Q1A",
				idTheme: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				emailUser: "charles.baudelaire@etu.umontpellier.fr",
				nomUser: "Baudelaire",
				prenomUser: "Charles",
				droitsUser: 1,
				mdpUser: "$2b$10$Wp0XgMKIa5q6bdfns9zQT.ZUMVB3NpbVSJRChNTmSPeg07XfOxdS6",
				accepteRecevoirAnnonces: true,
				codeVerification: "58ed352e-c2d9-4e79-8e4e-a0ebf6bb6bce",
				expirationCodeVerification: null,
				nomGroupe: "Q1A",
				idTheme: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				emailUser: "albert.camus@etu.umontpellier.fr",
				nomUser: "Camus",
				prenomUser: "Albert",
				droitsUser: 2,
				mdpUser: "$2b$10$Wp0XgMKIa5q6bdfns9zQT.ZUMVB3NpbVSJRChNTmSPeg07XfOxdS6",
				accepteRecevoirAnnonces: true,
				codeVerification: "58ed352e-c2d9-4e79-8e4e-a0ebf6bb6bce",
				expirationCodeVerification: null,
				nomGroupe: "Q1A",
				idTheme: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				emailUser: "jean-paul.sartre@etu.umontpellier.fr",
				nomUser: "Jean-Paul",
				prenomUser: "Sartre",
				droitsUser: 3,
				mdpUser: "$2b$10$Wp0XgMKIa5q6bdfns9zQT.ZUMVB3NpbVSJRChNTmSPeg07XfOxdS6",
				accepteRecevoirAnnonces: true,
				codeVerification: "58ed352e-c2d9-4e79-8e4e-a0ebf6bb6bce",
				expirationCodeVerification: null,
				nomGroupe: "Q1A",
				idTheme: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
		], {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('user', "jean.lafontaine@etu.umontpellier.fr", {});
		await queryInterface.bulkDelete('user', "emile.zola@etu.umontpellier.fr", {});
		await queryInterface.bulkDelete('user', "charles.baudelaire@etu.umontpellier.fr", {});
		await queryInterface.bulkDelete('user', "albert.camus@etu.umontpellier.fr", {});
		await queryInterface.bulkDelete('user',  "jean-paul.sartre@etu.umontpellier.fr", {});

		await queryInterface.bulkDelete('theme',  1, {});

		await queryInterface.bulkDelete('groupe',  "S1A", {});
		await queryInterface.bulkDelete('groupe',  "S1B", {});
		await queryInterface.bulkDelete('groupe',  "Q1A", {});
		await queryInterface.bulkDelete('groupe',  "Q1B", {});
		await queryInterface.bulkDelete('groupe',  "Q3A", {});
		await queryInterface.bulkDelete('groupe',  "Q3B", {});
		await queryInterface.bulkDelete('groupe',  "Q4A", {});
		await queryInterface.bulkDelete('groupe',  "Q4B", {});
		await queryInterface.bulkDelete('groupe',  "C1A", {});
		await queryInterface.bulkDelete('groupe',  "C1B", {});
		await queryInterface.bulkDelete('groupe',  "C3A", {});
		await queryInterface.bulkDelete('groupe',  "C3B", {});
		await queryInterface.bulkDelete('groupe',  "C4A", {});
		await queryInterface.bulkDelete('groupe',  "C4B", {});

		await queryInterface.bulkDelete('classe',  "S1", {});
		await queryInterface.bulkDelete('classe',  "Q1", {});
		await queryInterface.bulkDelete('classe',  "Q2", {});
		await queryInterface.bulkDelete('classe',  "Q4", {});
		await queryInterface.bulkDelete('classe',  "C1", {});
		await queryInterface.bulkDelete('classe',  "C3", {});
		await queryInterface.bulkDelete('classe',  "C4", {});

		await queryInterface.bulkDelete('parcours',  "A1", {});
		await queryInterface.bulkDelete('parcours',  "RACDV", {});
		await queryInterface.bulkDelete('parcours',  "IAMSI", {});
		await queryInterface.bulkDelete('parcours',  "DACS", {});

		await queryInterface.bulkDelete('annee',  1, {});
		await queryInterface.bulkDelete('annee',  2, {});
		await queryInterface.bulkDelete('annee',  3, {});
	}
};
