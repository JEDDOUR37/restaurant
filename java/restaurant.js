const tabs = document.getElementById("tabs");
const plats = document.getElementById("plats");
const carte = document.getElementById("carte");

fetch("data/countries.json")
  .then((r) => r.json())
  .then((list) => {
    tabs.innerHTML = list.map((c) =>
      `<button class="tab" data-id="${c.id}">
         <img src="https://flagcdn.com/w80/${c.code}.png" alt="">
         <span>${c.nom}</span>
       </button>`).join("");

    function show(id) {
      const c = list.find((x) => x.id === id);
      carte.style.setProperty("--c", c.couleur);
      tabs.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.id === id));
      document.getElementById("slogan").textContent = c.slogan;
      plats.innerHTML = c.plats.map((p, i) =>
        `<article class="plat" style="--d:${i * 0.1}s">
           <div class="emoji">${p.emoji}</div>
           <h3>${p.nom}</h3>
           <p>${p.desc}</p>
           <div class="bas"><span class="prix">${p.prix} DH</span><button>Commander</button></div>
         </article>`).join("");
    }

    tabs.addEventListener("click", (e) => {
      const t = e.target.closest(".tab");
      if (t) show(t.dataset.id);
    });
    // ================= 1. ALLERGÈNES =================
const ALLERGENS = {
  "gluten": "🌾", "lait": "🥛", "œufs": "🥚", "poisson": "🐟",
  "fruits à coque": "🥜", "arachides": "🥜", "soja": "🫘",
  "crustacés": "🦐", "sésame": "⚪", "céleri": "🌿"
};
function allergenBadges(list) {
  if (!list || !list.length) return "";
  return `<div class="allergens">` +
    list.map(a => `<span class="allergen" title="Contient: ${a}">${ALLERGENS[a] || "⚠️"} ${a}</span>`).join("") +
    `</div>`;
}

// ================= 2. BOISSONS =================
// Les clés (morocco, italy...) khassom ykounou b7al les ids dial les pays 3ndek
const DRINKS_BY_COUNTRY = {
  morocco: [
    { name: "Atay b na3na3", price: 10, emoji: "🍵", allergens: [] },
    { name: "Café noir / nss-nss", price: 12, emoji: "☕", allergens: ["lait"] },
    { name: "Lben", price: 10, emoji: "🥛", allergens: ["lait"] },
    { name: "Jus d'avocat", price: 25, emoji: "🥑", allergens: ["lait"] }
  ],
  italy: [
    { name: "Espresso", price: 12, emoji: "☕", allergens: [] },
    { name: "Cappuccino", price: 18, emoji: "☕", allergens: ["lait"] },
    { name: "Limonata", price: 18, emoji: "🍋", allergens: [] }
  ],
  france: [
    { name: "Citron pressé", price: 18, emoji: "🍋", allergens: [] },
    { name: "Café crème", price: 15, emoji: "☕", allergens: ["lait"] },
    { name: "Chocolat chaud", price: 20, emoji: "🍫", allergens: ["lait"] }
  ],
  china: [
    { name: "Thé vert au jasmin", price: 12, emoji: "🍵", allergens: [] },
    { name: "Bubble tea", price: 28, emoji: "🧋", allergens: ["lait"] }
  ],
  india: [
    { name: "Mango Lassi", price: 25, emoji: "🥭", allergens: ["lait"] },
    { name: "Masala Chai", price: 15, emoji: "🍵", allergens: ["lait"] }
  ],
  mexico: [
    { name: "Horchata", price: 22, emoji: "🥤", allergens: ["lait", "fruits à coque"] },
    { name: "Agua de Jamaica", price: 20, emoji: "🌺", allergens: [] }
  ]
  // zid les 2 pays lokhrin b nafs tari9a
};

const CLASSIC_DRINKS = [
  { name: "Coca-Cola", price: 12, emoji: "🥤", allergens: [] },
  { name: "Fanta", price: 12, emoji: "🥤", allergens: [] },
  { name: "Sprite", price: 12, emoji: "🥤", allergens: [] },
  { name: "Eau minérale", price: 8, emoji: "💧", allergens: [] },
  { name: "Eau gazeuse", price: 12, emoji: "🫧", allergens: [] }
];

const JUICES = [
  { name: "Jus d'orange", price: 18, emoji: "🍊", allergens: [] },
  { name: "Jus de fraise", price: 22, emoji: "🍓", allergens: [] },
  { name: "Jus de mangue", price: 22, emoji: "🥭", allergens: [] },
  { name: "Jus de pomme", price: 18, emoji: "🍎", allergens: [] },
  { name: "Cocktail de fruits", price: 28, emoji: "🍹", allergens: ["fruits à coque"] }
];

