/* ============================================================
   CONFIGURATION — la SEULE ligne à modifier
   Identifiant du code de suivi Hotjar.
   - Nouveau format (Hotjar via Contentsquare) : une chaîne hexadécimale,
     ex. "2502c5d15712c" -> charge https://t.contentsquare.net/uxa/<ID>.js
   - Ancien format : un nombre (hjid), ex. 5123456
   ============================================================ */
const HOTJAR_ID = "2502c5d15712c";

const CONSENT_KEY = "sommeilexpress-consent";

/* ---------- Chargement de Hotjar ----------
   Pourquoi dans une fonction ? Le RGPD impose de ne déposer les
   cookies de mesure d'audience qu'APRÈS le consentement. Hotjar
   n'est donc chargé que si l'utilisateur clique « Accepter ».    */
function loadHotjar() {
  if (!HOTJAR_ID) {
    console.warn("[demo] HOTJAR_ID non renseigné dans app.js : Hotjar n'est pas chargé.");
    return;
  }
  if (window.__hotjarLoaded) return; // déjà chargé
  window.__hotjarLoaded = true;

  if (typeof HOTJAR_ID === "number") {
    // Ancien snippet Hotjar (hjid numérique)
    (function (h, o, t, j, a, r) {
      h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };
      a = o.getElementsByTagName("head")[0];
      r = o.createElement("script"); r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
  } else {
    // Nouveau code de suivi Hotjar (balise Contentsquare)
    window._uxa = window._uxa || [];
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://t.contentsquare.net/uxa/" + HOTJAR_ID + ".js";
    document.head.appendChild(s);
  }
}

/* ---------- Événements ----------
   Envoie un événement nommé : il permet ensuite de FILTRER les
   enregistrements (ex. : « seulement les sessions avec form_error »).
   On l'envoie aux deux API (ancienne Hotjar et Contentsquare). */
function hjEvent(name) {
  if (!window.__hotjarLoaded) return;
  if (typeof window.hj === "function") window.hj("event", name);
  window._uxa = window._uxa || [];
  window._uxa.push(["trackPageEvent", name]);
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

  if (consent === "yes") loadHotjar();
  else if (consent === null && banner) banner.style.display = "block";

  document.getElementById("consent-yes")?.addEventListener("click", () => {
    saveConsent("yes");
    banner.style.display = "none";
    loadHotjar();
  });
  document.getElementById("consent-no")?.addEventListener("click", () => {
    saveConsent("no");
    banner.style.display = "none";
  });
  document.getElementById("consent-reset")?.addEventListener("click", () => {
    try { localStorage.removeItem(CONSENT_KEY); } catch (e) {}
    location.reload();
  });
}

/* ---------- Événements sur les éléments piégés ---------- */
function initTracking() {
  document.querySelectorAll("[data-event]").forEach((el) => {
    el.addEventListener("click", () => hjEvent(el.dataset.event));
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
      hjEvent("form_error");
      return;
    }

    hjEvent("form_success");
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
