// BIMaghreb — script de TOUT le site (FR et EN), refonte du 24/10/2026, variante A.
// Fichier externe : la politique de securite du site interdit tout script ecrit dans la page.
// Chaque bloc ne s'active que si la page contient ce qu'il anime.
(() => {
  // les entrees de section ne s'appliquent que si le script tourne (sans lui, tout reste visible)
  document.documentElement.classList.add('js');

  const calm = matchMedia('(prefers-reduced-motion: reduce)');

  // 1. Les photographies d'en-tete defilent seules, en fondu lent, en boucle
  //    (choix de Mohamed, 24/10/2026 : plus de boutons). Pause quand l'onglet est cache.
  const frames = [...document.querySelectorAll('.hero__frames img')];
  if (frames.length > 1) {
    let current = 0;
    const HOLD = 6000, FADE = 1600;
    setInterval(() => {
      if (document.hidden) return;
      frames[current].classList.remove('is-on');
      current = (current + 1) % frames.length;
      frames[current].classList.add('is-on');
    }, HOLD + FADE);
  }

  // 2. La démarche : la rangée défile sous le doigt, les deux boutons la font avancer d'une colonne.
  const row = document.getElementById('steps-row');
  if (row) {
    const fill = document.querySelector('.steps__fill');
    const prev = document.querySelector('[data-step="-1"]');
    const nextBtn = document.querySelector('[data-step="1"]');
    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      const share = row.scrollWidth ? row.clientWidth / row.scrollWidth : 1;
      const p = max > 0 ? row.scrollLeft / max : 0;
      if (fill) {
        fill.style.width = (share * 100).toFixed(2) + '%';
        fill.style.transform = `translateX(${(p * (1 / share - 1) * 100).toFixed(2)}%)`;
      }
      if (prev) prev.disabled = row.scrollLeft <= 2;
      if (nextBtn) nextBtn.disabled = row.scrollLeft >= max - 2;
    };
    const stepBy = (dir) => {
      const item = row.querySelector('.step');
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const w = item ? item.getBoundingClientRect().width + gap : row.clientWidth * 0.8;
      row.scrollBy({ left: dir * w, behavior: calm.matches ? 'auto' : 'smooth' });
    };
    prev && prev.addEventListener('click', () => stepBy(-1));
    nextBtn && nextBtn.addEventListener('click', () => stepBy(1));
    row.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    addEventListener('resize', update);
    addEventListener('load', update);
    update();
  }

  // 3. Entrées de section : une fois, à l'arrivée, seulement si le mouvement est accepté.
  const targets = document.querySelectorAll('[data-reveal]');
  const reveal = (el) => el.classList.add('is-in');
  if (calm.matches || !('IntersectionObserver' in window)) { targets.forEach(reveal); return; }
  // Les colonnes de la rangée arrivent ensemble, quand la rangée arrive (même celles hors champ à droite).
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      if (e.target === row) row.querySelectorAll('[data-reveal]').forEach(reveal); else reveal(e.target);
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  const watch = (el) => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) { if (el === row) row.querySelectorAll('[data-reveal]').forEach(reveal); else reveal(el); }
    else io.observe(el);
  };
  targets.forEach((el) => { if (!(row && row.contains(el))) watch(el); });
  if (row) watch(row);
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
   marge gauche est construit a partir des intertitres et suit la lecture.
   Sans JavaScript, l'article reste complet et lisible. */
(function () {
  var prose = document.querySelector(".article .prose");
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

  var nav = document.querySelector(".toc");
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
  // (au tiers de sa hauteur) ; avant le premier, aucune.
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
