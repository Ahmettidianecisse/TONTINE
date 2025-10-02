// /js/inscription.js - Version corrigée
import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Fonction pour déterminer le rôle
function determineRole(email) {
    if (email === "admin@bakeli.com") return "admin";
    return "user";
}

// Fonction principale d'enregistrement
async function registerUser(formData) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.motDePasse);
        const user = userCredential.user;
        const userRole = determineRole(formData.email);
        const displayName = `${formData.prenom} ${formData.nom}`;

        // Mise à jour du profil Auth
        await updateProfile(user, { displayName });

        // Création du document utilisateur dans Firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            email: formData.email,
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            role: userRole,
            createdAt: serverTimestamp()
        });

        console.log("✅ Inscription réussie pour l'UID:", user.uid);
        alert(`Bienvenue ${formData.prenom} ! Votre compte est créé. Rôle: ${userRole}`);
        window.location.href = 'connexion.html';

    } catch (error) {
        console.error("ERREUR FIREBASE:", error.code, error.message);
        let message = "Une erreur est survenue lors de l'inscription.";
        if (error.code === 'auth/email-already-in-use') message = "Cet email est déjà utilisé.";
        else if (error.code === 'auth/invalid-email') message = "Format de l'email invalide.";
        else if (error.code === 'auth/weak-password') message = "Mot de passe trop faible (min. 6 caractères).";
        alert(message);
    }
}

// Gestionnaire du formulaire
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inscriptionForm");
    if(form){
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = {
                email: document.getElementById('email').value.trim(),
                motDePasse: document.getElementById('mot_de_passe').value,
                nom: document.getElementById('nom').value.trim(),
                prenom: document.getElementById('prenom').value.trim(),
                telephone: document.getElementById('telephone').value.trim(),
            };

            if(!formData.email || !formData.motDePasse || formData.motDePasse.length < 6 || !formData.nom || !formData.prenom){
                alert("Veuillez remplir tous les champs et mettre un mot de passe d'au moins 6 caractères.");
                return;
            }

            await registerUser(formData);
        });
    } else {
        console.error("Erreur critique: L'ID du formulaire 'inscriptionForm' est introuvable sur cette page.");
    }
});
