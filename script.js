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

const contactForm = document.getElementById("form");
const contactFormStatus = document.getElementById("contactFormStatus");

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const emailInput = contactForm.elements.email;
  const phoneInput = contactForm.elements.phone;
  const messageInput = contactForm.elements.message;
  const replyToInput = document.getElementById("replyToInput");
  const messageWordCount = document.getElementById("messageWordCount");

  const getWordCount = (value) => {
    const words = value.trim().match(/\S+/g);
    return words ? words.length : 0;
  };

  phoneInput?.addEventListener("input", () => {
    phoneInput.setCustomValidity("");
  });

  messageInput?.addEventListener("input", () => {
    const words = messageInput.value.trim().match(/\S+/g) || [];
    if (words.length > 500) {
      messageInput.value = words.slice(0, 500).join(" ");
    }
    const count = getWordCount(messageInput.value);
    if (messageWordCount) messageWordCount.textContent = `${count} / 500 words`;
  });

  emailInput?.addEventListener("input", () => {
    if (replyToInput) replyToInput.value = emailInput.value;
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailIsValid = emailInput?.value ? emailInput.validity.valid : false;
    const phoneDigits = phoneInput?.value.replace(/\D/g, "") || "";
    const phoneIsValid = phoneDigits.length >= 8 && phoneDigits.length <= 15;

    if (!emailIsValid) {
      emailInput?.reportValidity();
      return;
    }
    if (!phoneInput?.value.trim()) {
      phoneInput.setCustomValidity("Phone number is required.");
      phoneInput.reportValidity();
      phoneInput.focus();
      return;
    }
    if (!phoneIsValid) {
      phoneInput?.setCustomValidity("Enter a valid phone number containing 8 to 15 digits.");
      phoneInput?.reportValidity();
      phoneInput?.addEventListener("input", () => phoneInput.setCustomValidity(""), { once: true });
      return;
    }
    phoneInput?.setCustomValidity("");

    if (getWordCount(messageInput?.value || "") > 500) {
      if (messageWordCount) messageWordCount.textContent = "Please limit your message to 500 words.";
      messageInput?.focus();
      return;
    }

    const originalText = submitButton?.textContent || "Send Message";
    if (submitButton) {
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;
    }
    if (contactFormStatus) contactFormStatus.textContent = "";

    const formData = new FormData(contactForm);
    if (emailInput?.value.trim() && replyToInput) {
      replyToInput.value = emailInput.value.trim();
      formData.set("replyto", emailInput.value.trim());
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (response.ok && data.success) {
        if (contactFormStatus) {
          contactFormStatus.textContent = "Success! Your message has been sent.";
        }
        contactForm.reset();
        if (messageWordCount) messageWordCount.textContent = "0 / 500 words";
      } else {
        if (contactFormStatus) {
          contactFormStatus.textContent = `Error: ${data.message || "Unable to send your message."}`;
        }
      }
    } catch (error) {
      if (contactFormStatus) {
        contactFormStatus.textContent = "Something went wrong. Please try again.";
      }
    } finally {
      if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    }
  });
}