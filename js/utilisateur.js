// ======================
// Données simulées
// ======================
let membres = [
  { membre: "Selena Roy", statut: "Actif", date: "01-03-2022", seuil: 50, progression: 40 },
  { membre: "Fatou Ndiaye", statut: "Bloqué", date: "05-03-2022", seuil: 30, progression: 20 },
  { membre: "Aliou Diop", statut: "Actif", date: "08-03-2022", seuil: 70, progression: 70 },
];

// ======================
// Sélection des éléments
// ======================
const boxActifs = document.getElementById("box-actifs");
const boxBloques = document.getElementById("box-bloques");
const boxTous = document.getElementById("box-tous");
const boxes = [boxActifs, boxBloques, boxTous];
const tbody = document.getElementById("table-body");

// Modal
const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const ajouterBtn = document.getElementById("ajouterMembre");
const form = document.getElementById("formMembre");

// ======================
// Fonctions localStorage
// ======================
function saveToLocalStorage() {
  localStorage.setItem("membres", JSON.stringify(membres));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("membres");
  if (data) {
    membres = JSON.parse(data);
  }
}

// ======================
// Fonctions principales
// ======================
function remplirTableau(filtre = "Tous") {
  tbody.innerHTML = "";
  let data = membres;
  if (filtre === "Actif") data = membres.filter(m => m.statut === "Actif");
  if (filtre === "Bloqué") data = membres.filter(m => m.statut === "Bloqué");

  data.forEach(m => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">${m.membre}</td>
      <td class="p-2">${m.date}</td>
      <td class="p-2">${m.seuil}%</td>
      <td class="p-2">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-green-500 h-2 rounded-full" style="width:${m.progression}%"></div>
        </div>
      </td>
      <td class="p-2">${m.statut}</td>
    `;
    tbody.appendChild(row);
  });

  // Mettre à jour les compteurs
  boxActifs.innerText = `Membres Actifs: ${membres.filter(m => m.statut === "Actif").length}`;
  boxBloques.innerText = `Membres Bloqués: ${membres.filter(m => m.statut === "Bloqué").length}`;
  boxTous.innerText = `Total Effectif: ${membres.length}`;
}

function setActiveBox(selectedBox) {
  boxes.forEach(b => b.classList.remove("box-active"));
  selectedBox.classList.add("box-active");
}

// ======================
// Gestion box clic
// ======================
boxActifs.addEventListener("click", () => { remplirTableau("Actif"); setActiveBox(boxActifs); });
boxBloques.addEventListener("click", () => { remplirTableau("Bloqué"); setActiveBox(boxBloques); });
boxTous.addEventListener("click", () => { remplirTableau("Tous"); setActiveBox(boxTous); });

// ======================
// Gestion modal
// ======================
openModal.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));

// ======================
// Ajouter un membre
// ======================
ajouterBtn.addEventListener("click", () => {
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const date = document.getElementById("dateDebut").value;
  const statut = document.getElementById("statut").value;

  if (!nom || !prenom || !date) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  membres.push({
    membre: `${nom} ${prenom}`,
    date,
    statut,
    seuil: 0,
    progression: 0
  });

  // ⚡ Sauvegarder dans localStorage
  saveToLocalStorage();

  // Mettre à jour le tableau selon la box active
  const activeBox = boxes.find(b => b.classList.contains("box-active"));
  if (activeBox === boxActifs) remplirTableau("Actif");
  else if (activeBox === boxBloques) remplirTableau("Bloqué");
  else remplirTableau("Tous");

  modal.classList.add("hidden");
  form.reset();
});

// ======================
// Initialisation
// ======================
loadFromLocalStorage();
remplirTableau("Tous");
setActiveBox(boxTous);
