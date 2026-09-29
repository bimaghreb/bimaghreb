---
title: "Revit analytical model: finding disconnected nodes before export"
description: "Two checks to find and fix disconnected analytical nodes before sending a Revit model for analysis: a view filter, then the error detection of Graitec PowerPack."
date: 2026-09-26 10:00:00 +0100
---

A disconnected analytical node cannot be seen in an ordinary Revit view. It shows up at the analysis stage: bars supported by nothing, instability warnings, results to redo. It is better to find it before the export.

Here are the two checks I use to do so. The screenshots come from the French version of Revit; the commands are in the same place in the English version.

## 1. Make disconnected nodes visible

A view filter colours the unconnected nodes. It is set up in three steps.

**Show the analytical nodes.** In Visibility/Graphic Overrides (shortcut VV), turn on the Analytical Nodes category.

![Visibility/Graphic Overrides: the Analytical Nodes category is turned on](/assets/blog/controle-modele-analytique/01-visibilite-noeuds.png)

**Create the filter.** In the Filters tab: category **Analytical Nodes**, rule **Connection Status equals Unconnected**.

![The “unconnected analytical nodes” filter and its rule](/assets/blog/controle-modele-analytique/02-regle-du-filtre.png)

**Give it a strong colour**, red for example.

![Graphic override of the filter: red lines](/assets/blog/controle-modele-analytique/03-couleur-du-filtre.png)

Disconnected nodes then stand out at once, close up as well as across the whole model.

![A disconnected node, in red, next to the node it should connect to](/assets/blog/controle-modele-analytique/04-noeud-isole.png)

![3D view of the analytical model: disconnected nodes stand out in red](/assets/blog/controle-modele-analytique/05-vue-3d-noeuds.png)

## 2. List the defects with PowerPack

The filter shows the defects; it does not count them. For a complete list, I use the **Detect Errors** command of Graitec PowerPack for Revit. It flags elements that are too close to be distinct, yet are not connected.

![The error detection command in the PowerPack ribbon](/assets/blog/controle-modele-analytique/06-powerpack-ruban.png)

**Set the tolerance.** I set it to 3 cm (0.03 m): any smaller gap between two elements is reported as an error.

![Tolerance set to 0.03 m](/assets/blog/controle-modele-analytique/07-tolerance.png)

**Run the check.** The tool lists the problems, with the IDs of the elements involved.

![List of problems found by the check](/assets/blog/controle-modele-analytique/08-resultats.png)

**Fix them one by one.** Each line can be located in the view. Fix, then run the check again until the list is empty.

![Fixing a reported point, located by a sphere](/assets/blog/controle-modele-analytique/09-correction.png)

![New check: no problems found](/assets/blog/controle-modele-analytique/10-controle-valide.png)

## In short

The filter supports the modelling work; the PowerPack check validates the model before export. Together, they avoid discovering in Robot a defect that is simpler to fix in Revit.
