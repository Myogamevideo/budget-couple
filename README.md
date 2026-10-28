# Clair — Budget du foyer

Tableau de bord web en français pour analyser un classeur de budget Excel. Le fichier est lu dans le navigateur : il n'est pas envoyé à un serveur ni enregistré par l'application.

## Lancer l'application

Node.js 18 ou une version ultérieure est requis (Node.js 20 LTS est recommandé). Node.js 10 est trop ancien pour Vite et les versions récentes de npm. Si `npm install` affiche une erreur telle que `Cannot find module 'node:path'`, mettez Node.js à niveau avant de continuer. Avec nvm :

```sh
nvm install 20
nvm use 20
node --version
npm --version
```

Vérifiez que `node --version` affiche `v20` (ou au minimum `v18`), puis depuis le dossier du projet :

```sh
cd myogamevideo-crispy-chainsaw
npm install
npm run dev
```

Lors du premier lancement, `npm install` installe les dépendances. `npm run dev` démarre ensuite le serveur de développement. Ouvrez l'adresse locale affichée dans le terminal (généralement `http://localhost:5173`), puis importez votre fichier `.xlsx` ou `.xlsm`. Les anciens fichiers `.xls` doivent d’abord être enregistrés au format `.xlsx`.

Pour générer la version de production, lancez `npm run build`. Pour la prévisualiser localement, lancez ensuite `npm run preview`.

## Publier le site sur GitHub Pages

Le dépôt `Myogamevideo/budget-couple` est configuré pour publier automatiquement le site avec GitHub Actions à chaque push sur `main`. Vite utilise `/budget-couple/` comme chemin de base sur GitHub Pages et `/` en développement local.

Le dossier de travail actuel n'a pas de dépôt Git fonctionnel. Pour publier ses fichiers sans écraser ce dossier, clonez le dépôt vide dans un nouveau dossier, puis copiez-y le projet (remplacez `/chemin/vers/Clair/` par le chemin local du dossier contenant `src/` et `package.json`) :

```sh
git clone https://github.com/Myogamevideo/budget-couple.git budget-couple-publish
rsync -av --exclude='.git' --exclude='node_modules' --exclude='dist' /chemin/vers/Clair/ budget-couple-publish/
cd budget-couple-publish
npm ci
npm run build
git add .
git commit -m "Initialise Clair budget dashboard"
git push -u origin main
```

Pour le dépôt actuellement privé, rendez-le public dans **Settings → General → Danger Zone → Change repository visibility**. Cette étape publie le code source du dépôt ; vérifiez qu'il ne contient aucun classeur, relevé ou autre donnée financière. Dans GitHub, ouvrez ensuite **Settings → Pages**, puis choisissez **GitHub Actions** comme source de déploiement. Après le premier déploiement réussi, le site sera disponible à l'adresse `https://myogamevideo.github.io/budget-couple/` ; les déploiements suivants sont déclenchés automatiquement par les push sur `main`.

Le dépôt cible est privé. GitHub Pages n'autorise l'utilisation d'un dépôt privé que selon le forfait GitHub du propriétaire ; avec GitHub Free, le dépôt doit être public. Un site Pages est publiquement accessible sur Internet même si son dépôt source est privé, sauf publication privée réservée à GitHub Enterprise Cloud. Avant d'activer Pages, vérifiez que le dépôt ne contient que le code et aucun classeur, relevé ou autre donnée financière. Les fichiers Excel importés dans Clair sont analysés localement dans le navigateur et ne sont pas transmis au site.

## Données prises en charge

L'import lit uniquement les feuilles de transactions `Revenus …`, `Depenses …` et la feuille annexe `Depense C Perso`. Les feuilles `Travaux` et celles dont le nom commence par `Dashboard` ne sont pas utilisées. Il attend des colonnes de date et de montant, et reconnaît les colonnes facultatives de catégorie, compte, projet, marchand et mémo.

