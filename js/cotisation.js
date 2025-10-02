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
// Remplir tableau et cartes
// ======================

// Références Firebase (à adapter selon ton projet)
const db = firebase.firestore(); // si tu utilises Firestore
const cotisationsRef = db.collection("cotisations"); // nom de ta collection

// Fonction pour récupérer les cotisations
function fetchCotisations() {
  // Vider le tableau avant de remplir
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  // Les valeurs pour les cartes
  let totalCaisse = 0;
  let moisJuin = 0;
  let moisMai = 0;

  // Ici tu mets la logique Firebase
  // Exemple avec Firestore
  cotisationsRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Exemple de structure de données : 
      // data = { membre: "Nom", dateDebut: "2025-06-01", seuil: 5000, progression: 3000, statut: "Actif" }

      // Ajouter une ligne au tableau
      tbody.innerHTML += `
        <tr class="border">
          <td class="p-2">${data.membre}</td>
          <td class="p-2">${data.dateDebut}</td>
          <td class="p-2">${data.seuil} CFA</td>
          <td class="p-2">${data.progression} CFA</td>
          <td class="p-2">${data.statut}</td>
        </tr>
      `;

      // Calcul des totaux pour les cartes
      totalCaisse += data.progression;

      const month = new Date(data.dateDebut).getMonth() + 1; // 1 = Janvier
      if (month === 6) moisJuin += data.progression;
      if (month === 5) moisMai += data.progression;
    });

    // Mettre à jour les cartes
    document.getElementById("actifs").querySelector("h1").textContent = moisJuin + " CFA";
    document.getElementById("bloques").querySelector("h1").textContent = moisMai + " CFA";
    document.getElementById("tous").querySelector("h1").textContent = totalCaisse + " CFA";
  }).catch((error) => {
    console.error("Erreur récupération cotisations :", error);
  });
}

// Appel initial
fetchCotisations();
