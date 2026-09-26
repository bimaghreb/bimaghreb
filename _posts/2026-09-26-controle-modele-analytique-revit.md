---
title: "Modèle analytique Revit : repérer les nœuds déconnectés avant l'export"
description: "Deux contrôles pour trouver et corriger les nœuds analytiques déconnectés avant d'envoyer un modèle Revit au calcul : un filtre de vue, puis le contrôle analytique de Graitec PowerPack."
date: 2026-09-26 10:00:00 +0100
---

Un nœud analytique déconnecté ne se voit pas dans une vue courante de Revit. Il se découvre au calcul : barres qui ne s'appuient sur rien, avertissements d'instabilité, résultats à reprendre. Mieux vaut le trouver avant l'export.

Voici les deux contrôles que j'utilise pour y parvenir.

## 1. Rendre les nœuds déconnectés visibles

Un filtre de vue colore les nœuds sans connexion. Il se crée en trois étapes.

**Afficher les nœuds analytiques.** Dans les remplacements de visibilité et graphismes (raccourci VV), activer la catégorie Nœuds analytiques.

![Remplacements de visibilité : la catégorie Nœuds analytiques est activée](/assets/blog/controle-modele-analytique/01-visibilite-noeuds.png)

**Créer le filtre.** Dans l'onglet Filtres : catégorie **Nœuds analytiques**, règle **État de connexion égal à Sans contrainte**.

![Le filtre « Nœuds analytiques non connectés » et sa règle](/assets/blog/controle-modele-analytique/02-regle-du-filtre.png)

**Lui donner une couleur franche**, un rouge par exemple.

![Remplacement graphique du filtre : trait rouge](/assets/blog/controle-modele-analytique/03-couleur-du-filtre.png)

Les nœuds déconnectés ressortent alors immédiatement, de près comme sur l'ensemble du modèle.

![Un nœud déconnecté, en rouge, à côté du nœud auquel il devrait se raccorder](/assets/blog/controle-modele-analytique/04-noeud-isole.png)

![Vue 3D du modèle analytique : les nœuds déconnectés ressortent en rouge](/assets/blog/controle-modele-analytique/05-vue-3d-noeuds.png)

## 2. Recenser les défauts avec PowerPack

Le filtre montre les défauts ; il ne les compte pas. Pour une liste exhaustive, j'utilise la commande **Contrôle analytique** de Graitec PowerPack pour Revit. Elle relève les éléments trop proches pour être distincts, mais qui ne sont pas connectés.

![La commande Contrôle analytique dans le ruban de PowerPack](/assets/blog/controle-modele-analytique/06-powerpack-ruban.png)

**Régler la tolérance.** Je la fixe à 3 cm (0,03 m) : tout écart inférieur entre deux éléments est signalé comme une erreur.

![Réglage de la tolérance à 0,03 m](/assets/blog/controle-modele-analytique/07-tolerance.png)

**Lancer le contrôle.** L'outil dresse la liste des problèmes, avec les identifiants des éléments concernés.

![Liste des problèmes relevés par le contrôle](/assets/blog/controle-modele-analytique/08-resultats.png)

**Corriger point par point.** Chaque ligne se localise dans la vue. On corrige, puis on relance le contrôle jusqu'à ce que la liste soit vide.

![Correction d'un point signalé, localisé par une sphère](/assets/blog/controle-modele-analytique/09-correction.png)

![Nouveau contrôle : plus aucun problème relevé](/assets/blog/controle-modele-analytique/10-controle-valide.png)

## En résumé

Le filtre accompagne la modélisation ; le contrôle PowerPack valide le modèle avant l'export. Ensemble, ils évitent de découvrir dans Robot un défaut qui se corrige plus simplement dans Revit.
