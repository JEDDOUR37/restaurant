const scene = document.getElementById("scene");
const lid = document.getElementById("lid");
const hint = document.getElementById("hint");
const panel = document.getElementById("panel");
let countries = [];

fetch("data/countries.json")
  .then((r) => r.json())
  .then((data) => (countries = data));

function openTajine() {
  if (scene.classList.contains("open")) return;
  scene.classList.add("open");
  document.getElementById("flash").classList.add("go");
  ding();
  hint.textContent = "Khtar chno bghiti 👇";
}
document.querySelector(".tagine").addEventListener("click", openTajine);
hint.addEventListener("click", openTajine);

document.getElementById("btnCuisines").addEventListener("click", () => {
  panel.innerHTML = countries.map((c, i) =>
    `<a class="pflag" style="--c:${c.couleur};--d:${i * 0.08}s" href="restaurant.html?c=${c.id}#carte">
       <img src="https://flagcdn.com/w80/${c.code}.png" alt="">
       <span>${c.nom}</span>
     </a>`).join("");
  panel.scrollIntoView({ behavior: "smooth", block: "end" });
});

// smia kat tban 7arf b 7arf
const title = document.getElementById("title");
title.innerHTML = [...title.textContent]
  .map((ch, i) => `<span style="--i:${i}">${ch === " " ? "&nbsp;" : ch}</span>`)
  .join("");

// ghobar dhabi
const cv = document.getElementById("dust");
const ctx = cv.getContext("2d");
const dots = [];
function size() { cv.width = innerWidth; cv.height = innerHeight; }
size();
addEventListener("resize", size);
for (let i = 0; i < 70; i++) {
  dots.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight,
              r: Math.random() * 2 + 0.5, v: Math.random() * 0.4 + 0.15, a: Math.random() });
}
(function loop() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  for (const d of dots) {
    d.y -= d.v;
    d.x += Math.sin(d.y / 40) * 0.3;
    if (d.y < -5) { d.y = cv.height + 5; d.x = Math.random() * cv.width; }
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, 6.283);
    ctx.fillStyle = `rgba(255,200,110,${d.a * 0.6})`;
    ctx.fill();
  }
  requestAnimationFrame(loop);
})();

// son "ding"
function ding() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1320].forEach((f, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      const t = ac.currentTime + i * 0.1;
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 1.5);
    });
  } catch (e) {}
}window.addEventListener("error", (e) => alert("Erreur JS: " + e.message + " (" + e.filename.split("/").pop() + ":" + e.lineno + ")"));
window.addEventListener("unhandledrejection", (e) => alert("Erreur: " + e.reason));