function drinkCard(d) {
  return `
    <div class="drink-card">
      <div class="drink-emoji">${d.emoji}</div>
      <div class="drink-name">${d.name}</div>
      ${allergenBadges(d.allergens)}
      <div class="drink-bottom">
        <span class="drink-price">${d.price} DH</span>
        <button class="drink-add" onclick='addDrinkToCart(${JSON.stringify(d)})'>+</button>
      </div>
    </div>`;
}

function renderDrinks(countryKey) {
  const typical = DRINKS_BY_COUNTRY[countryKey] || [];
  const box = document.getElementById("drinks-section");
  if (!box) return;
  box.innerHTML = `
    <h3 class="drinks-title">🍹 Boissons typiques</h3>
    <div class="drinks-grid">${typical.map(drinkCard).join("")}</div>
    <h3 class="drinks-title">🥤 Boissons classiques</h3>
    <div class="drinks-grid">${CLASSIC_DRINKS.map(drinkCard).join("")}</div>
    <h3 class="drinks-title">🧃 Jus</h3>
    <div class="drinks-grid">${JUICES.map(drinkCard).join("")}</div>`;
}

// ⚠️ 3AWED SMIYA DIAL FONCTION DIAL PANIER 3NDEK
function addDrinkToCart(d) {
  addToCart(d.name, d.price);
}

// ================= 3. CODE PROMO =================
const PROMOS = {
  "YAHYA10":   { type: "percent", value: 10, label: "-10%" },
  "BIENVENUE": { type: "percent", value: 15, label: "-15%" },
  "ANNIV":     { type: "fixed",   value: 30, label: "-30 DH" }
};
let appliedPromo = null;

function applyPromoCode() {
  const code = document.getElementById("promo-input").value.trim().toUpperCase();
  const msg = document.getElementById("promo-msg");
  if (PROMOS[code]) {
    appliedPromo = PROMOS[code];
    msg.textContent = "✅ Code appliqué: " + appliedPromo.label;
    msg.style.color = "#4caf50";
  } else {
    appliedPromo = null;
    msg.textContent = "❌ Code invalide";
    msg.style.color = "#ff5252";
  }
  if (typeof updateCart === "function") updateCart(); // 3awed smiya dial fonction li kat3awd tsab lpanier
}

function getDiscount(subtotal) {
  if (!appliedPromo) return 0;
  const d = appliedPromo.type === "percent" ? subtotal * appliedPromo.value / 100 : appliedPromo.value;
  return Math.min(d, subtotal);
}

// ================= 4. QR CODE =================
function showOrderQR(orderId, total) {
  const box = document.getElementById("order-qr");
  if (!box) return;
  box.innerHTML = "";
  new QRCode(box, {
    text: `Jeddour's Table | Commande #${orderId} | Total: ${total} DH`,
    width: 160,
    height: 160
  });
}

// ================= 5. OCCASION =================
const OCCASION_NOTES = {
  anniversaire: "🎂 Gâteau d'anniversaire offert + décoration de table!",
  romantique: "🌹 Table décorée avec bougies",
  fiancailles: "💍 Dessert offert pour célébrer",
  famille: "Nous préparons une grande table pour vous",
  business: "Table calme, loin du bruit"
};

const occasionSelect = document.getElementById("res-occasion");
if (occasionSelect) {
  occasionSelect.addEventListener("change", e => {
    document.getElementById("occasion-note").textContent = OCCASION_NOTES[e.target.value] || "";
  });
}

// ================= 6. WHATSAPP =================
const WHATSAPP_NUMBER = "212600000000"; // ⚠️ 7ot nmra dialek b 212 bla 0 w bla +

function sendWhatsApp(text) {
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
}

function whatsappOrder(orderId, itemsText, total) {
  sendWhatsApp(`Salam, commande #${orderId}\n${itemsText}\nTotal: ${total} DH`);
}

function whatsappReservation(name, date, time, people, occasion) {
  sendWhatsApp(`Salam, réservation\nNom: ${name}\nDate: ${date} à ${time}\nPersonnes: ${people}\nOccasion: ${occasion || "-"}`);
}

    const wanted = new URLSearchParams(location.search).get("c");
    show(list.some((x) => x.id === wanted) ? wanted : list[0].id);
  });window.addEventListener("error", (e) => alert("Erreur JS: " + e.message + " (" + e.filename.split("/").pop() + ":" + e.lineno + ")"));
window.addEventListener("unhandledrejection", (e) => alert("Erreur: " + e.reason));
