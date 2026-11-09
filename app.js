/* ============================================================
   CONFIGURATION — la SEULE ligne à modifier
   Identifiant du projet Microsoft Clarity
   (Clarity > Settings > Setup, ou dans l'URL du projet).
   ============================================================ */
const CLARITY_ID = "zazxdpjbht";

// Nouvelle clé : le consentement donné à l'ancien outil ne vaut pas pour Clarity.
const CONSENT_KEY = "sommeilexpress-consent-clarity";

/* ---------- Chargement de Clarity ----------
   Pourquoi dans une fonction ? Le RGPD impose de ne déposer les
   cookies de mesure d'audience qu'APRÈS le consentement. Clarity
   n'est donc chargé que si l'utilisateur clique « Accepter ».
   Depuis le 31/10/2025, Clarity exige en plus un signal de consentement
   explicite (API « consentv2 ») pour les visiteurs de l'UE, du
   Royaume-Uni et de Suisse : sans lui, chaque page vue devient une
   session séparée et les enregistrements sont inexploitables.        */
function loadClarity() {
  if (!CLARITY_ID) {
    console.warn("[demo] CLARITY_ID non renseigné dans app.js : Clarity n'est pas chargé.");
    return;
  }
  if (window.__clarityLoaded) return; // déjà chargé
  window.__clarityLoaded = true;

  // Snippet officiel Microsoft Clarity
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_ID);

  // Signal de consentement (mesure d'audience oui, publicité non)
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
}

/* ---------- Événements personnalisés ----------
   clarity("event", nom) permet ensuite de FILTRER les enregistrements
   dans Clarity (filtre « Custom events » : ex. seulement les sessions
   avec form_error). */
function trackEvent(name) {
  if (!window.__clarityLoaded || typeof window.clarity !== "function") return;
  window.clarity("event", name);
  console.log("[demo] événement envoyé :", name);
}

/* ---------- Bandeau de consentement ---------- */
function readConsent() {
  try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
}
function saveConsent(value) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* navigation privée */ }
}

function initConsent() {
  const banner = document.getElementById("consent");
  const consent = readConsent();

  if (consent === "yes") loadClarity();
  else if (consent === null && banner) banner.style.display = "block";

  document.getElementById("consent-yes")?.addEventListener("click", () => {
    saveConsent("yes");
    banner.style.display = "none";
    loadClarity();
  });
  document.getElementById("consent-no")?.addEventListener("click", () => {
    saveConsent("no");
    banner.style.display = "none";
  });
  document.getElementById("consent-reset")?.addEventListener("click", () => {
    // Retrait du consentement : Clarity efface son cookie et arrête le suivi
    if (typeof window.clarity === "function") {
      window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
    }
    try { localStorage.removeItem(CONSENT_KEY); } catch (e) {}
    location.reload();
  });
}

/* ---------- Événements sur les éléments piégés ---------- */
function initTracking() {
  document.querySelectorAll("[data-event]").forEach((el) => {
    el.addEventListener("click", () => trackEvent(el.dataset.event));
  });
}

/* ---------- Formulaire d'inscription ----------
   PIÈGE n°3 : le téléphone exige le format EXACT « 06 12 34 56 78 »
   (avec espaces) et le message d'erreur est vague. Les enregistrements
   montreront des utilisateurs qui retapent plusieurs fois le champ.  */
function initForm() {
  const form = document.getElementById("signup");
  if (!form) return;

  const phoneRe = /^0[67] \d{2} \d{2} \d{2} \d{2}$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    form.querySelectorAll(".field").forEach((f) => f.classList.remove("error"));

    form.querySelectorAll("[required]").forEach((input) => {
      if (!input.value.trim()) {
        input.closest(".field").classList.add("error");
        ok = false;
      }
    });

    const phone = form.querySelector("#phone");
    if (phone.value && !phoneRe.test(phone.value)) {
      phone.closest(".field").classList.add("error");
      ok = false;
    }

    if (!ok) {
      trackEvent("form_error");
      return;
    }

    trackEvent("form_success");
    form.reset();
    form.style.display = "none";
    document.getElementById("success").style.display = "block";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initConsent();
  initTracking();
  initForm();
});
