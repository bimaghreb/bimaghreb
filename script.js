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

  // --- Apparitions au defilement --------------------------------------------
  // Les elements d'un meme groupe arrivent en cascade, 50 ms d'ecart : a 30 ms
  // ils se fondent en un bloc, a 100 ms la liste se traine.
  const cibles = mouvementReduit ? [] : Array.from(document.querySelectorAll(
    '.section-head, .work, .why-item, .domaine'
  ));
  cibles.forEach((el) => {
    const freres = Array.from(el.parentElement.children)
      .filter((f) => f.classList.contains(el.classList[0]));
    el.style.setProperty('--rang', String(Math.max(0, freres.indexOf(el))));
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    cibles.forEach((el) => io.observe(el));
  } else {
    cibles.forEach((el) => el.classList.add('visible'));
  }

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
