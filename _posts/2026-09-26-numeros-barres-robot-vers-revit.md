---
title: "Numéros de barres : de Robot vers Revit, automatiquement"
description: "Un script Dynamo lit le modèle ouvert dans Robot Structural Analysis et reporte le numéro de chaque barre dans le Repère des poutres et des poteaux Revit."
date: 2026-09-26 11:00:00 +0100
---

La numérotation des barres se fait dans Robot Structural Analysis : c'est elle qui organise la note de calcul. Les plans de coffrage et les nomenclatures, eux, sortent de Revit, où chaque poutre et chaque poteau doit porter le même numéro. Le lien entre les deux logiciels ne transfère pas ce numéro. Le script présenté ici s'en charge.

## Pourquoi le lien ne suffit pas

Revit et Robot numérotent leurs éléments chacun de leur côté, et le lien ne rend pas accessible la correspondance qu'il établit entre eux. Sans outil, il reste la saisie manuelle : longue, et source d'erreurs qui finissent sur les plans.

## Le principe : retrouver chaque barre par sa position

Plutôt que de chercher un identifiant commun, le script compare les géométries. En un seul lancement, depuis un nœud Python de Dynamo, il :

1. lit dans Robot le numéro et les deux nœuds de chaque barre ;
2. calcule le milieu de chaque poutre et de chaque poteau de Revit ;
3. recale les deux modèles, dont les origines diffèrent en général d'une translation : une première estimation par les centres des deux nuages de points, puis des affinages successifs sur les paires les plus proches ;
4. associe chaque élément Revit à la barre la plus proche, à 20 cm près ;
5. écrit le numéro dans le paramètre **Repère**, étiquetable sur les plans et disponible en nomenclature.

Un mode simulation lance le traitement sans rien écrire et affiche le rapport : barres lues, éléments trouvés, correspondances et translation calculée.

## Résultat

Sur un projet de 77 barres, 72 éléments Revit ont été numérotés en un seul lancement. Les éléments sans correspondance gardent un Repère vide, ce qui les signale d'eux-mêmes en nomenclature.

## Précautions

- **Moteur Python** : sous Dynamo 3 (Revit 2026), le moteur CPython 3 proposé par défaut ne communique pas avec l'interface de programmation de Robot. Il faut installer le moteur IronPython 2 (paquet `DynamoIronPython2.7`) et le sélectionner sur le nœud.
- **Robot ouvert**, modèle chargé : le script se connecte à la session en cours.
- **Poteaux** : Revit les positionne par un point dont l'altitude n'est pas celle du milieu du poteau. Le script la recalcule à partir des niveaux et des décalages de base et de tête.
- **Unités** : Revit travaille en pieds en interne, Robot en mètres. La conversion est intégrée au script.

## Obtenir le script

Le script est disponible sur demande par courriel : [bimaghreb@outlook.com](mailto:bimaghreb@outlook.com?subject=Script%20num%C3%A9ros%20de%20barres%20Robot%20vers%20Revit).

> **Versions testées** : Revit 2026 et Robot Structural Analysis 2026.
