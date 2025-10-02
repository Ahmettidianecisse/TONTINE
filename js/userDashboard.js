import { auth, db } from "../firebase.js"; // Assumes db and auth are initialized here
import { initAuthGuard, logout } from "../auth.js"; // Assumes initAuthGuard is defined here
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; 

// Autorise uniquement les utilisateurs standards. Les admins seront redirigés.
initAuthGuard(['user']);

// quand auth est prêt :
document.addEventListener("auth-ready", async (e) => {
  const currentUser = e.detail; // L'utilisateur est garanti d'être un 'user' non-admin

  // Affiche l'email de l'utilisateur
  document.getElementById("userName").innerText = currentUser.email;

  // Récupérer cotisations de l'utilisateur
  const q = query(collection(db, "cotisations"), where("userId", "==", currentUser.uid));
  const snap = await getDocs(q);

  let total = 0;
  let lastPayment = "Aucun";
  const chartData = [];

  snap.forEach(docSnap => {
    const cot = docSnap.data();
    // Utiliser l'opérateur OR (|| 0) pour s'assurer que le montant est un nombre
    total += (cot.montant || 0); 
    chartData.push(cot.montant || 0);
    // lastPayment garde sa valeur précédente si cot.date est falsy (null, undefined, etc.)
    lastPayment = cot.date || lastPayment; 
  });

  document.getElementById("userTotalCotisation").innerText = total + " CFA";
  document.getElementById("lastPayment").innerText = lastPayment;

  // initialiser Chart.js 📈
  const ctx = document.getElementById("userChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      // Labels : [1, 2, 3, ...] pour chaque cotisation
      labels: chartData.map((_,i) => i+1), 
      datasets: [{
        label: "Mes cotisations",
        // Si aucune donnée, fournit 6 zéros pour initialiser le graphique
        data: chartData.length ? chartData : [0,0,0,0,0,0], 
        borderColor: "rgba(34, 197, 94, 1)", // Couleur par défaut de votre ancien code
        backgroundColor: "rgba(34, 197, 94, 0.2)" // Couleur par défaut de votre ancien code
      }]
    }
  });
});

// Ajoute un gestionnaire pour le bouton de déconnexion si vous en avez un
document.getElementById('logoutBtn')?.addEventListener('click', logout);