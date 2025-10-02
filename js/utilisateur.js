
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

    // Config Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDayay9CL8GRjxKjyupEOvOhrb1Suuh-jw",
      authDomain: "tontine-9ea4a.firebaseapp.com",
      databaseURL: "https://tontine-9ea4a-default-rtdb.firebaseio.com",
      projectId: "tontine-9ea4a",
      storageBucket: "tontine-9ea4a.appspot.com",
      messagingSenderId: "855693297703",
      appId: "1:855693297703:web:ff841c9933757b57702602"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Sidebar
    const btn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    btn.addEventListener('click', () => sidebar.classList.toggle('-translate-x-full'));

    // Modal
    const modal = document.getElementById("modal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    openModal.addEventListener("click", () => modal.classList.remove("hidden"));
    closeModal.addEventListener("click", () => modal.classList.add("hidden"));
    window.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

    function toggleMenu() {
      const submenu = document.getElementById("submenu");
      const arrow = document.getElementById("arrow");
      submenu.classList.toggle("hidden");
      arrow.classList.toggle("rotate-180");
    }

    // Tableau
    let membres = [];

    // Compteurs
    function mettreAJourCompteurs() {
      const actifs = membres.filter(m => m.Statut === "Actif").length;
      const bloques = membres.filter(m => m.Statut === "Bloqué").length;
      const total = membres.length;

      document.getElementById("actifs").textContent = `Membres Actifs: ${actifs}`;
      document.getElementById("bloques").textContent = `Membres Bloqués: ${bloques}`;
      document.getElementById("tous").textContent = `Total Effectif: ${total}`;
    }

    function afficherTableau(filtre) {
      const tbody = document.getElementById("table-body");
      tbody.innerHTML = "";

      const filtres = membres.filter(m => filtre === "Tous" ? true : m.Statut === filtre);

      filtres.forEach((m, index) => {
        tbody.innerHTML += `
          <tr class="border">
            <td class="p-2">${m.nom}</td>
            <td class="p-2">${m.date}</td>
            <td class="p-2">${m.Seuil}</td>
            <td class="p-2">${m.Progression}</td>
            <td class="p-2">
              <button class="toggleStatut ${m.Statut === 'Actif' ? 'text-green-500' : 'text-red-500'}" data-id="${m.id}">
                ${m.Statut}
              </button>
            </td>
          </tr>
        `;
      });

      // Ajouter la fonctionnalité de changement de statut
      document.querySelectorAll(".toggleStatut").forEach(btn => {
        btn.addEventListener("click", async () => {
          const index = membres.findIndex(m => m.id === btn.dataset.id);
          if (index !== -1) {
            const m = membres[index];
            const nouveauStatut = m.Statut === "Actif" ? "Bloqué" : "Actif";
            // Mettre à jour dans Firebase
            const docRef = doc(db, "membres", m.id);
            await updateDoc(docRef, { Statut: nouveauStatut });
            // Mettre à jour localement
            membres[index].Statut = nouveauStatut;
            afficherTableau("Tous");
          }
        });
      });

      mettreAJourCompteurs();
    }

    // Filtrer
    document.getElementById("actifs").addEventListener("click", () => afficherTableau("Actif"));
    document.getElementById("bloques").addEventListener("click", () => afficherTableau("Bloqué"));
    document.getElementById("tous").addEventListener("click", () => afficherTableau("Tous"));

    // Ajouter membre
    document.getElementById("ajouterMembre").addEventListener("click", async (e) => {
      e.preventDefault();

      const nouveauMembre = {
        nom: document.getElementById("nom").value + " " + document.getElementById("prenom").value,
        date: new Date().toLocaleDateString("fr-FR"),
        Seuil: "0 CFA",
        Progression: "0%",
        Statut: "Actif",
        naissance: document.getElementById("naissance").value,
        profession: document.getElementById("profession").value,
        email: document.getElementById("email").value,
        tel: document.getElementById("tel").value,
        adresse: document.getElementById("adresse").value,
        organisation: document.getElementById("organisation").value,
      };

      try {
        const docRef = await addDoc(collection(db, "membres"), nouveauMembre);
        nouveauMembre.id = docRef.id; // Ajouter l'ID pour gérer le changement de statut
        membres.push(nouveauMembre);
        afficherTableau("Tous");
        modal.classList.add("hidden");
        document.getElementById("formMembre").reset();
        console.log("✅ Membre ajouté dans Firebase");
      } catch (e) {
        console.error("❌ Erreur Firebase :", e);
      }
    });

    // Charger les membres existants depuis Firebase
    async function chargerMembres() {
      const querySnapshot = await getDocs(collection(db, "membres"));
      membres = [];
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        data.id = docSnap.id;
        membres.push(data);
      });
      afficherTableau("Tous");
    }

    chargerMembres();
