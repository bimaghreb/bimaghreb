(function () {
  'use strict';

  const nav = document.getElementById('nav');

  // Filet sous la barre de navigation des qu'on a quitte le haut de page.
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Le visiteur a demande moins de mouvement dans les reglages de son systeme :
  // on n'anime rien, ni apparitions ni rotation des maquettes.
  const mouvementReduit = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // (22/10/2026 : plus d'apparition au defilement. Le contenu masque tant
  // qu'on n'avait pas defile sortait vide a l'impression ; le seul mouvement
  // d'entree est celui du titre d'accueil, en CSS.)

  // --- Section en cours -----------------------------------------------------
  // Sur la page d'accueil, toutes les entrees du menu sont des ancres : sans ce
  // reperage, l'onglet « Accueil » resterait allume pendant toute la lecture.
  // Une section compte comme lue quand elle traverse le milieu de l'ecran.
  const liensAncre = Array.from(document.querySelectorAll(
    '.nav-links a[href^="#"], .onglets a[href^="#"]'
  ));
  if (liensAncre.length && 'IntersectionObserver' in window) {
    // « Ouvrages traites » n'a pas d'entree propre : il prolonge la Demarche.
    const rattache = { elements: 'demarche' };
    const marquer = (ancre) => {
      liensAncre.forEach((a) => {
        if (a.getAttribute('href') === '#' + ancre) {
          a.setAttribute('aria-current', 'location');
        } else if (a.getAttribute('aria-current') === 'location') {
          a.removeAttribute('aria-current');
        }
      });
    };
    const espion = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) marquer(rattache[e.target.id] || e.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((s) => espion.observe(s));
  }

  // --- Maquettes 3D ---------------------------------------------------------
  // Pendant le chargement, le composant affiche sa propre barre de progression :
  // on ne le masque surtout pas, un cadre vide se lit comme une panne.
  if (mouvementReduit) {
    document.querySelectorAll('.viewer model-viewer').forEach((vue) => {
      vue.removeAttribute('auto-rotate');
    });
  }

  // Page d'un ouvrage : la rotation s'arrete des que le visiteur prend la
  // maquette en main (elle ne lui echappe plus) ; « Recentrer » rend la vue
  // de depart ; « Plein ecran » n'apparait que si le navigateur le permet
  // (pas sur iPhone). Sans JavaScript, les deux boutons restent caches.
  document.querySelectorAll('.viewer-grand').forEach((bloc) => {
    const vue = bloc.querySelector('model-viewer');
    if (!vue) return;
    const orbite = vue.getAttribute('camera-orbit');
    vue.addEventListener('camera-change', (e) => {
      if (e.detail && e.detail.source === 'user-interaction') vue.autoRotate = false;
    });
    const recentrer = bloc.querySelector('[data-vue="recentrer"]');
    if (recentrer) {
      recentrer.hidden = false;
      recentrer.addEventListener('click', () => {
        vue.cameraOrbit = orbite;
        vue.cameraTarget = 'auto';
        vue.fieldOfView = 'auto';
        if (typeof vue.resetTurntableRotation === 'function') vue.resetTurntableRotation(0);
        vue.autoRotate = !mouvementReduit;
      });
    }
    const plein = bloc.querySelector('[data-vue="plein-ecran"]');
    if (plein && document.fullscreenEnabled) {
      plein.hidden = false;
      plein.addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else bloc.requestFullscreen();
      });
    }
  });

  // Page ouverte par double-clic (file://) : le navigateur interdit le module et
  // le modele, le cadre resterait vide sans rien expliquer. En ligne, en https,
  // ce cas ne se presente jamais.
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('.viewer').forEach((bloc) => {
      const note = document.createElement('p');
      note.className = 'viewer-erreur';
      note.textContent =
        'Cette page a été ouverte directement depuis le disque : le navigateur '
        + 'interdit alors le chargement de la maquette. Double-cliquez sur '
        + '« VOIR LE SITE.bat », dans le dossier BIMaghreb, pour la voir '
        + 'tourner. Une fois le site en ligne, elle fonctionnera sans rien faire.';
      bloc.appendChild(note);
    });
  }
})();

