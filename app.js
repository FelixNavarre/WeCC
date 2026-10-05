const $ = (id) => document.getElementById(id);
const euro = (n) => `${Math.round(n).toLocaleString("fr-FR")} €`;
const people = TRIP.participants.length;
const voters = TRIP.participants.length;
const placeById = Object.fromEntries(PLACES.map((p) => [p.id, p]));

let votes = [];
let currentName = null;
let ranking = [];

// --- Lieux ---

function renderPlaces() {
  $("places").innerHTML = PLACES.map((p) => {
    const lodging = p.lodgingTotal / people;
    const train = p.trainOut.price + p.trainBack.price;
    const transport = train + CAR_PER_PERSON;
    return `
      <article class="card">
        <div class="carousel" data-place="${p.id}" data-index="0">
          <img src="${p.photos[0]}" alt="${p.name} — photo du logement" loading="lazy" referrerpolicy="no-referrer">
          <button class="nav prev" type="button" aria-label="Photo précédente">‹</button>
          <button class="nav next" type="button" aria-label="Photo suivante">›</button>
          <span class="counter">1 / ${p.photos.length}</span>
        </div>
        <div class="body">
          <h3><a class="title" href="${p.url}" target="_blank" rel="noopener">${p.emoji} ${p.name}</a></h3>
          <p class="where">${p.where}</p>
          <p class="listing">${p.listing}</p>
          <p class="specs">${p.specs}</p>
          <dl>
            <div><dt>Depuis Paris</dt><dd>${p.travelTime}<small>train + ${p.drive}</small></dd></div>
            <div><dt>Aller</dt><dd>${euro(p.trainOut.price)}<small>${p.trainOut.label}</small></dd></div>
            <div><dt>Retour</dt><dd>${euro(p.trainBack.price)}<small>${p.trainBack.label}</small></dd></div>
            <div><dt>Transport</dt><dd>${euro(transport)} / pers<small>train ${euro(train)} + voiture ${euro(CAR_PER_PERSON)}</small></dd></div>
            <div><dt>Logement</dt><dd>${euro(lodging)} / pers<small>${euro(p.lodgingTotal)} au total — ${p.lodgingNote}</small></dd></div>
            <div class="total"><dt>Total estimé</dt><dd>${euro(lodging + transport)} / pers</dd></div>
          </dl>
          ${p.note ? `<p class="note">⚠️ ${p.note}</p>` : ""}
          <a href="${p.url}" target="_blank" rel="noopener">Voir l'annonce ↗</a>
        </div>
      </article>`;
  }).join("");
}

$("places").addEventListener("click", (e) => {
  const btn = e.target.closest(".nav");
  if (!btn) return;
  const carousel = btn.closest(".carousel");
  const photos = placeById[carousel.dataset.place].photos;
  const step = btn.classList.contains("next") ? 1 : -1;
  const index = (Number(carousel.dataset.index) + step + photos.length) % photos.length;
  carousel.dataset.index = index;
  carousel.querySelector("img").src = photos[index];
  carousel.querySelector(".counter").textContent = `${index + 1} / ${photos.length}`;
});

// --- Vote ---

function renderNames() {
  const voted = new Set(votes.map((v) => v.name));
  $("names").innerHTML = TRIP.participants.map((name) => `
    <button type="button" class="chip${name === currentName ? " active" : ""}" data-name="${name}">
      ${name}${voted.has(name) ? " ✓" : ""}
    </button>`).join("");
}

function renderRanker() {
  $("ranker").hidden = !currentName;
  $("rank-options").innerHTML = PLACES.map((p) => {
    const pos = ranking.indexOf(p.id);
    return `
      <button type="button" class="rank-option${pos >= 0 ? " picked" : ""}" data-place="${p.id}">
        <span class="badge">${pos >= 0 ? pos + 1 : ""}</span>${p.emoji} ${p.name}
      </button>`;
  }).join("");
  $("submit").disabled = ranking.length !== PLACES.length;
}

$("names").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  currentName = chip.dataset.name;
  const existing = votes.find((v) => v.name === currentName);
  ranking = existing ? [...existing.ranking] : [];
  $("status").textContent = existing ? "Tu as déjà voté — tu peux modifier ton classement." : "";
  renderNames();
  renderRanker();
});

$("rank-options").addEventListener("click", (e) => {
  const option = e.target.closest(".rank-option");
  if (!option) return;
  const id = option.dataset.place;
  ranking = ranking.includes(id) ? ranking.filter((x) => x !== id) : [...ranking, id];
  renderRanker();
});

$("reset").addEventListener("click", () => {
  ranking = [];
  renderRanker();
});

$("submit").addEventListener("click", async () => {
  $("submit").disabled = true;
  try {
    await Store.save(currentName, ranking);
    $("status").textContent = `Vote enregistré, merci ${currentName} !`;
    await refresh();
  } catch (err) {
    $("status").textContent = err.message;
  }
  renderRanker();
});

// --- Résultats ---

function renderResults() {
  $("count").textContent = `${votes.length} / ${voters} ont voté`;

  const scores = PLACES.map((p) => {
    const points = votes.reduce((sum, v) => {
      const pos = v.ranking.indexOf(p.id);
      return pos >= 0 ? sum + PLACES.length - pos : sum;
    }, 0);
    const firsts = votes.filter((v) => v.ranking[0] === p.id).length;
    return { place: p, points, firsts };
  }).sort((a, b) => b.points - a.points || b.firsts - a.firsts);

  const max = Math.max(1, votes.length * PLACES.length);
  const leader = votes.length && scores[0].points > scores[1].points ? scores[0].place.id : null;

  $("results").innerHTML = scores.map((s) => `
    <div class="result${s.place.id === leader ? " leader" : ""}">
      <div class="label"><span>${s.place.emoji} ${s.place.name}</span><span>${s.points} pts · ${s.firsts} × 1<sup>er</sup></span></div>
      <div class="bar"><div style="width:${(s.points / max) * 100}%"></div></div>
    </div>`).join("");

  $("ballots").innerHTML = votes.length
    ? `<h3>Qui a voté quoi</h3><ul>${votes.map((v) => `
        <li><strong>${v.name}</strong> ${v.ranking.map((id) => placeById[id]?.name ?? id).join(" › ")}</li>`).join("")}</ul>`
    : `<p class="hint">Aucun vote pour l'instant.</p>`;
}

async function refresh() {
  try {
    const known = new Set(TRIP.participants);
    // Ignore les votes portant sur une ancienne liste de lieux
    votes = (await Store.list()).filter((v) => known.has(v.name) && v.ranking.every((id) => placeById[id]));
  } catch (err) {
    $("status").textContent = err.message;
  }
  renderNames();
  renderResults();
}

$("dates").textContent = TRIP.dates;
$("demo").hidden = Store.remote;
renderPlaces();
renderRanker();
refresh();
if (Store.remote) setInterval(refresh, 15000);
