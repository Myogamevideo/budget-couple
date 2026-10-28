# Instructions pour les agents

## Objectif du projet

Clair est une application web locale qui importe un classeur Excel de budget et affiche les transactions, les tableaux de bord par compte et les règlements entre Alexandre et Kelly. L'interface et la documentation destinée aux utilisateurs sont en français.

## Règles à respecter lors des modifications

- Lire le code et la documentation concernés avant de modifier le comportement. Suivre les conventions déjà présentes et limiter les changements au besoin demandé.
- Préserver les données de l'utilisateur et les règles de calcul confirmées ci-dessous. Ne pas déduire une nouvelle règle métier d'un simple écart de rapprochement : expliciter les incertitudes et demander une décision si le comportement attendu n'est pas établi.
- Quand une modification change le fonctionnement, les règles de calcul, les données acceptées ou les commandes d'utilisation, mettre à jour ce fichier et la documentation utilisateur pertinente (`README.md`) dans le même changement. Pour chaque tâche de modification du projet, vérifier si `AGENTS.md` doit être actualisé ; ne pas le laisser contredire le code.
- Ne pas ajouter de dépendance sans nécessité. Ne jamais envoyer les classeurs, relevés bancaires ou autres données financières à un service externe.
- Utiliser `npm run build` pour vérifier une modification de code quand c'est approprié. Node.js 18 ou supérieur est requis ; Node.js 20 LTS est recommandé. Les scripts disponibles sont `npm run dev`, `npm run build` et `npm run preview`.
- Le site est déployé sur GitHub Pages par `.github/workflows/pages.yml` lors des push sur `main`. `vite.config.js` fixe le préfixe `/budget-couple/` uniquement dans GitHub Actions ; préserver la compatibilité avec la racine locale pour le développement.
- Ne jamais ajouter de classeurs, relevés ou données financières personnelles au dépôt ou à l'artefact Pages. Le site publié peut être accessible publiquement, même si le dépôt est privé.

## Import des classeurs

- Les feuilles sources des opérations sont `Revenus …`, `Depenses …` et `Depense C Perso`.
- Ne pas importer les feuilles `Travaux` ni les feuilles commençant par `Dashboard` pour établir les données ou les calculs.
- Les colonnes principales sont `Date` et `Montant`. Reconnaître aussi les en-têtes alternatifs et les colonnes facultatives selon les helpers existants.
- Les lignes d'en-tête mensuelles et les lignes sans opération réelle ne doivent pas devenir des transactions. Conserver les opérations valides de montant nul si leur présence est requise pour la fidélité au classeur ; ne pas assimiler un séparateur mensuel à une transaction.
- Préserver les transactions présentes dans Excel, y compris les « Déjà remboursée » de C Perso, pour que le tableau de transactions reste fidèle à la source.
- Lors d'un rapprochement avec un relevé, comparer les mouvements, dates, montants, libellés, soldes et statut des paiements (comptabilisé ou en attente) avant de conclure qu'une opération manque. Un relevé peut inclure des mouvements antérieurs à la période du classeur ou des opérations non encore comptabilisées.

## Règles métier confirmées

- Les montants sont présentés en euros avec deux décimales dans toute l'application.
- Les revenus attribués à Alexandre ou Kelly alimentent la cagnotte correspondante. Les dépenses personnelles associées diminuent cette cagnotte.
- Les opérations explicitement attribuées au couple sont réparties à 50/50. Les indications « cagnotte Alexandre », « cagnotte Kelly » ou « cagnotte couple » dans le mémo priment pour l'attribution.
- Les dépenses C Perso payées sur la carte personnelle d'Alexandre (Alexandre C Perso et Alexandre Péage) ou de Kelly (Kelly C Perso et Kelly Carte Restaurant) sont partagées à 50/50. C Perso est réglé entre les personnes en privé.
- Les lignes « Déjà remboursée » de C Perso restent visibles, indiquent que la dépense a déjà été partagée à parts égales et ne réduisent pas une seconde fois la dette.
- TR, Summeria et CACF sont des comptes communs pour lesquels les remboursements de rééquilibrage se font sur le compte concerné. C Perso se règle en privé.
- Un transfert externe débite la cagnotte correspondant au compte payeur ; un compte couple est réparti à parts égales. Les transferts internes restent visibles mais sont exclus des dépenses courantes et des calculs de cagnotte appropriés.
- Les transactions Saveback TR restent visibles, mais le revenu Saveback est exclu des revenus comptabilisés et des cagnottes, car il compense le débit Saveback. Les plans d'épargne sont des investissements/achats CTO : ils restent identifiables et sont distingués des dépenses de consommation.
- Les soldes d'ouverture et les soldes actuels éventuellement saisis par l'utilisateur sont des données locales à son navigateur. Un solde réel actuel saisi remplace l'estimation calculée.
- Les opérations dont l'attribution n'est pas reconnue doivent rester vérifiables et être signalées, pas attribuées silencieusement.

## Dashboards de dépenses

- Le dashboard « Travaux » rassemble les dépenses dont la catégorie ou le projet contient « travaux », quel que soit le compte.
- Le dashboard « Dépenses du quotidien » contient les autres dépenses suivies, tous comptes confondus.
- Ces deux vues excluent des indicateurs de consommation les transferts, les ajustements « Déjà remboursée », les dépenses Saveback TR et les plans d'épargne TR. Ne pas modifier ces exclusions sans documenter et vérifier l'effet sur les totaux.
- Calculer les parts par personne en réutilisant `allocationFor` et les règles de répartition communes. Les opérations non reconnues restent dans le total, mais sont isolées comme non attribuées ; elles ne doivent pas être réparties silencieusement.
- L'indicateur de moyenne mensuelle est un repère calculé sur les mois avec dépenses, pas un budget défini par l'utilisateur. Si les dashboards ou leurs critères changent, mettre à jour le README.

## Sécurité et confidentialité

- Les classeurs et données financières sont traités localement dans le navigateur.
- Ne pas journaliser ou inclure dans les changements des IBAN, adresses, relevés, données de transaction, soldes réels ou autres informations financières/personnelles provenant des fichiers importés.
- Valider les fichiers et entrées selon les mécanismes déjà présents ; éviter les erreurs silencieuses et les valeurs de repli qui masquent une erreur de calcul.
