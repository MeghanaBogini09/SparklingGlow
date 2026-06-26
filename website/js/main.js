/* Sparkling Glow — Main JS */

/* Change this to your salon WhatsApp number (country code + number, no + or spaces) */
const SALON_WHATSAPP = "919959550153";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initReveal();
  initServiceTabs();
  initTestimonials();
  initForms();
  initCursorGlow();
  setMinDate();
});

/* Sticky header */
function initHeader() {
  const header = document.getElementById("header");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* Mobile navigation */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
    toggle.classList.toggle("active");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("active");
    });
  });
}

/* Scroll reveal */
function initReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.closest(".services-grid, .packages-grid, .gallery-grid")
            ? [...entry.target.parentElement.children].indexOf(entry.target) * 80
            : 0;
          setTimeout(() => entry.target.classList.add("visible"), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* Service category filter */
function initServiceTabs() {
  const tabs = document.querySelectorAll(".tab");
  const cards = document.querySelectorAll(".service-card");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.dataset.tab;

      cards.forEach((card) => {
        const match = category === "all" || card.dataset.category === category;
        card.classList.toggle("hidden", !match);

        if (match) {
          card.style.animation = "none";
          card.offsetHeight;
          card.style.animation = "";
        }
      });
    });
  });
}

/* Testimonial slider */
function initTestimonials() {
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  let current = 0;
  let interval;

  function show(index) {
    testimonials.forEach((t, i) => t.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    current = index;
  }

  function next() {
    show((current + 1) % testimonials.length);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      show(i);
      resetInterval();
    });
  });

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(next, 5000);
  }

  show(0);
  resetInterval();
}

/* Form handling */
let pendingWhatsAppUrl = "";

function initForms() {
  const contactForm = document.getElementById("contactForm");
  const newsletterForm = document.getElementById("newsletterForm");
  const waModal = document.getElementById("waModal");
  const waModalOpen = document.getElementById("waModalOpen");
  const waModalLink = document.getElementById("waModalLink");
  const waModalClose = document.getElementById("waModalClose");
  const waModalBackdrop = document.getElementById("waModalBackdrop");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const message = document.getElementById("message").value.trim();

    const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    let text = `Hello Sparkling Glow, I would like to book an appointment.\n\n`;
    text += `Name: ${name}\n`;
    text += `My Phone: ${phone}\n`;
    text += `Service: ${service}\n`;
    text += `Preferred Date: ${formattedDate}\n`;
    if (message) text += `Notes: ${message}\n`;

    pendingWhatsAppUrl = buildWhatsAppUrl(text);
    waModalLink.href = pendingWhatsAppUrl;
    waModalOpen.href = pendingWhatsAppUrl;
    waModal.hidden = false;
    document.body.style.overflow = "hidden";
  });

  function launchWhatsApp(e) {
    e.preventDefault();
    openWhatsApp(pendingWhatsAppUrl);
    waModal.hidden = true;
    document.body.style.overflow = "";
    contactForm.reset();
    setMinDate();
  }

  waModalOpen.addEventListener("click", launchWhatsApp);
  waModalLink.addEventListener("click", launchWhatsApp);

  function closeModal() {
    waModal.hidden = true;
    document.body.style.overflow = "";
  }

  waModalClose.addEventListener("click", closeModal);
  waModalBackdrop.addEventListener("click", closeModal);

  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("You're subscribed! Welcome to the glow club. ♡");
    newsletterForm.reset();
  });
}

function buildWhatsAppUrl(message) {
  return `https://api.whatsapp.com/send?phone=${SALON_WHATSAPP}&text=${encodeURIComponent(message)}`;
}

function openWhatsApp(url) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = url;
    return;
  }

  const win = window.open(url, "_blank");
  if (!win) {
    window.location.href = url;
  }
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

/* Cursor glow follow */
function initCursorGlow() {
  const glow = document.querySelector(".cursor-glow");
  if (!glow || window.matchMedia("(max-width: 768px)").matches) return;

  let x = 0, y = 0;
  let cx = 0, cy = 0;

  document.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
  });

  function animate() {
    cx += (x - cx) * 0.08;
    cy += (y - cy) * 0.08;
    glow.style.left = cx + "px";
    glow.style.top = cy + "px";
    requestAnimationFrame(animate);
  }
  animate();
}

/* Set minimum date to today */
function setMinDate() {
  const dateInput = document.getElementById("date");
  if (!dateInput) return;
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
}
