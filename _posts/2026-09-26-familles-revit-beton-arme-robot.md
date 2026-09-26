---
title: "Poteaux et poutres en béton armé : des familles Revit prêtes pour Robot"
description: "Une bibliothèque de familles paramétriques de poteaux et de poutres en béton armé, conçues pour passer de Revit à Robot Structural Analysis sans ressaisie."
date: 2026-09-26 09:00:00 +0100
---

Entre Revit et Robot Structural Analysis, les poteaux et les poutres en béton armé ne font pas toujours le trajet intacts. Trois défauts reviennent d'un projet à l'autre :

- **des propriétés analytiques perdues** à la conversion, inerties et rigidités en tête ;
- **des paramètres à ressaisir** à la main dans Robot, élément par élément ;
- **des liaisons mal interprétées** entre les éléments.

Une partie de ces difficultés se règle en amont, dès la modélisation, avec des familles pensées pour l'échange. C'est l'objet de la bibliothèque proposée ici.

## La bibliothèque

Des familles paramétriques de poteaux et de poutres en béton armé, préconfigurées pour Robot Structural Analysis et utilisables telles quelles. Elles sont fournies au format `.rfa`, réunies dans une archive `.rar`.

[Télécharger la bibliothèque (FAMILLES-BA.rar)](https://drive.google.com/file/d/1YVq7gOMjg-mBlQVdNsN5nqHbw0RWJPUK/view){: .btn .btn-primary}

> **Versions testées** : Revit 2025 et Robot Structural Analysis 2025. Sur une version antérieure, vérifier les familles avant de les utiliser en production.

## Installation

1. Télécharger l'archive et l'extraire dans la bibliothèque de familles de Revit. Un fichier `.rar` s'ouvre avec 7‑Zip, gratuit, ou avec WinRAR.
2. Charger les familles dans le projet : onglet **Insérer**, commande **Charger la famille**.
3. Avant la première utilisation, contrôler les paramètres, en particulier les unités.
