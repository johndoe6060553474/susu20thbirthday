// --- CONFIGURATION ---
const targetDate = new Date("February 18, 2026 21:55:00").getTime();

// --- ELEMENTS ---
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const countdownScreen = document.getElementById("countdown-screen");
const giftScreen = document.getElementById("gift-screen");
const mainPage = document.getElementById("main-page");
const giftBox = document.getElementById("giftBox");
const bgMusic = document.getElementById("bgMusic");

// --- COUNTDOWN ---
function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    clearInterval(timerInterval);
    showGiftScreen();
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

const timerInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// --- SCREEN NAVIGATION ---
function showGiftScreen() {
  countdownScreen.classList.remove("active");
  giftScreen.classList.add("active");
}

// --- HEART RAIN ---
function createHeartDrop() {
  const heart = document.createElement("div");
  heart.classList.add("heart-drop");
  heart.innerHTML = "❤️";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = Math.random() * 20 + 15 + "px";
  heart.style.animationDuration = Math.random() * 2 + 3 + "s";

  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 5000);
}

// --- GIFT BOX ---
if (giftBox) {
  giftBox.addEventListener("click", function () {

    if (bgMusic) {
      bgMusic.volume = 0.3;
      bgMusic.currentTime = 0;
      bgMusic.play().catch(() => {});
    }

    this.classList.add("open");

    for (let i = 0; i < 50; i++) {
      setTimeout(createHeartDrop, i * 100);
    }

    setTimeout(() => {
     giftScreen.classList.remove("active");
mainPage.classList.add("active");
      document.body.style.overflow = "auto";
    }, 3000);
  });
}

// --- LIGHTBOX ---
function openLightbox(element) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  lightboxImg.src = element.querySelector("img").src;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function toggleSecret() {
  document.getElementById("burmese-secret").classList.toggle("show");
}

// --- ENTRY GATE ---
function confirmIdentity(answer) {
  if (answer) {
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
   } else {
    alert("This page is not for you 💔");
  }
}

function verifyRoll() {
  const roll = document.getElementById("rollInput").value;
  const error = document.getElementById("rollError");

  if (roll == 51) {
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.remove("hidden");
  } else {
    error.textContent = "Incorrect Roll Number.";
  }
}

function selectVersion(choice) {
  document.getElementById("entry-gate").classList.remove("active");

  if (choice === "single") {
    countdownScreen.classList.add("active");
  } else {
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#fff;text-align:center;font-family:sans-serif;">
        <h2>This page was written for someone who was single 🤍</h2>
      </div>
    `;
  }
}



