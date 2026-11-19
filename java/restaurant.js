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

    const wanted = new URLSearchParams(location.search).get("c");
    show(list.some((x) => x.id === wanted) ? wanted : list[0].id);
  });window.addEventListener("error", (e) => alert("Erreur JS: " + e.message + " (" + e.filename.split("/").pop() + ":" + e.lineno + ")"));
window.addEventListener("unhandledrejection", (e) => alert("Erreur: " + e.reason));