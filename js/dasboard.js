// ======================
// Menu Hamburger Sidebar
// ======================
const btn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");

btn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
});

// ======================
// Toggle Paramètres
// ======================
function toggleMenu() {
  const submenu = document.getElementById("submenu");
  const arrow = document.getElementById("arrow");

  if (submenu.style.maxHeight) {
    // Le sous-menu est ouvert, on le ferme
    submenu.style.maxHeight = null;
    submenu.style.opacity = 0;
  } else {
    // Le sous-menu est fermé, on l'ouvre
    submenu.style.maxHeight = submenu.scrollHeight + "px";
    submenu.style.opacity = 1;
  }
  arrow.classList.toggle("rotate-180");
}

// ======================
// Firebase (à compléter)
// ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ⚠️ Mets tes vraies infos de projet Firebase ici
const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "TON_SENDER_ID",
  appId: "TON_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ======================
// Graphiques Chart.js
// ======================

// Line chart (évolution des cotisations)
const lineCanvas = document.getElementById("lineCanvas");

const lineChart = new Chart(lineCanvas, {
  type: "line",
  data: {
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet"],
    datasets: [
      {
        label: "Cotisations (CFA)",
        data: [0, 20, 35, 40, 50, 70, 80],
        borderColor: "#0A3545",
        backgroundColor: "rgba(10, 53, 69, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
});

// Pie chart (statuts des cotisations)
const barCanvas = document.getElementById("barCanvas");

const barChart = new Chart(barCanvas, {
  type: "pie",
  data: {
    labels: ["Terminé", "En cours", "Achevé", "Bloqué"],
    datasets: [
      {
        data: [18, 23, 10, 100], // 🔥 Ici aussi, les valeurs viendront de Firebase
        backgroundColor: ["#20DF7F", "pink", "#f1566ad5", "#0A3545"],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  },
});

// ======================
// Fonctions Firebase
// ======================

// Charger toutes les cotisations
async function loadCotisations() {
  const querySnapshot = await getDocs(collection(db, "cotisations"));
  const cotisations = [];
  querySnapshot.forEach((doc) => {
    cotisations.push(doc.data());
  });

  // 👉 Ici on pourra mettre à jour le DOM, les graphiques et les tableaux
  updateCharts(cotisations);
  updateTables(cotisations);
}

// Mettre à jour les graphiques avec Firebase
function updateCharts(cotisations) {
  // Exemple : calcul du total par mois
  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet"];
  const dataByMonth = months.map((m) => {
    const total = cotisations
      .filter((c) => c.mois === m && c.statut === "Payé")
      .reduce((sum, c) => sum + (c.montant || 0), 0);
    return total;
  });

  // Mise à jour du line chart
  lineChart.data.datasets[0].data = dataByMonth;
  lineChart.update();

  // Exemple Pie chart : compter par statut
  const termine = cotisations.filter((c) => c.statut === "Payé").length;
  const enCours = cotisations.filter((c) => c.statut === "En attente").length;
  const bloque = cotisations.filter((c) => c.statut === "Bloqué").length;
  const acheve = cotisations.filter((c) => c.statut === "Achevé").length;

  barChart.data.datasets[0].data = [termine, enCours, acheve, bloque];
  barChart.update();
}

// Mettre à jour les tableaux
function updateTables(cotisations) {
  const tbody = document.querySelector("table tbody"); // 👉 adapter pour tes 2 tableaux
  tbody.innerHTML = "";

  cotisations.forEach((c) => {
    const row = `
      <tr>
        <td class="px-4 py-2">${c.membre || "?"}</td>
        <td class="px-4 py-2">${c.montant || 0} CFA</td>
        <td class="px-4 py-2">${c.date || "-"}</td>
        <td class="px-4 py-2">${c.statut}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ======================
// Exécution
// ======================
loadCotisations();
