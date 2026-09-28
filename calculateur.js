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

  // Les nombres s'écrivent en français : virgule décimale, espace insécable
  // fine pour les milliers. Un point décimal sur une note de calcul française
  // se lit comme une erreur.
  function formate(valeur, decimales) {
    if (typeof valeur !== 'number' || !isFinite(valeur)) return '—';
    return new Intl.NumberFormat('fr-FR', {
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
    var m = /^(.*\s:\s)(\S+)$/.exec(texte);
    if (!m) { n.textContent = texte; return n; }
    n.appendChild(document.createTextNode(m[1]));
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

  /* Un champ hors de son domaine rend le résultat inutilisable : on refuse
     de calculer plutôt que d'afficher un nombre qui aurait l'air valable. */
  function controle(champ, valeur) {
    if (valeur === '' || valeur === null) return 'Saisissez une valeur.';
    var x = Number(String(valeur).replace(',', '.'));
    if (!isFinite(x)) return 'Saisissez un nombre, par exemple 12,5.';
    if (champ.min !== null && champ.min !== undefined && x <= champ.min) {
      return 'Saisissez une valeur supérieure à ' + formate(champ.min, 0) + '.';
    }
    if (champ.max !== null && champ.max !== undefined && x > champ.max) {
      return 'Saisissez une valeur au plus égale à ' + formate(champ.max, 0) + '.';
    }
    return null;
  }

  function construire(cle) {
    var module = CALCULS_RDM[cle];
    if (!module) return;

    panneau.textContent = '';

    // sur la page propre a un calcul, le titre de la page le nomme deja
    if (!panneau.hasAttribute('data-module')) {
      var entete = elt('div', 'calc-entete');
      entete.appendChild(elt('h2', null, module.titre));
      panneau.appendChild(entete);
    }

    var grille = elt('div', 'calc-grille');
    panneau.appendChild(grille);

    // --- colonne de saisie ---
    var bloc = elt('div', 'calc-saisie');
    // titres sans saut de niveau : sous le h1 de la page d'un calcul, ou sous
    // le h2 du calcul sur la page Outils
    var niveau = panneau.hasAttribute('data-module') ? 'h2' : 'h3';
    bloc.appendChild(elt(niveau, null, 'Données'));
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
      etiquette.appendChild(libelle('calc-libelle', champ.libelle));
      if (champ.unite) etiquette.appendChild(elt('span', 'calc-unite', unite(champ.unite)));
      groupe.appendChild(etiquette);

      var saisie = document.createElement('input');
      saisie.type = 'text';
      saisie.inputMode = 'decimal';
      saisie.id = id;
      saisie.value = String(champ.defaut).replace('.', ',');
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
    droite.appendChild(elt(niveau, null, 'Résultats'));
    var zone = elt('div', 'calc-zone');
    zone.setAttribute('aria-live', 'polite');
    droite.appendChild(zone);
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
          valeurs[c.def.cle] = Number(String(c.saisie.value).replace(',', '.'));
        }
      });

      zone.textContent = '';
      if (refus) {
        zone.appendChild(elt('p', 'calc-vide',
          'Complétez les données pour obtenir les résultats.'));
        return;
      }

      var sortie;
      try {
        sortie = module.calcule(valeurs);
      } catch (err) {
        zone.appendChild(elt('p', 'calc-vide', "Le calcul n'aboutit pas avec ces valeurs : vérifiez les données saisies."));
        return;
      }

      module.sorties.forEach(function (s) {
        var ligne = elt('div', 'calc-ligne');
        ligne.appendChild(libelle('calc-nom', s.libelle));
        var val = elt('span', 'calc-valeur');
        val.appendChild(document.createTextNode(formate(sortie[s.cle], s.decimales)));
        if (s.unite) val.appendChild(elt('small', null, unite(s.unite)));
        ligne.appendChild(val);
        zone.appendChild(ligne);
      });
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

  // --- menu ---
  // Chaque entree est un lien vers la page du calcul (/outils/<calcul>/). La
  // page d'un calcul porte son module dans data-module ; la page Outils, qui
  // n'en porte pas, ouvre le premier de la liste.
  var liens = menu.querySelectorAll('a[data-module]');
  var cle = panneau.getAttribute('data-module')
    || (liens.length ? liens[0].getAttribute('data-module') : null);
  var dediee = panneau.hasAttribute('data-module');
  liens.forEach(function (a) {
    if (a.getAttribute('data-module') === cle) {
      a.setAttribute('aria-current', dediee ? 'page' : 'true');
    }
  });
  if (cle) construire(cle);
})();
