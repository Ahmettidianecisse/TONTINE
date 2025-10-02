/* js/dashboard.js */
import { db } from "../firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { protectAdminPage } from "./protect.js";
import { logout } from "../auth.js";

protectAdminPage();

// logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) logoutBtn.addEventListener("click", logout);

async function loadDashboard() {
  let totalCaisse = 0;
  let cotationJuin = 0;
  let cotationMai = 0;
  const evolution = Array(12).fill(0);

  const snap = await getDocs(collection(db, "cotisations"));
  snap.forEach(s => {
    const d = s.data();
    const montant = Number(d.montant || 0);
    const date = d.date ? new Date(d.date) : null;
    totalCaisse += montant;
    if (date) {
      const m = date.getMonth() + 1;
      evolution[m-1] += montant;
      if (m === 6) cotationJuin += montant;
      if (m === 5) cotationMai += montant;
    }
  });

  document.getElementById("totalCaisse").textContent = totalCaisse + " CFA";
  document.getElementById("cotisationJuin").textContent = cotationJuin + " CFA";
  document.getElementById("cotisationMai").textContent = cotationMai + " CFA";

  renderChart(evolution);
}

function renderChart(data){
  const ctx = document.getElementById("lineChart").getContext("2d");
  new Chart(ctx, {
    type:"line",
    data:{
      labels:["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"],
      datasets:[{ label:"Cotisations", data, borderColor:"#0A3545", backgroundColor:"rgba(32,223,127,0.3)", tension:0.4, fill:true }]
    }
  });
}

loadDashboard();
