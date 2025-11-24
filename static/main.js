document.addEventListener("DOMContentLoaded", () => {
  const menuTrigger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu-panel");

  menuTrigger.addEventListener("click", (event) => {
    menuTrigger.classList.toggle("active");
    menu.classList.toggle("open");
  });

  // toggle dark mode by system/browser settings
  // if (
  //   window.matchMedia &&
  //   window.matchMedia("(prefers-color-scheme: dark)").matches
  // ) {
  //   document.documentElement.classList.toggle('dark');
  // }

  // toggle dark mode by click
  const prefersColorSchemeTrigger = document.querySelector(".color-scheme");
  const sun = document.querySelector(".sun");
  const moon = document.querySelector(".moon");

  prefersColorSchemeTrigger.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    if (localStorage.getItem("prefersColorScheme")) {
      localStorage.removeItem("prefersColorScheme");
      moon.style.display = "block";
      sun.style.display = "none";
    } else {
      localStorage.setItem("prefersColorScheme", "dark");
      sun.style.display = "block";
      moon.style.display = "none";
    }
  });

  if (localStorage.getItem("prefersColorScheme")) {
    document.documentElement.classList.add("dark");
    sun.style.display = "block";
    moon.style.display = "none";
  }

  // Modal functionality
  const funderCards = document.querySelectorAll(".funder.card-link");

  funderCards.forEach((card) => {
    card.addEventListener("click", function (event) {
      // Find the modal within this funder card
      const modal = this.querySelector(".modal");
      if (modal) {
        modal.classList.add("open");
        document.body.classList.add("modal-open");
      }
    });
  });

  // Close modal when clicking outside or on close button
  document.addEventListener("click", function (event) {
    // Close if clicking on modal backdrop (outside content)
    if (
      event.target.classList.contains("modal") &&
      event.target.classList.contains("open")
    ) {
      closeModal(event.target);
    }

    // Close if clicking on close button
    if (event.target.classList.contains("modal-close")) {
      const modal = event.target.closest(".modal");
      if (modal) {
        closeModal(modal);
      }
    }

    // Alternative: Close if clicking outside modal content
    const openModal = document.querySelector(".modal.open");
    if (
      openModal &&
      !event.target.closest(".modal-content") &&
      !event.target.closest(".funder.card-link")
    ) {
      closeModal(openModal);
    }
  });

  // Close modal function
  function closeModal(modal) {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      const openModal = document.querySelector(".modal.open");
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
});