/* Newsletter : le formulaire s'envoie normalement vers Brevo, mais dans un
   cadre invisible (target="nl-cible") : le visiteur reste sur la page, et le
   chargement du cadre signale que Brevo a repondu. Un envoi de formulaire
   classique ne depend pas des regles CORS, contrairement a fetch() : un
   visiteur ne peut pas lire « echec » alors que son inscription est passee.
   Sans JavaScript, la reponse de Brevo s'ouvre simplement dans le cadre. */
(function () {
  document.querySelectorAll("form[data-newsletter]").forEach(function (f) {
    var etat = f.querySelector(".newsletter-etat");
    var bouton = f.querySelector("button[type=submit]");
    var cadre = document.querySelector("iframe[name=" + f.target + "]");
    var enCours = false, minuterie = null;
    f.addEventListener("submit", function (e) {
      if (!f.checkValidity()) { e.preventDefault(); f.reportValidity(); return; }
      enCours = true;
      bouton.disabled = true;
      etat.className = "newsletter-etat";
      etat.textContent = "Envoi en cours…";
      minuterie = setTimeout(function () {
        if (!enCours) return;
        enCours = false;
        bouton.disabled = false;
        etat.className = "newsletter-etat erreur";
        etat.textContent = "L’inscription n’a pas abouti. Vérifiez votre connexion, puis réessayez.";
      }, 20000);
    });
    if (cadre) cadre.addEventListener("load", function () {
      if (!enCours) return;
      enCours = false;
      clearTimeout(minuterie);
      bouton.disabled = false;
      f.reset();
      etat.className = "newsletter-etat ok";
      etat.textContent = "Merci, votre inscription est enregistrée.";
    });
  });
})();

/* Articles : chaque capture devient une figure legendee (legende = son texte
   alternatif) et un lien vers l'image en taille reelle ; le sommaire de la
   marge droite est construit a partir des intertitres et suit la lecture.
   Sans JavaScript, l'article reste complet et lisible. */
(function () {
  var prose = document.querySelector(".billet-page .prose");
  if (!prose) return;

  prose.querySelectorAll("p > img:only-child").forEach(function (img) {
    var p = img.parentNode;
    if (p.textContent.trim() !== "") return;
    var fig = document.createElement("figure");
    var lien = document.createElement("a");
    lien.href = img.getAttribute("src");
    lien.target = "_blank";
    lien.rel = "noopener";
    lien.setAttribute("aria-label", (document.documentElement.lang === "en"
      ? "Open full size: " : "Ouvrir en taille réelle : ") + (img.alt || "image"));
    lien.appendChild(img);
    fig.appendChild(lien);
    if (img.alt) {
      var leg = document.createElement("figcaption");
      leg.textContent = img.alt;
      fig.appendChild(leg);
    }
    p.parentNode.replaceChild(fig, p);
  });

  var nav = document.querySelector(".billet-sommaire");
  var titres = prose.querySelectorAll("h2");
  if (!nav || titres.length < 2) return;
  var liste = nav.querySelector("ol");
  var liens = [];
  titres.forEach(function (h, i) {
    if (!h.id) h.id = "partie-" + (i + 1);
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    liste.appendChild(li);
    liens.push(a);
  });
  nav.hidden = false;

  // partie en cours = le dernier intertitre passe sous le haut de l'ecran
  // (sous la barre de navigation) ; avant le premier, aucune.
  var attente = false;
  function suivre() {
    attente = false;
    var seuil = window.innerHeight * 0.3, courant = -1;
    titres.forEach(function (h, i) { if (h.getBoundingClientRect().top <= seuil) courant = i; });
    liens.forEach(function (a, i) {
      if (i === courant) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", function () {
    if (!attente) { attente = true; requestAnimationFrame(suivre); }
  }, { passive: true });
  suivre();
})();

/* ============================================================
   Selecteur de langue
   ============================================================ */
(function () {
  // Selecteur de langue (<details>) : se referme au clic ailleurs et sur
  // Echap ; l'ouverture reste native, elle marche meme sans ce script.
  document.querySelectorAll('details.langues').forEach((liste) => {
    document.addEventListener('click', (e) => {
      if (liste.open && !liste.contains(e.target)) liste.open = false;
    });
    liste.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && liste.open) {
        liste.open = false;
        liste.querySelector('summary').focus();
      }
    });
  });
})();

