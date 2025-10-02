/* js/protect.js - protect admin pages */
import { auth, db } from "..firebase.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export function protectAdminPage() {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    const snap = await getDoc(doc(db, "utilisateurs", user.uid));
    const info = snap.exists() ? snap.data() : null;
    if (!info || info.role !== "admin") {
      alert("Accès refusé : réservé aux administrateurs.");
      window.location.href = "index.html";
      return;
    }
  });
}
