/* ============================================================
   script.js — Counting Down To You
   ============================================================ */

// ── CONFIGURATION ────────────────────────────────────────────
const TARGET_DATE = new Date("February 7, 2026 00:00:00").getTime();
const CORRECT_ROLL = 532;

// ── ELEMENT REFERENCES ───────────────────────────────────────
const countdownScreen = document.getElementById("countdown-screen");
const giftScreen = document.getElementById("gift-screen");
const mainPage = document.getElementById("main-page");
const giftBox = document.getElementById("giftBox");
const bgMusic = document.getElementById("bgMusic");
const heartsContainer = document.getElementById("hearts-container");

// Force all screens hidden on init (guard against null)
if (countdownScreen) countdownScreen.classList.remove("active");
if (giftScreen) giftScreen.classList.remove("active");
if (mainPage) mainPage.classList.remove("active");

// ── PARTICLE BACKGROUND ──────────────────────────────────────
(function spawnParticles() {
    const container = document.getElementById("particles");
    if (!container) return;

    const colours = [
        "rgba(232,66,110,0.18)",
        "rgba(244,114,160,0.14)",
        "rgba(212,167,87,0.12)",
        "rgba(255,150,190,0.12)",
    ];

    for (let i = 0; i < 28; i++) {
        const p = document.createElement("div");
        p.classList.add("particle");
        const size = Math.random() * 10 + 4;
        p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colours[Math.floor(Math.random() * colours.length)]};
      animation-duration: ${Math.random() * 14 + 10}s;
      animation-delay: ${Math.random() * -20}s;
    `;
        container.appendChild(p);
    }
})();

// ── COUNTDOWN TIMER ──────────────────────────────────────────
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

let timerInterval = null;

function pad(n) { return String(n).padStart(2, "0"); }

function updateCountdown() {
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    const now = Date.now();
    const distance = TARGET_DATE - now;

    if (distance <= 0) {
        clearInterval(timerInterval);
        daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
        setTimeout(showGiftScreen, 600);
        return;
    }

    const d = Math.floor(distance / 864e5);
    const h = Math.floor((distance % 864e5) / 36e5);
    const m = Math.floor((distance % 36e5) / 6e4);
    const s = Math.floor((distance % 6e4) / 1e3);

    daysEl.textContent = pad(d);
    hoursEl.textContent = pad(h);
    minutesEl.textContent = pad(m);
    secondsEl.textContent = pad(s);
}

function startCountdown() {
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
}

// ── SCREEN TRANSITIONS ───────────────────────────────────────
function transitionTo(hideEl, showEl, delay = 0) {
    setTimeout(() => {
        if (hideEl) hideEl.classList.remove("active");
        if (showEl) {
            showEl.classList.add("active");
            window.scrollTo(0, 0);
        }
    }, delay);
}

function showGiftScreen() {
    transitionTo(countdownScreen, giftScreen);
}

function showMainPage() {
    transitionTo(giftScreen, mainPage);
    document.body.style.overflow = "auto";

    if (bgMusic) {
        bgMusic.volume = 0;
        bgMusic.currentTime = 0;
        bgMusic.play().catch(() => { });
        // Fade in music
        let vol = 0;
        const fadeIn = setInterval(() => {
            vol = Math.min(vol + 0.02, 0.35);
            bgMusic.volume = vol;
            if (vol >= 0.35) clearInterval(fadeIn);
        }, 80);
    }
}

// ── GIFT BOX ─────────────────────────────────────────────────
if (giftBox) {
    giftBox.addEventListener("click", function onGiftClick() {
        giftBox.removeEventListener("click", onGiftClick);
        giftBox.classList.add("open");

        // Heart explosion
        launchHearts(80);

        setTimeout(showMainPage, 3200);
    });
}

// ── HEART RAIN ───────────────────────────────────────────────
const HEARTS = ["❤️", "🩷", "💕", "💗", "💖", "🌸", "✨", "💫"];

function createHeartDrop(x) {
    const h = document.createElement("div");
    h.classList.add("heart-drop");
    h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    h.style.cssText = `
    left: ${x != null ? x + "%" : Math.random() * 100 + "%"};
    font-size: ${Math.random() * 22 + 12}px;
    animation-duration: ${Math.random() * 2.5 + 2.5}s;
    animation-delay: ${Math.random() * 0.5}s;
  `;
    heartsContainer.appendChild(h);
    setTimeout(() => h.remove(), 6000);
}

function launchHearts(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => createHeartDrop(), i * 55);
    }
}

// Occasional ambient hearts on main page
setInterval(() => {
    if (mainPage.classList.contains("active")) {
        createHeartDrop();
    }
}, 3500);

// ── LIGHTBOX ─────────────────────────────────────────────────
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(element, isCenter = false) {
    const caption = document.getElementById("lightbox-caption");
    const img = element.querySelector("img");
    if (!img || !img.src) return;
    lightboxImg.src = img.src;
    if (caption) {
        if (isCenter) {
            caption.textContent = "This pic always gets me fall in you every time I see it… 🤍";
            caption.style.display = "block";
        } else {
            caption.textContent = "";
            caption.style.display = "none";
        }
    }
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => lightbox.classList.add("open"));
}

function closeLightbox() {
    lightbox.style.display = "none";
    lightbox.classList.remove("open");
    document.body.style.overflow = "auto";
}

// Close on Escape key
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
});

// ── SECRET REVEAL ─────────────────────────────────────────────
function toggleSecret() {
    const el = document.getElementById("burmese-secret");
    if (!el) return;
    el.classList.toggle("show");
}


// ── ENTRY GATE ───────────────────────────────────────────────
function confirmIdentity(answer) {
    if (!answer) {
        const btn = event.currentTarget || event.target;
        btn.classList.add("shaking");
        setTimeout(() => {
            alert("This page was made for someone special. 💔\nPlease close this tab.");
        }, 100);
        return;
    }
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    step1.style.opacity = "0";
    step1.style.transition = "opacity 0.3s";
    setTimeout(() => {
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
    }, 300);
}

function verifyRoll() {
    const input = document.getElementById("rollInput");
    const error = document.getElementById("rollError");
    const roll = parseInt(input.value, 10);

    if (roll === CORRECT_ROLL) {
        error.textContent = "";
        // After step 2, go straight to countdown (no step 3)
        const step2 = document.getElementById("step2");
        const entryGate = document.getElementById("entry-gate");

        step2.style.opacity = "0";
        step2.style.transition = "opacity 0.3s";
        setTimeout(() => {
            entryGate.style.opacity = "0";
            entryGate.style.transition = "opacity 0.5s";
            setTimeout(() => {
                entryGate.classList.remove("active");
                countdownScreen.classList.add("active");
                setTimeout(startCountdown, 800);
            }, 500);
        }, 300);
    } else {
        error.textContent = "Incorrect. Try again. 🙈";
        input.value = "";
        input.focus();
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 500);
    }
}

// Allow Enter key in roll input
document.getElementById("rollInput")?.addEventListener("keydown", e => {
    if (e.key === "Enter") verifyRoll();
});