/* ============================================================
   Accueil : trame isometrique calee sur le cube du logo (06/10/2026)
   Meme regle que la carte de visite : la trame passe par le sommet avant
   du losange et son pas vaut la demi-largeur du cube / 3.
   Geometrie de logo-icon-white.svg (faire_logo.py) : viewBox 400,
   demi-largeur 120, sommet avant du losange en (200, 200).
   ============================================================ */
(function () {
  var fond = document.querySelector('.hero .hero-bg');
  var cube = document.querySelector('.hero .hero-mark');
  if (!fond || !cube) return;
  var NS = 'http://www.w3.org/2000/svg';
  var MAILLES = 3;

  function calque(classe, couleur, id) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', classe);
    var defs = document.createElementNS(NS, 'defs');
    var motif = document.createElementNS(NS, 'pattern');
    motif.setAttribute('id', id);
    motif.setAttribute('patternUnits', 'userSpaceOnUse');
    // deux traits : la maille fine, et la maille principale (un cube)
    var fin = document.createElementNS(NS, 'path');
    fin.setAttribute('fill', 'none');
    fin.setAttribute('stroke', couleur);
    fin.setAttribute('stroke-width', '1');
    fin.setAttribute('stroke-opacity', '.45');
    var fort = document.createElementNS(NS, 'path');
    fort.setAttribute('fill', 'none');
    fort.setAttribute('stroke', couleur);
    fort.setAttribute('stroke-width', '1.25');
    motif.appendChild(fin);
    motif.appendChild(fort);
    defs.appendChild(motif);
    svg.appendChild(defs);
    var aplat = document.createElementNS(NS, 'rect');
    aplat.setAttribute('width', '100%');
    aplat.setAttribute('height', '100%');
    aplat.setAttribute('fill', 'url(#' + id + ')');
    svg.appendChild(aplat);
    fond.appendChild(svg);
    return { svg: svg, motif: motif, fin: fin, fort: fort };
  }
  // 23/10/2026 : la lueur orange qui suivait la souris est retiree (choix de
  // Mohamed) ; seule reste la trame.
  var trame = calque('hero-trame', '#ffffff', 'trame-iso');

  // Une maille isometrique de pas d : tuile de 2 d sur 2 d / tan... (hauteur
  // h = 2 d / racine 3), deux colonnes car les noeuds d'une colonne sur deux
  // sont decales d'une demi-maille (une tuile d'un seul pas dessine des chevrons).
  function maille(d, ox, oy) {
    var h = 2 * d / Math.sqrt(3);
    return 'M' + ox + ' ' + oy + 'v' + h + 'M' + (ox + d) + ' ' + oy + 'v' + h +
           'M' + (ox + 2 * d) + ' ' + oy + 'v' + h +
           'M' + ox + ' ' + oy + 'l' + 2 * d + ' ' + h +
           'M' + ox + ' ' + (oy + h) + 'l' + 2 * d + ' ' + (-h);
  }
  // Le motif couvre UN cube : la maille principale (pas = demi-largeur du
  // cube) et, dedans, 3 x 3 mailles fines. Le cube du logo est exactement un
  // losange de la maille principale.
  function caler() {
    var rf = fond.getBoundingClientRect();
    var rc = cube.getBoundingClientRect();
    if (!rc.width) return;
    var k = rc.width / 400;
    var a = 120 * k;
    var d = a / MAILLES;
    var hf = 2 * d / Math.sqrt(3);
    var x = rc.left - rf.left + 200 * k;
    var y = rc.top - rf.top + 200 * k;
    var fin = '';
    for (var i = 0; i < MAILLES; i++) {
      for (var j = 0; j < MAILLES; j++) fin += maille(d, i * 2 * d, j * hf);
    }
    var fort = maille(a, 0, 0);
    trame.motif.setAttribute('width', 2 * a);
    trame.motif.setAttribute('height', 2 * a / Math.sqrt(3));
    trame.motif.setAttribute('x', x);
    trame.motif.setAttribute('y', y);
    trame.fin.setAttribute('d', fin);
    trame.fort.setAttribute('d', fort);
  }
  caler();
  window.addEventListener('resize', caler);
  cube.addEventListener('load', caler);
})();
