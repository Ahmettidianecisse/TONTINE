// ======================
// Toggle sous-menu
// ======================
function toggleMenu() {
  const submenu = document.getElementById("submenu");
  const arrow = document.getElementById("arrow");

  submenu.classList.toggle("hidden");
  arrow.classList.toggle("rotate-180");
}

// ======================
// Menu hamburger
// ======================
const btn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');

btn.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full');
});

// ======================
// Données simulées
// ======================
const cotisations = [
  { membre: "Selena Roy", dateDebut: "2025-06-01", seuil: 5000, progression: 3000, statut: "Actif" },
  { membre: "Fatou Ndiaye", dateDebut: "2025-05-15", seuil: 7000, progression: 4000, statut: "Actif" },
  { membre: "Aliou Diop", dateDebut: "2025-06-10", seuil: 6000, progression: 6000, statut: "Bloqué" },
  { membre: "Moussa Fall", dateDebut: "2025-06-12", seuil: 8000, progression: 5000, statut: "Actif" },
  { membre: "Aïssatou Sow", dateDebut: "2025-05-20", seuil: 5500, progression: 5500, statut: "Bloqué" },
];

// ======================
// Remplir tableau et cartes
// ======================
function remplirTableau() {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  let totalCaisse = 0;
  let moisJuin = 0;
  let moisMai = 0;

  cotisations.forEach(data => {
    // Ajouter ligne au tableau
    tbody.innerHTML += `
      <tr class="border">
        <td class="p-2">${data.membre}</td>
        <td class="p-2">${data.dateDebut}</td>
        <td class="p-2">${data.seuil} CFA</td>
        <td class="p-2">${data.progression} CFA</td>
        <td class="p-2">${data.statut}</td>
      </tr>
    `;

    // Calcul des totaux
    totalCaisse += data.progression;
    const month = new Date(data.dateDebut).getMonth() + 1; // 1 = Janvier
    if (month === 6) moisJuin += data.progression;
    if (month === 5) moisMai += data.progression;
  });

  // Mettre à jour les cartes
  document.getElementById("actifs").querySelector("h1").textContent = moisJuin + " CFA";
  document.getElementById("bloques").querySelector("h1").textContent = moisMai + " CFA";
  document.getElementById("tous").querySelector("h1").textContent = totalCaisse + " CFA";
}

// Appel initial
remplirTableau();
