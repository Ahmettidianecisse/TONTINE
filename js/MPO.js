// mpo.js - Contient la logique Mot de passe oublié

import { auth } from "../firebase.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// --- Gestion Formulaire et Réinitialisation ---

document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (!forgotPasswordForm) return;

    const contactInfoInput = document.getElementById('contactInfo');
    const errorContactInfo = document.getElementById('error-contactInfo');
    const emailSentModal = document.getElementById('emailSentModal');
    const targetEmailDisplay = document.getElementById('targetEmailDisplay');
    const emailSentMessage = document.getElementById('emailSentMessage');
    const okEmailSentBtn = document.getElementById('okEmailSentBtn');

    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    const telephoneRegex = /^\d{9}$/;

    forgotPasswordForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const contactInfo = contactInfoInput.value.trim();
        
        errorContactInfo.classList.add('hidden');
        contactInfoInput.classList.remove('border-red-500');

        let isValid = false;
        let targetInfo = '';
        let targetEmail = ''; 

        // 1. C'est un numéro de téléphone (Utilisation de l'email simulé)
        if (telephoneRegex.test(contactInfo)) {
            isValid = true;
            targetInfo = contactInfo;
            targetEmail = `${contactInfo}@bakelitontine.com`; // Email simulé
            
            emailSentMessage.innerHTML = 'Si ce numéro est associé à un compte, un lien de réinitialisation par email a été envoyé (si le compte a été créé avec le numéro simulé).';
            targetEmailDisplay.style.display = 'none';

        // 2. C'est un E-mail
        } else if (emailRegex.test(contactInfo)) {
            isValid = true;
            targetEmail = contactInfo;
            
            // Masque l'email pour l'affichage
            const [user, domain] = contactInfo.split('@');
            const maskedUser = user.length > 3 ? user.substring(0, 1) + '***' + user.substring(user.length - 1) : user + '***';
            targetInfo = maskedUser + '@' + domain;
            
            emailSentMessage.innerHTML = 'Nous avons envoyé un e-mail à **<span id="targetEmailDisplay"></span>** avec un lien pour réinitialiser votre mot de passe.';
            targetEmailDisplay.style.display = 'inline';
        } else {
            errorContactInfo.textContent = 'Veuillez entrer un N° téléphone (9 chiffres) ou un E-mail valide (@gmail.com).';
            errorContactInfo.classList.remove('hidden');
            contactInfoInput.classList.add('border-red-500');
            contactInfoInput.focus();
            return; // Arrêter si la validation client échoue
        }

        // --- Appel Firebase ---
        if (isValid) {
            try {
                await sendPasswordResetEmail(auth, targetEmail);
                
                // Envoi réussi, afficher la modal
                targetEmailDisplay.textContent = targetInfo;
                emailSentModal.style.display = 'flex';
                contactInfoInput.value = '';
                
            } catch (error) {
                let errorMessage = "Échec de l'envoi. Cet identifiant n'existe peut-être pas.";
                if (error.code === 'auth/user-not-found') {
                    errorMessage = "Aucun utilisateur n'est associé à cet email/numéro.";
                }
                alert(errorMessage);
                console.error("Erreur Firebase:", error);
            }
        }
    });

    // Ferme la modal de confirmation
    okEmailSentBtn.addEventListener('click', () => {
        emailSentModal.style.display = 'none';
        // window.location.href = 'connexion.html'; 
    });
});