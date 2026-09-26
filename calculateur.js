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

    var entete = elt('div', 'calc-entete');
    entete.appendChild(elt('h3', null, module.titre));
    panneau.appendChild(entete);

    var grille = elt('div', 'calc-grille');
    panneau.appendChild(grille);

    // --- colonne de saisie ---
    var bloc = elt('div', 'calc-saisie');
    bloc.appendChild(elt('h4', null, 'Données'));
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
      etiquette.appendChild(elt('span', 'calc-libelle', champ.libelle));
      if (champ.unite) etiquette.appendChild(elt('span', 'calc-unite', champ.unite));
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
    droite.appendChild(elt('h4', null, 'Résultats'));
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
        ligne.appendChild(elt('span', 'calc-nom', s.libelle));
        var val = elt('span', 'calc-valeur');
        val.appendChild(document.createTextNode(formate(sortie[s.cle], s.decimales)));
        if (s.unite) val.appendChild(elt('small', null, s.unite));
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
  menu.addEventListener('click', function (e) {
    var bouton = e.target.closest('button[data-module]');
    if (!bouton) return;
    menu.querySelectorAll('button[data-module]').forEach(function (b) {
      b.setAttribute('aria-current', b === bouton ? 'true' : 'false');
    });
    construire(bouton.getAttribute('data-module'));
    if (window.matchMedia('(max-width: 900px)').matches) {
      panneau.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  var premier = menu.querySelector('button[data-module]');
  if (premier) {
    premier.setAttribute('aria-current', 'true');
    construire(premier.getAttribute('data-module'));
  }
})();