Les feuilles « Revenus … » et « Depenses … » sont les sources principales. Les lignes sans date ou montant (par exemple les titres de mois) sont ignorées, sauf les lignes « Déjà remboursée » de C Perso, conservées comme remboursements privés pour le calcul du règlement et exclues des opérations et totaux de dépenses. Les doublons de la feuille annexe « Depense C Perso » sont écartés en comparant date, montant, compte, catégorie, projet, marchand et mémo afin de ne pas confondre deux achats similaires réalisés sur des comptes différents. Les transferts internes restent visibles mais sont exclus des dépenses courantes et du solde net ; les transferts externes TR sont comptabilisés comme sorties de la cagnotte qui les paie.

Après import, la navigation donne accès à un tableau de bord et à un tableau de transactions pour Trade Republic (TR), Summeria, CACF et C Perso. Les comptes sont reconnus depuis la colonne « Compte » ou, si elle est vide, depuis le nom de la feuille. C Perso regroupe les dépenses de la feuille « Depense C Perso ».

Deux vues transversales complètent ces dashboards : « Travaux » regroupe les dépenses dont la catégorie ou le projet contient « travaux », tous comptes confondus ; « Dépenses du quotidien » regroupe les autres dépenses suivies. Elles affichent le total de la période, la part attribuée à Alexandre et à Kelly, une moyenne mensuelle sur les mois avec dépenses, l’évolution mois par mois, les plus grosses opérations, les marchands les plus fréquentés et la répartition par catégorie. La vue Travaux ajoute une ventilation par compte avec les parts d’Alexandre et de Kelly. Ces parts utilisent les règles d’attribution existantes ; les opérations sans règle sont indiquées comme non attribuées. Les dépenses sont filtrables par année, catégorie, compte et recherche, et le tableau conserve la pagination. Les deux vues excluent des dépenses analysées les transferts, les ajustements « Déjà remboursée », Saveback et les achats de plans d’épargne TR. La moyenne mensuelle est un repère basé sur l’historique, pas un budget cible personnalisé.

Les cagnottes sont calculées à partir des onglets « Revenus … » et « Depenses … » : l’application lit les colonnes Date, Montant, Account et Memo. Les lignes de titre de mois sans date ni montant sont ignorées. Les revenus dont le compte est « Alexandre … » ou « Kelly … » sont attribués à la personne correspondante ; les dépenses TR, CACF et Summeria de ces comptes diminuent sa cagnotte. Les comptes « Remboursement », « Saveback », « Intérêts », « Dividende », « CTO » et « 50/50 Couple … » sont répartis à parts égales. Les dépenses « Alexandre Peage », « Alexandre C Perso », « Kelly C Perso » et « Kelly Carte Restaurant » sont également partagées à 50/50. Une indication explicite « cagnotte Alexandre », « cagnotte Kelly » ou « cagnotte couple » dans Memo précise l’attribution. Les opérations sans attribution reconnue sont signalées comme non réparties. Les montants texte au format français, avec espaces de milliers et symbole €, sont pris en charge. Tous ces calculs sont réalisés localement dans le navigateur.

Le tableau Transactions peut être filtré par type, catégorie et compte, avec pagination réglable à 10, 25 ou 50 lignes. Il garde visibles les lignes « Déjà remboursée » de C Perso : elles apparaissent comme des ajustements dans une colonne dédiée, sans entrer une seconde fois dans les dépenses. Les colonnes de répartition indiquent à qui se rapporte chaque opération, la part attribuée à Alexandre et à Kelly, et le règlement estimé. Une dépense C Perso payée par l’un est partagée en deux ; une ligne « Déjà remboursée » est considérée comme déjà réglée à parts égales et ne réduit pas directement la dette de l’un envers l’autre. Si une valeur déjà remboursée est renseignée sur une dépense, seule la partie non réglée reste à partager. Les revenus et dépenses de cagnotte personnelle sont attribués à la personne du compte ; les opérations communes reconnues sont partagées à 50/50. Les graphiques affichent les valeurs au survol. Tous les montants monétaires de l’application sont affichés en euros avec deux décimales.

