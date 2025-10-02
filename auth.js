// =========================
// auth.js — Module commun
// Gestion Authentification + Protection pages + Logout
// =========================
import { auth, db } from "./firebase.js";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { doc, setDoc, getDoc, collection, getDocs, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// =========================
// INSCRIPTION
// =========================
export async function registerUser(formData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.mot_de_passe);
    const user = userCredential.user;

    const role = (formData.email === "admin@bakeli.com") ? "admin" : "user";
    await updateProfile(user, { displayName: `${formData.prenom} ${formData.nom}` });

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      nom: formData.nom,
      prenom: formData.prenom,
      date_naissance: formData.date_naissance,
      profession: formData.profession,
      email: formData.email,
      telephone: formData.telephone,
      adresse: formData.adresse,
      role,
      createdAt: serverTimestamp()
    });

    const modal = document.getElementById("inscriptionSuccessModal");
    if(modal){
      modal.classList.remove("hidden");
      modal.style.display = 'flex';
    }

  } catch (error) {
    let message = "❌ Une erreur inconnue est survenue : " + error.message;
    if (error.code === "auth/email-already-in-use") message = "⚠️ Cet e-mail est déjà utilisé.";
    else if (error.code === "auth/weak-password") message = "⚠️ Mot de passe trop faible (8 caractères minimum).";
    else if (error.code === "auth/invalid-email") message = "⚠️ Format d'e-mail invalide.";

    alert(message);
    console.error("Erreur Firebase:", error);
  }
}

// =========================
// CONNEXION
// =========================
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if(userDoc.exists()){
      const role = userDoc.data().role;
      if(role === "admin") window.location.href = "admin-dashboard.html";
      else window.location.href = "user-dashboard.html";
    } else {
      alert("Profil utilisateur introuvable. Déconnexion.");
      logout();
    }

  } catch (error) {
    let message = "Échec de la connexion.";
    if(error.code === "auth/user-not-found" || error.code === "auth/wrong-password"){
      message = "Email ou mot de passe incorrect.";
    } else if(error.code === "auth/invalid-email"){
      message = "Format d'email invalide.";
    }
    alert(message);
    console.error("Erreur Firebase:", error);
  }
}

// =========================
// DECONNEXION
// =========================
export function logout() {
  signOut(auth)
    .then(() => window.location.href = "index.html")
    .catch((error) => alert("Erreur de déconnexion: " + error.message));
}

// =========================
// PROTECTION DES PAGES
// roleAllowed = "admin", "user" ou ["admin","user"]
// =========================
export function protectPage(roleAllowed) {
  onAuthStateChanged(auth, async (user) => {
    if(!user){
      window.location.href = "index.html";
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if(!userDoc.exists()){
      logout();
      return;
    }

    const role = userDoc.data().role;
    if(Array.isArray(roleAllowed)){
      if(!roleAllowed.includes(role)) window.location.href = "index.html";
    } else {
      if(role !== roleAllowed) window.location.href = "index.html";
    }
  });
}

// =========================
// MIGRATION : AJOUT DES ROLES MANQUANTS
// =========================
export async function addMissingRoles() {
  try {
    const snap = await getDocs(collection(db, "users"));
    let updatedCount = 0;

    for(const d of snap.docs){
      const data = d.data();
      if(!data.role){
        await updateDoc(doc(db, "users", d.id), { role: "user" });
        console.log("✅ Rôle ajouté pour UID:", d.id);
        updatedCount++;
      }
    }

    console.log(`Migration terminée. ${updatedCount} utilisateur(s) mis à jour.`);
    alert(`Migration terminée. ${updatedCount} utilisateur(s) mis à jour.`);

  } catch(error) {
    console.error("Erreur lors de la mise à jour des rôles:", error);
    alert("Erreur lors de la migration des rôles.");
  }
}

// =========================
// INITIALISATION DES FORMULAIRES
// =========================
document.addEventListener("DOMContentLoaded", () => {
  // Inscription
  const form = document.getElementById("inscriptionForm");
  if(form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = {
        nom: form.nom.value.trim(),
        prenom: form.prenom.value.trim(),
        date_naissance: form.date_naissance.value,
        profession: form.profession.value.trim(),
        mot_de_passe: form.mot_de_passe.value,
        confirmer_mot_de_passe: form.confirmer_mot_de_passe.value,
        email: form.email.value.trim(),
        telephone: form.telephone.value.trim(),
        adresse: form.adresse.value.trim(),
        role: "user"
      };
      if(formData.mot_de_passe !== formData.confirmer_mot_de_passe){
        alert("Les mots de passe ne correspondent pas !");
        return;
      }
      registerUser(formData);
    });
  }

  // Connexion
  const loginForm = document.getElementById("loginForm");
  if(loginForm){
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.mot_de_passe.value;
      loginUser(email, password);
    });
  }
});
