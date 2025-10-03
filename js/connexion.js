// js/connexion.js
import { auth, db } from "../firebase.js"; 
// import yuuuj from "../user/userDashboard.html"
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// --- LOGIQUE DE REDIRECTION BASÉE SUR LE RÔLE ---
async function redirectBasedOnRole(uid) {
    try {
          const userDocRef = doc(db, "users", uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const role = docSnap.data().role;

            if (role === "admin") {
                window.location.href = "../admin/dasboard.html"; 
            } else {
                window.location.href = "../user/dasboard-user.html";
            }
        } else {
            alert("⚠️ Profil utilisateur introuvable dans la base de donné .");
            await signOut(auth);
            window.location.href = "index.html";
        }
    } catch (error) {
        alert("Erreur lors de la vérification du rôle : " + error.message);
        console.error("Erreur Firestore:", error);
    }
}

// --- GESTION DU FORMULAIRE DE CONNEXION ---
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("mot_de_passe");

    if (!loginForm) {
        console.error("❌ Formulaire 'loginForm' introuvable dans la page !");
        return;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Empêche le rechargement et les données dans l’URL

        const email = emailInput.value.trim();
        const motDePasse = passwordInput.value;

        // --- Validation ---
        if (!email) {
            alert("Veuillez entrer votre email.");
            return;
        }
        if (motDePasse.length < 8) {
            alert("Le mot de passe doit avoir au moins 8 caractères.");
            return;
        }

        try {
            // 🔑 Connexion avec Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, motDePasse);
            const user = userCredential.user;

            // Vérification du rôle dans Firestore
            await redirectBasedOnRole(user.uid);

        } catch (error) {
            console.error("Erreur Firebase:", error);

            let errorMessage = "Échec de la connexion. Vérifiez vos informations.";
            switch (error.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                case "auth/invalid-credential":
                    errorMessage = "Email ou mot de passe incorrect.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Format d'email invalide.";
                    break;
            }
            alert(errorMessage);
        }
    });
});
