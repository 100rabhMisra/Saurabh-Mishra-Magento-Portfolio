const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const yearEl = document.getElementById("year");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("active");
  });
}

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 760) {
      mainNav.classList.remove("active");
    }
  });
});

const expertiseCards = document.querySelectorAll(".expertise-card");

expertiseCards.forEach((card) => {
  card.addEventListener("click", () => {
    expertiseCards.forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
  });
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function updateLocalTime() {
  document.querySelectorAll("[data-local-time]").forEach((element) => {
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(new Date()).toLowerCase();

    element.textContent = `${time} local time`;
  });
}

updateLocalTime();
setInterval(updateLocalTime, 60000);

const hireMeButton = document.getElementById("hireMeButton");

if (hireMeButton) {
  hireMeButton.addEventListener("click", () => {
    const message = encodeURIComponent(
      "Hello Saurabh, I visited your portfolio and would like to discuss a project/hiring opportunity with you."
    );
    window.open(`https://wa.me/919911053033?text=${message}`, "_blank", "noopener,noreferrer");
    window.setTimeout(() => {
      window.location.href = "tel:+919911053033";
    }, 300);
  });
}

const documentAccessButtons = document.querySelectorAll(
  "#documentAccessButton, .document-access-trigger"
);
const documentModal = document.getElementById("documentModal");
const documentPasswordForm = document.getElementById("documentPasswordForm");
const documentPassword = document.getElementById("documentPassword");
const documentAccessError = document.getElementById("documentAccessError");
const documentFolder = document.getElementById("documentFolder");

function closeDocumentModal() {
  if (!documentModal) return;
  documentModal.classList.remove("is-open");
  documentModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  documentPasswordForm?.reset();
  documentPassword?.removeAttribute("aria-invalid");
  if (documentAccessError) documentAccessError.textContent = "";
  if (documentFolder) documentFolder.hidden = true;
  documentPasswordForm?.removeAttribute("hidden");
}

if (documentAccessButtons.length && documentModal) {
  documentAccessButtons.forEach((button) => {
    button.addEventListener("click", () => {
    documentModal.classList.add("is-open");
    documentModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => documentPassword?.focus(), 50);
    });
  });

  documentModal.querySelectorAll("[data-close-documents]").forEach((button) => {
    button.addEventListener("click", closeDocumentModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && documentModal.classList.contains("is-open")) {
      closeDocumentModal();
    }
  });
}

if (documentPasswordForm) {
  documentPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (documentPassword?.value !== "991105") {
      documentPassword?.setAttribute("aria-invalid", "true");
      documentAccessError.textContent = "Incorrect password. Please try again.";
      documentPassword?.select();
      return;
    }

    documentPassword?.removeAttribute("aria-invalid");
    documentAccessError.textContent = "";
    documentPasswordForm.hidden = true;
    documentFolder.hidden = false;
  });
}