import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Fonction ajout membre par admin
async function addMember(email, name) {
  try {
    // 1. Créer un utilisateur Firebase Auth avec mot de passe temporaire
    const tempPassword = "Bakeli123"; // mot de passe provisoire
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    const user = userCredential.user;

    // 2. Sauvegarder dans Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "user",
      createdAt: new Date()
    });

    // 3. Envoyer email pour que le membre définisse son mot de passe
    await sendPasswordResetEmail(auth, email);

    alert(`Membre ajouté et email envoyé à ${email}`);
  } catch (error) {
    console.error("Erreur ajout membre:", error.message);
  }
}
