/* Interface du calculateur RDM — BIMaghreb
 *
 * Les formules ne sont pas ici : elles vivent dans calculs-rdm.js, transposé
 * depuis la bibliothèque Python. Ce fichier ne fait que présenter les champs,
 * contrôler les saisies et afficher les résultats.
 */
(function () {
  'use strict';

  if (typeof CALCULS_RDM === 'undefined') return;

  var menu = document.getElementById('calc-menu');
  var panneau = document.getElementById('calc-panneau');
  if (!menu || !panneau) return;

  // Langue de la page (<html lang>) : textes, format des nombres, libellés.
  // Les libellés anglais viennent de calculs-rdm.js (libelle_en), fabriqué
  // avec leur traduction par faire_calculateur.py.
  var EN = document.documentElement.lang === 'en';
  var LOCALE = EN ? 'en-GB' : 'fr-FR';
  var T = EN ? {
    donnees: 'Input',
    resultats: 'Results',
    vide: 'Enter a value.',
    nombre: 'Enter a number, for example 12.5.',
    superieur: 'Enter a value greater than ',
    auPlus: 'Enter a value no greater than ',
    completez: 'Complete the input to get the results.',
    echec: 'The calculation fails with these values: check the input.',
    imprimer: 'Print the calculation sheet',
    note: 'Calculation sheet — ',
    pied1: 'Calculated on ',
    pied2: '. For guidance only: it does not replace a check by an engineer.'
  } : {
    donnees: 'Données',
    resultats: 'Résultats',
    vide: 'Saisissez une valeur.',
    nombre: 'Saisissez un nombre, par exemple 12,5.',
    superieur: 'Saisissez une valeur supérieure à ',
    auPlus: 'Saisissez une valeur au plus égale à ',
    completez: 'Complétez les données pour obtenir les résultats.',
    echec: "Le calcul n'aboutit pas avec ces valeurs : vérifiez les données saisies.",
    imprimer: 'Imprimer la note de calcul',
    note: 'Note de calcul — ',
    pied1: 'Calcul effectué sur ',
    pied2: '. Document indicatif : il ne remplace pas la vérification par un ingénieur.'
  };

  function texteLibelle(champ) {
    return EN ? champ.libelle_en : champ.libelle;
  }

  // Les nombres s'écrivent en français : virgule décimale, espace insécable
  // fine pour les milliers. Un point décimal sur une note de calcul française
  // se lit comme une erreur.
  function formate(valeur, decimales) {
    if (typeof valeur !== 'number' || !isFinite(valeur)) return '—';
    // un resultat qui s'arrondit a zero s'affiche 0,00 et non « -0,00 »
    if (Math.abs(valeur) < 0.5 * Math.pow(10, -decimales)) valeur = 0;
    return new Intl.NumberFormat(LOCALE, {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales
    }).format(valeur);
  }

  function elt(balise, classe, texte) {
    var n = document.createElement(balise);
    if (classe) n.className = classe;
    if (texte !== undefined) n.textContent = texte;
    return n;
  }

  /* Les fiches écrivent les symboles en texte brut (« I_y », « W_el,y »,
     « cm^4 ») : on les compose ici comme dans une note de calcul. Une lettre
     reste en italique, un mot en indice (el, pl, max) en romain. */
  var EXPOSANTS = { '2': '\u00b2', '3': '\u00b3', '4': '\u2074' };

  function unite(texte) {
    return texte.replace(/\^([234])/g, function (m, n) { return EXPOSANTS[n]; });
  }

  function morceaux(parent, texte) {
    texte.split(/([A-Za-z\u0370-\u03ff]+)/).forEach(function (bout) {
      if (!bout) return;
      if (/^[A-Za-z\u0370-\u03ff]$/.test(bout)) parent.appendChild(elt('var', null, bout));
      else parent.appendChild(document.createTextNode(bout));
    });
  }

  function libelle(classe, texte) {
    var n = elt('span', classe);
    var m = /^(.*\s?:\s)(\S+)$/.exec(texte);
    if (!m) { n.textContent = texte; return n; }
    // « axe z-z : Iz » : espaces insecables autour du deux-points, pour que
    // « : Iz » ne tombe jamais seul en debut de ligne (audit 07/10/2026)
    n.appendChild(document.createTextNode(m[1].replace(/\s?:\s$/, function (x) {
      return (x.charAt(0) === ':' ? '' : ' ') + ': ';
    })));
    var symbole = elt('span', 'calc-symbole');
    var parts = m[2].split('_');
    morceaux(symbole, parts[0]);
    if (parts[1]) {
      var bas = elt('sub');
      morceaux(bas, parts.slice(1).join('_'));
      symbole.appendChild(bas);
    }
    n.appendChild(symbole);
    return n;
  }

  /* Lecture d'un nombre saisi (07/10/2026). Avant, « 3,831 » sur une page
     anglaise devenait 3,831 au lieu de 3 831 : un résultat 1000 fois faux,
     sans alerte. Règles :
     - espaces (y compris insécables) ignorés : « 3 831 » = 3831 ;
     - en anglais, une virgule suivie de groupes de 3 chiffres sépare les
       milliers (« 3,831 », « 12,500.5 ») ; une virgule isolée ailleurs
       (« 12,5 ») est prise pour une virgule décimale ;
     - en français, la virgule ET le point sont décimaux ;
     - tout le reste (« 0x10 », « 1e3 », « 1,2,3 ») est refusé : NaN. */
  function lireNombre(valeur) {
    var t = String(valeur).replace(/[\s  ]/g, '');
    if (EN && /^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) t = t.replace(/,/g, '');
    t = t.replace(',', '.');
    return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(t) ? Number(t) : NaN;
  }

  /* Un champ hors de son domaine rend le résultat inutilisable : on refuse
     de calculer plutôt que d'afficher un nombre qui aurait l'air valable. */
  function controle(champ, valeur) {
    if (valeur === '' || valeur === null) return T.vide;
    var x = lireNombre(valeur);
    if (!isFinite(x)) return T.nombre;
    if (champ.min !== null && champ.min !== undefined && x <= champ.min) {
      return T.superieur + formate(champ.min, 0) + '.';
    }
    if (champ.max !== null && champ.max !== undefined && x > champ.max) {
      return T.auPlus + formate(champ.max, 0) + '.';
    }
    return null;
  }

  function construire(cle) {
    var module = CALCULS_RDM[cle];
    if (!module) return;

    panneau.textContent = '';

    var grille = elt('div', 'calc-grille');
    panneau.appendChild(grille);

    // --- colonne de saisie ---
    var bloc = elt('div', 'calc-saisie');
    // sous le h1 de la page, qui nomme deja le calcul
    var niveau = 'h2';
    bloc.appendChild(elt(niveau, null, T.donnees));
    var form = elt('form');
    form.setAttribute('novalidate', '');
    bloc.appendChild(form);
    grille.appendChild(bloc);

    var champs = [];
    module.entrees.forEach(function (champ, rang) {
      var id = 'calc-' + cle + '-' + champ.cle;
      var groupe = elt('div', 'calc-champ');

      var etiquette = elt('label');
      etiquette.setAttribute('for', id);
      etiquette.appendChild(libelle('calc-libelle', texteLibelle(champ)));
      if (champ.unite) etiquette.appendChild(elt('span', 'calc-unite', unite(champ.unite)));
      groupe.appendChild(etiquette);

      var saisie = document.createElement('input');
      saisie.type = 'text';
      saisie.inputMode = 'decimal';
      saisie.id = id;
      saisie.value = EN ? String(champ.defaut) : String(champ.defaut).replace('.', ',');
      saisie.autocomplete = 'off';
      if (rang === 0) saisie.setAttribute('data-premier', '');
      groupe.appendChild(saisie);

      var alerte = elt('p', 'calc-alerte');
      alerte.id = id + '-alerte';
      groupe.appendChild(alerte);

      form.appendChild(groupe);
      champs.push({ def: champ, saisie: saisie, alerte: alerte });
    });

    form.addEventListener('submit', function (e) { e.preventDefault(); });

    // --- colonne de résultats ---
    var droite = elt('div', 'calc-resultats');
    droite.appendChild(elt(niveau, null, T.resultats));
    var zone = elt('div', 'calc-zone');
    zone.setAttribute('aria-live', 'polite');
    droite.appendChild(zone);

    // note de calcul : le navigateur imprime ou enregistre en PDF ; la mise
    // en page d'impression est dans style.css (@media print). Inactif tant
    // que les données ne donnent pas de résultat : rien à imprimer.
    var imprimer = elt('button', 'btn btn-secondaire calc-imprimer', T.imprimer);
    imprimer.type = 'button';
    imprimer.addEventListener('click', function () { window.print(); });
    droite.appendChild(imprimer);
    grille.appendChild(droite);

    function recalcule() {
      var valeurs = {};
      var refus = false;

      // « Recompenser tot, sanctionner tard » : une erreur CORRIGEE s'efface des
      // la frappe, mais une erreur NOUVELLE n'est signalee qu'a la sortie du
      // champ. Sinon, effacer « 210 » pour taper « 200 » afficherait « valeur
      // manquante » a quelqu'un qui n'a rien fait de faux : il ecrivait.
      champs.forEach(function (c) {
        var message = controle(c.def, c.saisie.value);
        var dejaSignale = c.saisie.classList.contains('en-faute');
        if (!message || c.quitte || dejaSignale) {
          c.alerte.textContent = message || '';
          c.saisie.classList.toggle('en-faute', Boolean(message));
          c.saisie.setAttribute('aria-invalid', message ? 'true' : 'false');
          if (message) c.aErre = true;
        }
        // un champ qui a deja ete en erreur est suivi en direct : sa correction
        // est confirmee sur place, la ou le regard se trouve deja
        c.saisie.classList.toggle('confirme', Boolean(c.aErre && !message));
        if (message) {
          refus = true;
        } else {
          valeurs[c.def.cle] = lireNombre(c.saisie.value);
        }
      });

      zone.textContent = '';
      imprimer.disabled = true;
      if (refus) {
        zone.appendChild(elt('p', 'calc-vide',
          T.completez));
        return;
      }

      var sortie;
      try {
        sortie = module.calcule(valeurs);
      } catch (err) {
        zone.appendChild(elt('p', 'calc-vide', T.echec));
        return;
      }

      module.sorties.forEach(function (s) {
        var ligne = elt('div', 'calc-ligne');
        ligne.appendChild(libelle('calc-nom', texteLibelle(s)));
        var val = elt('span', 'calc-valeur');
        val.appendChild(document.createTextNode(formate(sortie[s.cle], s.decimales)));
        if (s.unite) val.appendChild(elt('small', null, unite(s.unite)));
        ligne.appendChild(val);
        zone.appendChild(ligne);
      });
      imprimer.disabled = false;
    }

    champs.forEach(function (c) {
      c.saisie.addEventListener('input', function () {
        c.quitte = false;
        recalcule();
      });
      // a la sortie du champ, on a le droit de juger ce qui a ete saisi
      c.saisie.addEventListener('blur', function () {
        c.quitte = true;
        recalcule();
      });
    });
    recalcule();
  }

  // --- en-tête et pied de la note imprimée (cachés à l'écran) ---
  // La date est celle de l'impression : une page restée ouverte la veille ne
  // doit pas dater la note de la veille.
  function notePapier() {
    var section = document.querySelector('#calculateur .section-inner');
    var logo = document.querySelector('.nav-logo img');
    if (!section) return;

    var entete = elt('div', 'note-entete');
    if (logo) {
      var image = logo.cloneNode(false);
      image.removeAttribute('width');
      image.removeAttribute('height');
      entete.appendChild(image);
    }
    var date = elt('span', 'note-date');
    entete.appendChild(date);
    section.insertBefore(entete, section.firstChild);

    var pied = elt('p', 'note-pied');
    pied.appendChild(document.createTextNode(T.pied1 +
      location.host + location.pathname +
      T.pied2));
    section.appendChild(pied);

    function dater() {
      date.textContent = T.note + new Intl.DateTimeFormat(LOCALE,
        { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    }
    dater();
    window.addEventListener('beforeprint', dater);
  }

  // --- menu ---
  // Chaque entree est un lien vers la page du calcul (/outils/<calcul>/) ; la
  // page d'un calcul porte son module dans data-module. Le menu du site mene
  // au premier calcul (29/09/2026) : il n'y a plus de page Outils a part.
  var cle = panneau.getAttribute('data-module');
  menu.querySelectorAll('a[data-module]').forEach(function (a) {
    if (a.getAttribute('data-module') === cle) a.setAttribute('aria-current', 'page');
  });
  if (cle) {
    construire(cle);
    notePapier();
  }
})();
