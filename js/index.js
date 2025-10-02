// connexion.js
import { auth, db } from "../firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function redirectBasedOnRole(uid) {
  try {
    const userDocRef = doc(db, 'membres', uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const role = docSnap.data().role;

      if (role === 'admin') {
        window.location.href = 'dashord.html';
      } else {
        window.location.href = 'user_dashboard.html';
      }
    } else {
      alert("Erreur: Profil utilisateur introuvable dans Firestore.");
      await auth.signOut();
    }
  } catch (error) {
    alert("Erreur de vérification du rôle : " + error.message);
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm.email.value.trim();
    const motDePasse = loginForm.mot_de_passe.value;

    const errorMdp = document.getElementById('error-mot_de_passe');

    if (motDePasse.length < 8) {
      errorMdp.classList.remove('hidden');
      return;
    } else {
      errorMdp.classList.add('hidden');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, motDePasse);
      const user = userCredential.user;

      await redirectBasedOnRole(user.uid);
    } catch (error) {
      let message = "Erreur de connexion.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Email ou mot de passe incorrect.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Adresse email invalide.";
      }

      alert(message);
      console.error(error);
    }
  });
});
