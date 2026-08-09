/* ===== Nav scroll state ===== */
const nav = document.getElementById("nav");
window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  },
  { passive: true },
);

/* ===== Mobile menu ===== */
const mm = document.getElementById("mobileMenu");
document
  .getElementById("navToggle")
  .addEventListener("click", () => mm.classList.add("open"));
document
  .getElementById("navClose")
  .addEventListener("click", () => mm.classList.remove("open"));
mm.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => mm.classList.remove("open")),
);

/* ===== Scroll reveal ===== */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -60px 0px" },
  );
  document.querySelectorAll(".rv, .rv-scale").forEach((el) => io.observe(el));
} else {
  document
    .querySelectorAll(".rv, .rv-scale")
    .forEach((el) => el.classList.add("in"));
}

/* ===== Coil dividers draw themselves in as they enter view ===== */
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
document.querySelectorAll(".coil-divider path").forEach((path) => {
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = reduceMotion ? 0 : len;
});
if ("IntersectionObserver" in window && !reduceMotion) {
  const dividerIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelector("path").style.strokeDashoffset = 0;
          dividerIO.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 },
  );
  document
    .querySelectorAll(".coil-divider")
    .forEach((el) => dividerIO.observe(el));
}

/* ===== Smooth scroll flow: hero dissolve + image parallax ===== */
if (!reduceMotion) {
  const heroVisual = document.querySelector(".hero-visual");
  const heroEl = document.getElementById("hero");
  const parallaxEls = Array.from(document.querySelectorAll("[data-parallax]"));
  let ticking = false;

  function updateScrollFlow() {
    const vh = window.innerHeight;

    // Hero dissolves smoothly into the About section as you scroll past it
    if (heroVisual && heroEl) {
      const heroRect = heroEl.getBoundingClientRect();
      const progress = Math.min(
        Math.max(-heroRect.top / (heroRect.height * 0.7), 0),
        1,
      );
      heroVisual.style.opacity = String(1 - progress);
      heroVisual.style.transform = `translateY(${progress * 40}px) scale(${1 - progress * 0.06})`;
    }

    // Subtle parallax drift on key images as they pass through the viewport
    parallaxEls.forEach((img) => {
      const rect = img.parentElement.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = vh / 2 - center;
      const norm = Math.max(-1, Math.min(1, dist / (vh / 2 + rect.height / 2)));
      const maxOffset = parseFloat(img.dataset.parallax) * 220 || 30;
      img.style.transform = `translateY(${norm * maxOffset}px) scale(1.04)`;
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollFlow);
        ticking = true;
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateScrollFlow);
  updateScrollFlow();
}

/* ===== Industries marquee content ===== */
const industries = [
  "Manufacturing Plants",
  "Engineering Industries",
  "Textile Industries",
  "Chemical & Pharmaceutical",
  "Food & Beverage Processing",
  "Cement Plants",
  "Water Treatment Facilities",
  "Infrastructure Projects",
  "Power Generation",
  "Agriculture & Irrigation",
  "OEMs & Maintenance Contractors",
];
const track = document.getElementById("marqueeTrack");
const buildRow = () =>
  industries
    .map((i) => `<span class="m-item">${i}<span class="dot"></span></span>`)
    .join("");
track.innerHTML = buildRow() + buildRow();

/* ===== FAQ accordion ===== */
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  if (item.classList.contains("open")) {
    a.style.maxHeight = a.scrollHeight + "px";
  }
  q.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-a").style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add("open");
      a.style.maxHeight = a.scrollHeight + "px";
    }
  });
});

/* ===== Gallery lightbox ===== */
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
document.querySelectorAll(".gal-item").forEach((item) => {
  item.addEventListener("click", () => {
    lbImg.src = item.querySelector("img").src;
    lbImg.alt = item.querySelector("img").alt;
    lbCap.textContent = item.dataset.cap || "";
    lb.classList.add("open");
  });
});
document
  .getElementById("lbClose")
  .addEventListener("click", () => lb.classList.remove("open"));
lb.addEventListener("click", (e) => {
  if (e.target === lb) lb.classList.remove("open");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") lb.classList.remove("open");
});

/* ===== Contact form -> WhatsApp / Email ===== */
const form = document.getElementById("quoteForm");
const status = document.getElementById("formStatus");
function validate() {
  let ok = true;
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const msg = document.getElementById("msg");
  document
    .getElementById("f-name")
    .classList.toggle("invalid", !name.value.trim());
  if (!name.value.trim()) ok = false;
  const phoneDigits = phone.value.replace(/\D/g, "");
  const phoneValid = phoneDigits.length === 10;
  document.getElementById("f-phone").classList.toggle("invalid", !phoneValid);
  if (!phoneValid) ok = false;
  document
    .getElementById("f-msg")
    .classList.toggle("invalid", !msg.value.trim());
  if (!msg.value.trim()) ok = false;
  return ok;
}
function buildMessage() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const equip = document.getElementById("equip").value;
  const msg = document.getElementById("msg").value.trim();
  return `New enquiry from RSS website%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEquipment: ${encodeURIComponent(equip || "Not specified")}%0AIssue: ${encodeURIComponent(msg)}`;
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) {
    status.textContent = "Please fill in the highlighted fields.";
    status.classList.add("show");
    return;
  }
  const body = buildMessage();
  window.open(`https://wa.me/917874775520?text=${body}`, "_blank");
  status.textContent = "Opening WhatsApp with your enquiry pre-filled…";
  status.classList.add("show");
});
document.getElementById("sendMail").addEventListener("click", () => {
  if (!validate()) {
    status.textContent = "Please fill in the highlighted fields.";
    status.classList.add("show");
    return;
  }
  const name = document.getElementById("name").value.trim();
  const equip = document.getElementById("equip").value;
  const msg = document.getElementById("msg").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const subject = encodeURIComponent(
    `Repair enquiry — ${equip || "Motor/Generator"}`,
  );
  const bodyMail = encodeURIComponent(
    `Name: ${name}\nPhone: ${phone}\nEquipment: ${equip || "Not specified"}\n\nIssue:\n${msg}`,
  );
  window.location.href = `mailto:gaurav@rssrewinding.com?subject=${subject}&body=${bodyMail}`;
  status.textContent = "Opening your email app with your enquiry pre-filled…";
  status.classList.add("show");
});

/* ===== Cursor glow (desktop) ===== */
const glow = document.getElementById("cursorGlow");
if (window.matchMedia("(min-width:981px)").matches) {
  document.addEventListener("mousemove", (e) => {
    glow.style.opacity = "1";
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
  document.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
}

/* ===== Footer year ===== */
document.getElementById("yr").textContent = new Date().getFullYear();
