/* Calculateur RDM — BIMaghreb
 *
 * FICHIER GENERE par faire_calculateur.py — ne pas modifier ici.
 * Les formules sont transposees mecaniquement depuis les modules Python
 * de la bibliotheque, les libelles et unites sont lus dans leurs fiches.
 * Toute correction se fait dans le module Python, puis on regenere.
 */
'use strict';

const CALCULS_RDM = {
  "rdm_poutres_poutre_rotule_rotule_charge_repartie": {
    groupe: "Poutres",
    court: "Bi-articulée · charge répartie",
    titre: "Poutre bi-articulée sous charge répartie",
    entrees: [
      { cle: "e", libelle: "Module d'élasticité longitudinale : E", symbole: "E", unite: "GPa", defaut: "210", min: 0.0, max: null },
      { cle: "i", libelle: "Moment d'inertie de flexion de la section transversale : I", symbole: "I", unite: "cm^4", defaut: "3831", min: 0.0, max: null },
      { cle: "l", libelle: "Portée de calcul : L", symbole: "L", unite: "cm", defaut: "320", min: 0.0, max: null },
      { cle: "q", libelle: "Charge répartie : q", symbole: "q", unite: "kN/m", defaut: "46.45", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "delta_max", libelle: "Flèche maximale : δ_max", symbole: "δ_max", unite: "mm", decimales: 1 },
      { cle: "m_min", libelle: "Moment fléchissant minimal : M_min", symbole: "M_min", unite: "kN.m", decimales: 2 },
      { cle: "v_max", libelle: "Effort tranchant maximal : V_max", symbole: "V_max", unite: "kN", decimales: 2 },
      { cle: "v_min", libelle: "Effort tranchant minimal : V_min", symbole: "V_min", unite: "kN", decimales: 2 }
    ],
    calcule: function (saisie) {
      let E, I, L, q, delta_max, m_min, v_max, v_min;
      E = saisie.e;
      I = saisie.i;
      L = saisie.l;
      q = saisie.q;
      delta_max = 0.001 * 5 * q * Math.pow(L, 4) / (384 * E * I);
      m_min = -0.0001 * q * Math.pow(L, 2) / 8;
      v_max = 0.01 * q * L / 2;
      v_min = -0.01 * q * L / 2;
      return { delta_max: delta_max, m_min: m_min, v_max: v_max, v_min: v_min };
    }
  },
  "rdm_poutres_poutre_rotule_rotule_charge_ponctuelle": {
    groupe: "Poutres",
    court: "Bi-articulée · charge ponctuelle",
    titre: "Poutre bi-articulée sous charge ponctuelle",
    entrees: [
      { cle: "e", libelle: "Module d'élasticité longitudinale : E", symbole: "E", unite: "GPa", defaut: "210", min: 0.0, max: null },
      { cle: "i", libelle: "Moment d'inertie de flexion de la section transversale : I", symbole: "I", unite: "cm^4", defaut: "3831", min: 0.0, max: null },
      { cle: "l", libelle: "Portée de calcul : L", symbole: "L", unite: "cm", defaut: "320", min: 0.0, max: null },
      { cle: "alpha", libelle: "Position de la charge ponctuelle : α", symbole: "α", unite: "cm", defaut: "240", min: 0.0, max: null },
      { cle: "p", libelle: "Charge ponctuelle : P", symbole: "P", unite: "kN", defaut: "148.64", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "delta_max", libelle: "Flèche maximale : δ_max", symbole: "δ_max", unite: "mm", decimales: 1 },
      { cle: "m_min", libelle: "Moment fléchissant minimal : M_min", symbole: "M_min", unite: "kN.m", decimales: 2 },
      { cle: "v_max", libelle: "Effort tranchant maximal : V_max", symbole: "V_max", unite: "kN", decimales: 2 },
      { cle: "v_min", libelle: "Effort tranchant minimal : V_min", symbole: "V_min", unite: "kN", decimales: 2 }
    ],
    calcule: function (saisie) {
      let ee, i, l, alpha, p, delta_max, m_min, v_max, v_min;
      ee = saisie.e;
      i = saisie.i;
      l = saisie.l;
      alpha = saisie.alpha;
      p = saisie.p;
      if (alpha < l / 2) {
        delta_max = 0.1 * (p * alpha / (27 * ee * i * l)) * Math.sqrt( 3 * Math.pow(Math.pow(l, 2) - Math.pow(alpha, 2), 3));
      } else {
        delta_max = 0.1 * (p * (l - alpha) / (27 * ee * i * l)) * Math.sqrt( 3 * Math.pow(alpha * (2 * l - alpha), 3));
      }
      m_min = -0.01 * p * alpha * (l - alpha) / l;
      v_max = p * (1 - alpha / l);
      v_min = -p * alpha / l;
      return { delta_max: delta_max, m_min: m_min, v_max: v_max, v_min: v_min };
    }
  },
  "rdm_poutres_poutre_encastrement_rotule_charge_repartie": {
    groupe: "Poutres",
    court: "Encastrée-articulée · répartie",
    titre: "Poutre encastrée-articulée sous charge répartie",
    entrees: [
      { cle: "e", libelle: "Module d'élasticité longitudinale : E", symbole: "E", unite: "GPa", defaut: "210", min: 0.0, max: null },
      { cle: "i", libelle: "Moment d'inertie de flexion de la section transversale : I", symbole: "I", unite: "cm^4", defaut: "3831", min: 0.0, max: null },
      { cle: "l", libelle: "Portée de calcul : L", symbole: "L", unite: "cm", defaut: "320", min: 0.0, max: null },
      { cle: "q", libelle: "Charge répartie : q", symbole: "q", unite: "kN/m", defaut: "46.45", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "delta_max", libelle: "Flèche maximale : δ_max", symbole: "δ_max", unite: "mm", decimales: 1 },
      { cle: "m_max", libelle: "Moment fléchissant maximal : M_max", symbole: "M_max", unite: "kN.m", decimales: 2 },
      { cle: "m_min", libelle: "Moment fléchissant minimal : M_min", symbole: "M_min", unite: "kN.m", decimales: 2 },
      { cle: "v_max", libelle: "Effort tranchant maximal : V_max", symbole: "V_max", unite: "kN", decimales: 2 },
      { cle: "v_min", libelle: "Effort tranchant minimal : V_min", symbole: "V_min", unite: "kN", decimales: 2 }
    ],
    calcule: function (saisie) {
      let ee, i, l, q, delta_max, m_max, m_min, v_max, v_min;
      ee = saisie.e;
      i = saisie.i;
      l = saisie.l;
      q = saisie.q;
      delta_max = 0.001 * q * Math.pow(l, 4) / (185 * ee * i);
      m_max = 0.0001 * q * Math.pow(l, 2) / 8;
      m_min = -0.0001 * 9 * q * Math.pow(l, 2) / 128;
      v_max = 0.01 * 5 * q * l / 8;
      v_min = -0.01 * 3 * q * l / 8;
      return { delta_max: delta_max, m_max: m_max, m_min: m_min, v_max: v_max, v_min: v_min };
    }
  },
  "rdm_poutres_poutre_encastrement_rotule_charge_ponctuelle": {
    groupe: "Poutres",
    court: "Encastrée-articulée · ponctuelle",
    titre: "Poutre encastrée-articulée sous charge ponctuelle",
    entrees: [
      { cle: "e", libelle: "Module d'élasticité longitudinale : E", symbole: "E", unite: "GPa", defaut: "210", min: 0.0, max: null },
      { cle: "i", libelle: "Moment d'inertie de flexion de la section transversale : I", symbole: "I", unite: "cm^4", defaut: "3831", min: 0.0, max: null },
      { cle: "l", libelle: "Portée de calcul : L", symbole: "L", unite: "cm", defaut: "320", min: 0.0, max: null },
      { cle: "alpha", libelle: "Position de la charge ponctuelle : α", symbole: "α", unite: "cm", defaut: "240", min: 0.0, max: null },
      { cle: "p", libelle: "Charge ponctuelle : P", symbole: "P", unite: "kN", defaut: "148.64", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "delta_max", libelle: "Flèche maximale : δ_max", symbole: "δ_max", unite: "mm", decimales: 1 },
      { cle: "m_max", libelle: "Moment fléchissant maximal : M_max", symbole: "M_max", unite: "kN.m", decimales: 2 },
      { cle: "m_min", libelle: "Moment fléchissant minimal : M_min", symbole: "M_min", unite: "kN.m", decimales: 2 },
      { cle: "v_max", libelle: "Effort tranchant maximal : V_max", symbole: "V_max", unite: "kN", decimales: 2 },
      { cle: "v_min", libelle: "Effort tranchant minimal : V_min", symbole: "V_min", unite: "kN", decimales: 2 }
    ],
    calcule: function (saisie) {
      let ee, i, l, alpha, p, delta_max, m_max, m_min, v_max, v_min;
      ee = saisie.e;
      i = saisie.i;
      l = saisie.l;
      alpha = saisie.alpha;
      p = saisie.p;
      if (alpha < 0.586 * l) {
        delta_max = 0.1 * (p * (l - alpha) * Math.pow( 2 * l * alpha - Math.pow(alpha, 2), 3)) / ( 3 * ee * i * Math.pow( 2 * Math.pow(l, 2) + 2 * l * alpha - Math.pow(alpha, 2), 2));
      } else {
        delta_max = 0.1 * ( p * (l - alpha) * Math.pow(alpha, 2) / (6 * ee * i)) * Math.sqrt( (l - alpha) / (3 * l - alpha));
      }
      m_max = 0.01 * (p * (l - alpha) * ( 2 * l * alpha - Math.pow(alpha, 2))) / (2 * Math.pow(l, 2));
      m_min = -0.01 * (p * Math.pow(alpha, 2) * (l - alpha) * ( 3 * l - alpha)) / (2 * Math.pow(l, 3));
      v_max = p * (l - alpha) * ( 2 * Math.pow(l, 2) + 2 * l * alpha - Math.pow(alpha, 2)) / (2 * Math.pow(l, 3));
      v_min = -(p * Math.pow(alpha, 2) * (3 * l - alpha)) / (2 * Math.pow(l, 3));
      return { delta_max: delta_max, m_max: m_max, m_min: m_min, v_max: v_max, v_min: v_min };
    }
  },
  "rdm_poutres_poutre_encastrement_encastrement_charge_repartie": {
    groupe: "Poutres",
    court: "Bi-encastrée · charge répartie",
    titre: "Poutre bi-encastrée sous charge répartie",
    entrees: [
      { cle: "e", libelle: "Module d'élasticité longitudinale : E", symbole: "E", unite: "GPa", defaut: "210", min: 0.0, max: null },
      { cle: "i", libelle: "Moment d'inertie de flexion de la section transversale : I", symbole: "I", unite: "cm^4", defaut: "3831", min: 0.0, max: null },
      { cle: "l", libelle: "Portée de calcul : L", symbole: "L", unite: "cm", defaut: "320", min: 0.0, max: null },
      { cle: "q", libelle: "Charge répartie : q", symbole: "q", unite: "kN/m", defaut: "46.45", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "delta_max", libelle: "Flèche maximale : δ_max", symbole: "δ_max", unite: "mm", decimales: 1 },
      { cle: "m_max", libelle: "Moment fléchissant maximal : M_max", symbole: "M_max", unite: "kN.m", decimales: 2 },
      { cle: "m_min", libelle: "Moment fléchissant minimal : M_min", symbole: "M_min", unite: "kN.m", decimales: 2 },
      { cle: "v_max", libelle: "Effort tranchant maximal : V_max", symbole: "V_max", unite: "kN", decimales: 2 },
      { cle: "v_min", libelle: "Effort tranchant minimal : V_min", symbole: "V_min", unite: "kN", decimales: 2 }
    ],
    calcule: function (saisie) {
      let module_e, i_maj, portee, q, delta_max, m_max, m_min, v_max, v_min;
      module_e = saisie.e;
      i_maj = saisie.i;
      portee = saisie.l;
      q = saisie.q;
      delta_max = 0.001 * q * Math.pow(portee, 4) / (384 * module_e * i_maj);
      m_max = 0.0001 * q * Math.pow(portee, 2) / 12;
      m_min = -0.0001 * q * Math.pow(portee, 2) / 24;
      v_max = 0.01 * q * portee / 2;
      v_min = -0.01 * q * portee / 2;
      return { delta_max: delta_max, m_max: m_max, m_min: m_min, v_max: v_max, v_min: v_min };
    }
  },
  "rdm_poutres_poutre_encastrement_encastrement_charge_ponctuelle": {
    groupe: "Poutres",
    court: "Bi-encastrée · charge ponctuelle",
    titre: "Poutre bi-encastrée sous charge ponctuelle",
    entrees: [
      { cle: "e", libelle: "Module d'élasticité longitudinale : E", symbole: "E", unite: "GPa", defaut: "210", min: 0.0, max: null },
      { cle: "i", libelle: "Moment d'inertie de flexion de la section transversale : I", symbole: "I", unite: "cm^4", defaut: "3831", min: 0.0, max: null },
      { cle: "l", libelle: "Portée de calcul : L", symbole: "L", unite: "cm", defaut: "320", min: 0.0, max: null },
      { cle: "alpha", libelle: "Position de la charge ponctuelle : α", symbole: "α", unite: "cm", defaut: "240", min: 0.0, max: null },
      { cle: "p", libelle: "Charge ponctuelle : P", symbole: "P", unite: "kN", defaut: "148.64", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "delta_max", libelle: "Flèche maximale : δ_max", symbole: "δ_max", unite: "mm", decimales: 1 },
      { cle: "m_max", libelle: "Moment fléchissant maximal : M_max", symbole: "M_max", unite: "kN.m", decimales: 2 },
      { cle: "m_min", libelle: "Moment fléchissant minimal : M_min", symbole: "M_min", unite: "kN.m", decimales: 2 },
      { cle: "v_max", libelle: "Effort tranchant maximal : V_max", symbole: "V_max", unite: "kN", decimales: 2 },
      { cle: "v_min", libelle: "Effort tranchant minimal : V_min", symbole: "V_min", unite: "kN", decimales: 2 }
    ],
    calcule: function (saisie) {
      let ee, i, l, alpha, p, delta_max, m_max, m_min, v_max, v_min;
      ee = saisie.e;
      i = saisie.i;
      l = saisie.l;
      alpha = saisie.alpha;
      p = saisie.p;
      delta_max = 0.1 * (2 * p * Math.pow(alpha, 3) * Math.pow(l - alpha, 2)) / ( 3 * ee * i * Math.pow(l + 2 * alpha, 2));
      if (alpha < l / 2) {
        m_max = 0.01 * (p * alpha * Math.pow(l - alpha, 2)) / Math.pow(l, 2);
      } else {
        m_max = 0.01 * (p * Math.pow(alpha, 2) * (l - alpha)) / Math.pow(l, 2);
      }
      m_min = -0.01 * (2 * p * Math.pow(alpha, 2) * Math.pow(l - alpha, 2)) / Math.pow(l, 3);
      v_max = p * Math.pow(l - alpha, 2) * (l + 2 * alpha) / Math.pow(l, 3);
      v_min = -(p * Math.pow(alpha, 2) * (3 * l - 2 * alpha)) / Math.pow(l, 3);
      return { delta_max: delta_max, m_max: m_max, m_min: m_min, v_max: v_max, v_min: v_min };
    }
  },
  "rdm_poutres_poutre_encastrement_libre_charge_repartie": {
    groupe: "Poutres",
    court: "Console · charge répartie",
    titre: "Poutre console sous charge répartie",
    entrees: [
      { cle: "e", libelle: "Module d'élasticité longitudinale : E", symbole: "E", unite: "GPa", defaut: "210", min: 0.0, max: null },
      { cle: "i", libelle: "Moment d'inertie de flexion de la section transversale : I", symbole: "I", unite: "cm^4", defaut: "16270", min: 0.0, max: null },
      { cle: "l", libelle: "Portée de calcul : L", symbole: "L", unite: "cm", defaut: "320", min: 0.0, max: null },
      { cle: "q", libelle: "Charge répartie : q", symbole: "q", unite: "kN/m", defaut: "46.45", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "delta_max", libelle: "Flèche maximale : δ_max", symbole: "δ_max", unite: "mm", decimales: 1 },
      { cle: "m_max", libelle: "Moment fléchissant maximal : M_max", symbole: "M_max", unite: "kN.m", decimales: 2 },
      { cle: "v_max", libelle: "Effort tranchant maximal : V_max", symbole: "V_max", unite: "kN", decimales: 2 }
    ],
    calcule: function (saisie) {
      let ee, i, l, q, delta_max, m_max, v_max;
      ee = saisie.e;
      i = saisie.i;
      l = saisie.l;
      q = saisie.q;
      delta_max = 0.001 * q * Math.pow(l, 4) / (8 * ee * i);
      m_max = 0.0001 * q * Math.pow(l, 2) / 2;
      v_max = 0.01 * q * l;
      return { delta_max: delta_max, m_max: m_max, v_max: v_max };
    }
  },
  "rdm_poutres_poutre_encastrement_libre_charge_ponctuelle": {
    groupe: "Poutres",
    court: "Console · charge ponctuelle",
    titre: "Poutre console sous charge ponctuelle",
    entrees: [
      { cle: "e", libelle: "Module d'élasticité longitudinale : E", symbole: "E", unite: "GPa", defaut: "210", min: 0.0, max: null },
      { cle: "i", libelle: "Moment d'inertie de flexion de la section transversale : I", symbole: "I", unite: "cm^4", defaut: "16270", min: 0.0, max: null },
      { cle: "l", libelle: "Portée de calcul : L", symbole: "L", unite: "cm", defaut: "320", min: 0.0, max: null },
      { cle: "alpha", libelle: "Position de la charge ponctuelle : α", symbole: "α", unite: "cm", defaut: "240", min: 0.0, max: null },
      { cle: "p", libelle: "Charge ponctuelle : P", symbole: "P", unite: "kN", defaut: "148.64", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "delta_max", libelle: "Flèche maximale : δ_max", symbole: "δ_max", unite: "mm", decimales: 1 },
      { cle: "m_max", libelle: "Moment fléchissant maximal : M_max", symbole: "M_max", unite: "kN.m", decimales: 2 },
      { cle: "v_max", libelle: "Effort tranchant maximal : V_max", symbole: "V_max", unite: "kN", decimales: 2 }
    ],
    calcule: function (saisie) {
      let ee, i, l, alpha, p, delta_max, m_max, v_max;
      ee = saisie.e;
      i = saisie.i;
      l = saisie.l;
      alpha = saisie.alpha;
      p = saisie.p;
      delta_max = 0.1 * (p / (6 * ee * i)) * Math.pow(alpha, 2) * (3 * l - alpha);
      m_max = 0.01 * p * alpha;
      v_max = p;
      return { delta_max: delta_max, m_max: m_max, v_max: v_max };
    }
  },
  "rdm_sections_section_rectangulaire": {
    groupe: "Sections",
    court: "Rectangle plein",
    titre: "Section rectangulaire pleine",
    entrees: [
      { cle: "h", libelle: "Hauteur de la section : h", symbole: "h", unite: "mm", defaut: "80", min: 0.0, max: null },
      { cle: "b", libelle: "Largeur de la section : b", symbole: "b", unite: "mm", defaut: "50", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "a", libelle: "Aire de la section : A", symbole: "A", unite: "cm²", decimales: 2 },
      { cle: "iy", libelle: "Moment d'inertie de flexion par rapport à l'axe y-y : I_y", symbole: "I_y", unite: "cm^4", decimales: 2 },
      { cle: "iz", libelle: "Moment d'inertie de flexion par rapport à l'axe z-z : I_z", symbole: "I_z", unite: "cm^4", decimales: 2 },
      { cle: "wely", libelle: "Module élastique de flexion par rapport à l'axe y-y : W_el,y", symbole: "W_el,y", unite: "cm³", decimales: 2 },
      { cle: "welz", libelle: "Module élastique de flexion par rapport à l'axe z-z : W_el,z", symbole: "W_el,z", unite: "cm³", decimales: 2 },
      { cle: "wply", libelle: "Module plastique de flexion par rapport à l'axe y-y : W_pl,y", symbole: "W_pl,y", unite: "cm³", decimales: 2 },
      { cle: "wplz", libelle: "Module plastique de flexion par rapport à l'axe z-z : W_pl,z", symbole: "W_pl,z", unite: "cm³", decimales: 2 },
      { cle: "av", libelle: "Aire de cisaillement : A_v", symbole: "A_v", unite: "cm²", decimales: 2 }
    ],
    calcule: function (saisie) {
      let h, b, a, iy, iz, wely, welz, wply, wplz, av;
      h = saisie.h;
      b = saisie.b;
      a = 0.01 * b * h;
      iy = 0.0001 * b * Math.pow(h, 3) / 12;
      iz = 0.0001 * h * Math.pow(b, 3) / 12;
      wely = 0.001 * b * Math.pow(h, 2) / 6;
      welz = 0.001 * h * Math.pow(b, 2) / 6;
      wply = 0.001 * b * Math.pow(h, 2) / 4;
      wplz = 0.001 * h * Math.pow(b, 2) / 4;
      av = 0.01 * b * h;
      return { a: a, iy: iy, iz: iz, wely: wely, welz: welz, wply: wply, wplz: wplz, av: av };
    }
  },
  "rdm_sections_section_circulaire": {
    groupe: "Sections",
    court: "Rond plein",
    titre: "Section circulaire pleine",
    entrees: [
      { cle: "d", libelle: "Diamètre : d", symbole: "d", unite: "mm", defaut: "55", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "a", libelle: "Aire de la section : A", symbole: "A", unite: "cm²", decimales: 2 },
      { cle: "i", libelle: "Moment d'inertie de flexion : I", symbole: "I", unite: "cm^4", decimales: 2 },
      { cle: "wel", libelle: "Module élastique de flexion : W_el", symbole: "W_el", unite: "cm³", decimales: 2 },
      { cle: "wpl", libelle: "Module plastique de flexion : W_pl", symbole: "W_pl", unite: "cm³", decimales: 2 },
      { cle: "av", libelle: "Aire de cisaillement : A_v", symbole: "A_v", unite: "cm²", decimales: 2 }
    ],
    calcule: function (saisie) {
      let d, a, i, wel, wpl, av;
      d = saisie.d;
      a = 0.01 * Math.PI * Math.pow(d, 2) / 4;
      i = 0.0001 * Math.PI * Math.pow(d, 4) / 64;
      wel = 0.001 * Math.PI * Math.pow(d, 3) / 32;
      wpl = 0.001 * Math.pow(d, 3) / 6;
      av = 2 * a / Math.PI;
      return { a: a, i: i, wel: wel, wpl: wpl, av: av };
    }
  },
  "rdm_sections_section_I": {
    groupe: "Sections",
    court: "Profil en I",
    titre: "Profil en I",
    entrees: [
      { cle: "h", libelle: "Hauteur de la section : h", symbole: "h", unite: "mm", defaut: "200", min: 0.0, max: null },
      { cle: "b", libelle: "Largeur de la section : b", symbole: "b", unite: "mm", defaut: "100", min: 0.0, max: null },
      { cle: "tw", libelle: "Épaisseur d'âme : t_w", symbole: "t_w", unite: "mm", defaut: "5.6", min: 0.0, max: null },
      { cle: "tf", libelle: "Épaisseur de semelle : t_f", symbole: "t_f", unite: "mm", defaut: "8.5", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "a", libelle: "Aire de la section : A", symbole: "A", unite: "cm²", decimales: 2 },
      { cle: "iy", libelle: "Moment d'inertie de flexion par rapport à l'axe y-y : I_y", symbole: "I_y", unite: "cm^4", decimales: 2 },
      { cle: "iz", libelle: "Moment d'inertie de flexion par rapport à l'axe z-z : I_z", symbole: "I_z", unite: "cm^4", decimales: 2 },
      { cle: "wely", libelle: "Module élastique de flexion par rapport à l'axe y-y : W_el,y", symbole: "W_el,y", unite: "cm³", decimales: 2 },
      { cle: "welz", libelle: "Module élastique de flexion par rapport à l'axe z-z : W_el,z", symbole: "W_el,z", unite: "cm³", decimales: 2 },
      { cle: "wply", libelle: "Module plastique de flexion par rapport à l'axe y-y : W_pl,y", symbole: "W_pl,y", unite: "cm³", decimales: 2 },
      { cle: "wplz", libelle: "Module plastique de flexion par rapport à l'axe z-z : W_pl,z", symbole: "W_pl,z", unite: "cm³", decimales: 2 },
      { cle: "avy", libelle: "Aire de cisaillement le long de l'axe y-y : A_v,y", symbole: "A_v,y", unite: "cm²", decimales: 2 },
      { cle: "avz", libelle: "Aire de cisaillement le long de l'axe z-z : A_v,z", symbole: "A_v,z", unite: "cm²", decimales: 2 }
    ],
    calcule: function (saisie) {
      let h, b, tw, tf, a, iy, iz, wely, welz, wply, wplz, avy, avz;
      h = saisie.h;
      b = saisie.b;
      tw = saisie.tw;
      tf = saisie.tf;
      a = (2 * b * tf + (h - 2 * tf) * tw) * 0.01;
      iy = (b * Math.pow(h, 3) / 12 - (b - tw) * Math.pow(h - 2 * tf, 3) / 12) * 0.0001;
      iz = (tf * Math.pow(b, 3) / 6 + (h - 2 * tf) * Math.pow(tw, 3) / 12) * 0.0001;
      wely = 20 * iy / h;
      welz = 20 * iz / b;
      wply = (b * Math.pow(h, 2) / 4 - (b - tw) * Math.pow(h - 2 * tf, 2) / 4) * 0.001;
      wplz = (tf * Math.pow(b, 2) / 2 + (h - 2 * tf) * Math.pow(tw, 2) / 4) * 0.001;
      avy = 0.02 * b * tf;
      avz = 0.01 * (h - 2 * tf) * tw;
      return { a: a, iy: iy, iz: iz, wely: wely, welz: welz, wply: wply, wplz: wplz, avy: avy, avz: avz };
    }
  },
  "rdm_sections_section_U": {
    groupe: "Sections",
    court: "Profil en U",
    titre: "Profil en U",
    entrees: [
      { cle: "h", libelle: "Hauteur de la section : h", symbole: "h", unite: "mm", defaut: "200", min: 0.0, max: null },
      { cle: "b", libelle: "Largeur de la section : b", symbole: "b", unite: "mm", defaut: "80", min: 0.0, max: null },
      { cle: "tw", libelle: "Épaisseur d'âme : t_w", symbole: "t_w", unite: "mm", defaut: "6", min: 0.0, max: null },
      { cle: "tf", libelle: "Épaisseur de semelle : t_f", symbole: "t_f", unite: "mm", defaut: "11", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "a", libelle: "Aire de la section : A", symbole: "A", unite: "cm²", decimales: 2 },
      { cle: "iy", libelle: "Moment d'inertie de flexion par rapport à l'axe y-y : I_y", symbole: "I_y", unite: "cm^4", decimales: 2 },
      { cle: "iz", libelle: "Moment d'inertie de flexion par rapport à l'axe z-z : I_z", symbole: "I_z", unite: "cm^4", decimales: 2 },
      { cle: "wely", libelle: "Module élastique de flexion par rapport à l'axe y-y : W_el,y", symbole: "W_el,y", unite: "cm³", decimales: 2 },
      { cle: "welz", libelle: "Module élastique de flexion par rapport à l'axe z-z : W_el,z", symbole: "W_el,z", unite: "cm³", decimales: 2 },
      { cle: "wply", libelle: "Module plastique de flexion par rapport à l'axe y-y : W_pl,y", symbole: "W_pl,y", unite: "cm³", decimales: 2 },
      { cle: "wplz", libelle: "Module plastique de flexion par rapport à l'axe z-z : W_pl,z", symbole: "W_pl,z", unite: "cm³", decimales: 2 },
      { cle: "avy", libelle: "Aire de cisaillement le long de l'axe y-y : A_v,y", symbole: "A_v,y", unite: "cm²", decimales: 2 },
      { cle: "avz", libelle: "Aire de cisaillement le long de l'axe z-z : A_v,z", symbole: "A_v,z", unite: "cm²", decimales: 2 }
    ],
    calcule: function (saisie) {
      let h, b, tw, tf, a, iy, s, iz, wely, welz, wply, wplz, avy, avz;
      h = saisie.h;
      b = saisie.b;
      tw = saisie.tw;
      tf = saisie.tf;
      a = (2 * b * tf + (h - 2 * tf) * tw) * 0.01;
      iy = (b * Math.pow(h, 3) / 12 - (b - tw) * Math.pow(h - 2 * tf, 3) / 12) * 0.0001;
      s = (h - 2 * tf) * Math.pow(tw, 2) / 2 + tf * Math.pow(b, 2);
      iz = ((h - 2 * tf) * Math.pow(tw, 3) / 3 + 2 * tf * Math.pow(b, 3) / 3 - 0.01 / a * Math.pow(s, 2)) * 0.0001;
      wely = 20 * iy / h;
      welz = 10 * (iz / (b - 0.01 / a * s));
      wply = (b * Math.pow(h, 2) / 4 - (b - tw) * Math.pow(h - 2 * tf, 2) / 4) * 0.001;
      if (tw <= 100 * a / (2 * h)) {
        wplz = (tf * Math.pow(b - tw, 2) / 2 + b * h * tw / 2 - Math.pow(h, 2) * Math.pow(tw, 2) / (8 * tf)) * 0.001;
      } else {
        wplz = 0.001 / (4 * h) * ( 4 * tf * Math.pow(b, 2) * (h - tf) + Math.pow(tw, 2) * (Math.pow(h, 2) - 4 * Math.pow(tf, 2)) - 4 * b * tf * (h - 2 * tf) * tw);
      }
      avy = 0.02 * b * tf;
      avz = 0.01 * (h - 2 * tf) * tw;
      return { a: a, iy: iy, iz: iz, wely: wely, welz: welz, wply: wply, wplz: wplz, avy: avy, avz: avz };
    }
  },
  "rdm_sections_tube_rectangulaire": {
    groupe: "Sections",
    court: "Tube rectangulaire",
    titre: "Tube rectangulaire",
    entrees: [
      { cle: "h", libelle: "Hauteur de la section : h", symbole: "h", unite: "mm", defaut: "200", min: 0.0, max: null },
      { cle: "b", libelle: "Largeur de la section : b", symbole: "b", unite: "mm", defaut: "100", min: 0.0, max: null },
      { cle: "t", libelle: "Épaisseur : t", symbole: "t", unite: "mm", defaut: "6", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "a", libelle: "Aire de la section : A", symbole: "A", unite: "cm²", decimales: 2 },
      { cle: "iy", libelle: "Moment d'inertie de flexion par rapport à l'axe y-y : I_y", symbole: "I_y", unite: "cm^4", decimales: 2 },
      { cle: "iz", libelle: "Moment d'inertie de flexion par rapport à l'axe z-z : I_z", symbole: "I_z", unite: "cm^4", decimales: 2 },
      { cle: "wely", libelle: "Module élastique de flexion par rapport à l'axe y-y : W_el,y", symbole: "W_el,y", unite: "cm³", decimales: 2 },
      { cle: "welz", libelle: "Module élastique de flexion par rapport à l'axe z-z : W_el,z", symbole: "W_el,z", unite: "cm³", decimales: 2 },
      { cle: "wply", libelle: "Module plastique de flexion par rapport à l'axe y-y : W_pl,y", symbole: "W_pl,y", unite: "cm³", decimales: 2 },
      { cle: "wplz", libelle: "Module plastique de flexion par rapport à l'axe z-z : W_pl,z", symbole: "W_pl,z", unite: "cm³", decimales: 2 },
      { cle: "avy", libelle: "Aire de cisaillement le long de l'axe y-y : A_v,y", symbole: "A_v,y", unite: "cm²", decimales: 2 },
      { cle: "avz", libelle: "Aire de cisaillement le long de l'axe z-z : A_v,z", symbole: "A_v,z", unite: "cm²", decimales: 2 }
    ],
    calcule: function (saisie) {
      let h, b, t, a, iy, iz, wely, welz, wply, wplz, avy, avz;
      h = saisie.h;
      b = saisie.b;
      t = saisie.t;
      a = (b * h - (b - 2 * t) * (h - 2 * t)) * 0.01;
      iy = (b * Math.pow(h, 3) / 12 - (b - 2 * t) * Math.pow(h - 2 * t, 3) / 12) * 0.0001;
      iz = (h * Math.pow(b, 3) / 12 - (h - 2 * t) * Math.pow(b - 2 * t, 3) / 12) * 0.0001;
      wely = 20 * iy / h;
      welz = 20 * iz / b;
      wply = (b * Math.pow(h, 2) / 4 - (b - 2 * t) * Math.pow(h - 2 * t, 2) / 4) * 0.001;
      wplz = (h * Math.pow(b, 2) / 4 - (h - 2 * t) * Math.pow(b - 2 * t, 2) / 4) * 0.001;
      avy = 0.02 * b * t;
      avz = 0.02 * h * t;
      return { a: a, iy: iy, iz: iz, wely: wely, welz: welz, wply: wply, wplz: wplz, avy: avy, avz: avz };
    }
  },
  "rdm_sections_tube_circulaire": {
    groupe: "Sections",
    court: "Tube circulaire",
    titre: "Tube circulaire",
    entrees: [
      { cle: "d", libelle: "Diamètre : d", symbole: "d", unite: "mm", defaut: "508", min: 0.0, max: null },
      { cle: "t", libelle: "Épaisseur : t", symbole: "t", unite: "mm", defaut: "6.3", min: 0.0, max: null }
    ],
    sorties: [
      { cle: "a", libelle: "Aire de la section : A", symbole: "A", unite: "cm²", decimales: 2 },
      { cle: "i", libelle: "Moment d'inertie de flexion : I", symbole: "I", unite: "cm^4", decimales: 2 },
      { cle: "wel", libelle: "Module élastique de flexion : W_el", symbole: "W_el", unite: "cm³", decimales: 2 },
      { cle: "wpl", libelle: "Module plastique de flexion : W_pl", symbole: "W_pl", unite: "cm³", decimales: 2 },
      { cle: "av", libelle: "Aire de cisaillement : A_v", symbole: "A_v", unite: "cm²", decimales: 2 }
    ],
    calcule: function (saisie) {
      let d, t, a, i, wel, wpl, av;
      d = saisie.d;
      t = saisie.t;
      a = 0.01 * (Math.PI / 4) * (Math.pow(d, 2) - Math.pow(d - 2 * t, 2));
      i = 0.0001 * (Math.PI / 64) * (Math.pow(d, 4) - Math.pow(d - 2 * t, 4));
      wel = 0.001 * (Math.PI / (32 * d)) * (Math.pow(d, 4) - Math.pow(d - 2 * t, 4));
      wpl = 0.001 * (1 / 6) * (Math.pow(d, 3) - Math.pow(d - 2 * t, 3));
      av = 2 * a / Math.PI;
      return { a: a, i: i, wel: wel, wpl: wpl, av: av };
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CALCULS_RDM;
}
