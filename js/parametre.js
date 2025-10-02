// Sidebar toggle
    const btn = document.getElementById("menu-btn");
    const sidebar = document.getElementById("sidebar");

    btn.addEventListener("click", () => {
      sidebar.classList.toggle("-translate-x-full");
    });

    // Sous-menu toggle
    function toggleMenu() {
      const submenu = document.getElementById("submenu");
      const arrow = document.getElementById("arrow");
      submenu.classList.toggle("hidden");
      arrow.classList.toggle("rotate-180");
    }

    // Modal
    const modal = document.getElementById("modal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");

    openModal.addEventListener("click", () => modal.classList.remove("hidden"));
    closeModal.addEventListener("click", () => modal.classList.add("hidden"));