Chaque tableau de bord de compte présente aussi un suivi mensuel des revenus et dépenses attribués à Alexandre, Kelly et au pot 50/50, ainsi que le solde cumulé de chaque cagnotte à reporter au mois suivant. Le solde est calculé depuis la première opération du compte présente dans le fichier, en supposant un solde initial de 0 € ; les mouvements antérieurs à l’année sélectionnée sont inclus dans le report. Les transferts, lignes « Déjà remboursée » et opérations sans attribution reconnue ne sont pas inclus dans les soldes. Les montants des dépenses communes restent affectés au pot 50/50. Sur C Perso, le solde 50/50 est un cumul comptable des dépenses partagées (et non un solde bancaire), puisque ces dépenses sont réglées sur les cartes personnelles. Les soldes mensuels de Trade Republic, Summeria et CACF incluent désormais les cagnottes personnelles et communes.

Sur les tableaux de bord TR, Summeria et CACF, le bloc « Solde d’ouverture » permet de saisir pour chaque année le solde bancaire réel au 31 décembre précédent et les parts de départ d’Alexandre et Kelly. La part commune est calculée comme la différence entre le solde bancaire et les deux parts individuelles. Ces valeurs sont conservées dans le stockage local du navigateur et remplacent le solde calculé antérieurement au 1er janvier de l’année choisie ; les mouvements mensuels de l’année s’y ajoutent ensuite. Si aucune valeur n’est saisie, le solde initial reste à 0 €.

Chaque compte dispose aussi d’un indicateur « Argent disponible actuellement ». Pour TR, Summeria et CACF, il estime le solde à partir du solde d’ouverture et des mouvements importés (revenus et dépenses, y compris les débits Saveback et les transferts externes ; les transferts internes sont exclus). Vous pouvez saisir le solde réellement affiché par la banque pour remplacer cette estimation. Pour C Perso, dont les dépenses regroupent plusieurs cartes sans les revenus/flux complets des comptes bancaires, saisissez manuellement le montant disponible ; il n’est pas estimé à partir des seules dépenses. Les soldes réels saisis sont enregistrés localement dans le navigateur.

Sur Trade Republic, les dépenses de compte « 💸 Saveback » sont identifiées comme des débits compensés par le revenu Saveback et apparaissent séparément dans le récapitulatif ; le total « dépenses sans Saveback » permet de voir les autres débits. Le revenu Saveback reste visible dans les transactions, mais est exclu des totaux de revenus, des graphiques et des soldes de cagnottes puisqu’il compense ce débit sans augmenter le solde. Les transactions « ⁉️ Plans d’épargne » sont identifiées comme des investissements : le tableau mensuel les ventile entre couple, Alexandre et Kelly, et les graphiques distinguent les placements des dépenses finales de consommation. Le résumé affiche le total des débits, le Saveback, les dépenses sans Saveback, le total investi et les dépenses finales (total des débits moins investissements).

La vue d’ensemble récapitule la dette privée C Perso et les versements de rééquilibrage dus aux comptes communs Trade Republic, Summeria et CACF. Pour les comptes communs, l’estimation compare les contributions enregistrées sur les cagnottes individuelles ; la personne ayant le moins contribué verse la moitié de l’écart au compte commun concerné. C Perso reste réglé en privé entre les personnes. Ces estimations portent sur l’année sélectionnée ou toute la période.

Les transferts externes TR et Summeria débitent la cagnotte du compte payeur : s’ils sont effectués depuis « 50/50 Couple TR » ou « 50/50 Couple Summeria », ils sont répartis à parts égales entre Alexandre et Kelly ; depuis un compte personnel TR ou Summeria, ils sont retirés de la cagnotte de la personne concernée. Ces opérations figurent dans les dépenses et le suivi mensuel de la cagnotte correspondante. Les transferts internes restent exclus des dépenses et des cagnottes. Le tableau de bord « À vérifier » liste les transactions dont le compte, la catégorie ou le mémo ne permet pas d’identifier une règle de cagnotte. Les transferts internes et lignes « Déjà remboursée » sont exclus de cette liste.
