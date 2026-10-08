---
title: "Reinforced concrete columns and beams: Revit families ready for Robot"
description: "A library of parametric reinforced concrete column and beam families, designed to go from Revit to Robot Structural Analysis without re-entering data."
date: 2026-09-26 09:00:00 +0100
---

Between Revit and Robot Structural Analysis, reinforced concrete columns and beams do not always make the trip intact. Three problems come up from one project to the next:

- **analytical properties lost** in the conversion, starting with second moments of area and stiffnesses;
- **parameters to re-enter** by hand in Robot, element by element;
- **connections misinterpreted** between elements.

Some of these difficulties can be solved upstream, at the modelling stage, with families designed for the exchange. That is the purpose of the library offered here.

## The library

Parametric reinforced concrete column and beam families, preconfigured for Robot Structural Analysis and ready to use as they are. They are supplied as `.rfa` files, grouped in a `.rar` archive.

[Download the library (FAMILLES-BA.rar)](https://drive.google.com/file/d/1YVq7gOMjg-mBlQVdNsN5nqHbw0RWJPUK/view){: .btn .btn-primary}

> **Tested versions**: Revit 2025 and Robot Structural Analysis 2025. The families require Revit 2025 or later; on a newer version, check them before using them in production.

## Installation

1. Download the archive and extract it into your Revit family library. A `.rar` file opens with 7‑Zip, which is free, or with WinRAR.
2. Load the families into the project: **Insert** tab, **Load Family** command.
3. Before first use, check the parameters, especially the units.
