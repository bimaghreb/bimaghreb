---
title: "Bar numbers: from Robot to Revit, automatically"
description: "A Dynamo script reads the model open in Robot Structural Analysis and writes each bar's number into the Mark parameter of the Revit beams and columns."
date: 2026-09-26 11:00:00 +0100
---

Bars are numbered in Robot Structural Analysis: that numbering organises the calculation report. Formwork drawings and schedules, however, come out of Revit, where each beam and each column must carry the same number. The link between the two programs does not transfer this number. The script presented here takes care of it.

## Why the link is not enough

Revit and Robot each number their elements on their own side, and the link does not expose the mapping it establishes between them. Without a tool, the only option is manual entry: slow, and a source of errors that end up on the drawings.

## The principle: finding each bar by its position

Instead of looking for a common identifier, the script compares geometry. In a single run, from a Python node in Dynamo, it:

1. reads from Robot the number and the two end nodes of each bar;
2. computes the midpoint of each Revit beam and column;
3. aligns the two models, whose origins usually differ by a translation: a first estimate from the centroids of the two point clouds, then successive refinements on the closest pairs;
4. matches each Revit element to the nearest bar, within 20 cm;
5. writes the number into the **Mark** parameter, which can be tagged on drawings and used in schedules.

A simulation mode runs the process without writing anything and displays the report: bars read, elements found, matches and computed translation.

## Result

On a project with 77 bars, 72 Revit elements were numbered in a single run. Elements without a match keep an empty Mark, which flags them automatically in the schedule.

## Precautions

- **Python engine**: in Dynamo 3 (Revit 2026), the default CPython 3 engine cannot communicate with the Robot API. Install the IronPython 2 engine (`DynamoIronPython2.7` package) and select it on the node.
- **Robot open**, with the model loaded: the script connects to the running session.
- **Columns**: Revit locates them by a point whose elevation is not that of the column's midpoint. The script recomputes it from the levels and the base and top offsets.
- **Units**: Revit works internally in feet, Robot in metres. The conversion is built into the script.

## Getting the script

The script is available on request by email: [bimaghreb@outlook.com](mailto:bimaghreb@outlook.com?subject=Robot%20to%20Revit%20bar%20numbers%20script).

> **Tested versions**: Revit 2026 and Robot Structural Analysis 2026.
