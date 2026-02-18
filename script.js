// --- CONFIGURATION ---
// Testing Time: February 18, 2026 at 21:55 (9:55 PM)
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

// --- COUNTDOWN LOGIC ---
function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  // If countdown is finished
  if (distance <= 0) {
    clearInterval(timerInterval);
    showGiftScreen();
    return;
  }

  // Time calculations
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Update HTML
  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

const timerInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// --- NAVIGATION ---
function showGiftScreen() {
  countdownScreen.classList.replace("active", "hidden");
  giftScreen.classList.replace("hidden", "active");
}

// --- GIFT BOX EVENT ---
giftBox.addEventListener("click", function () {
  this.classList.add("open");

  // Create heart rain effect
  for (let i = 0; i < 50; i++) {
    setTimeout(createHeartDrop, i * 100);
  }

  // Move to Main Page after animation
  setTimeout(() => {
    giftScreen.classList.replace("active", "hidden");
    mainPage.classList.replace("hidden", "active");
    // Enable scrolling on main page
    document.body.style.overflow = "auto";
  }, 3000);
});

// --- HEART RAIN EFFECT ---
function createHeartDrop() {
  const heart = document.createElement("div");
  heart.classList.add("heart-drop");
  heart.innerHTML = "❤️";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.top = "-5vh";
  heart.style.fontSize = Math.random() * 20 + 15 + "px";
  heart.style.animationDuration = Math.random() * 2 + 3 + "s";
  
  document.body.appendChild(heart);

  // Remove heart after animation
  setTimeout(() => {
    heart.remove();
  }, 5000);
}

// --- LIGHTBOX FUNCTIONS ---
function openLightbox(element) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const clickedImgSrc = element.querySelector("img").src;

  lightboxImg.src = clickedImgSrc;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}
function toggleSecret() {
  const secret = document.getElementById("burmese-secret");
  secret.classList.toggle("show");
}

const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.3; // softer romantic volume

giftBox.addEventListener("click", function () {
  bgMusic.currentTime = 0;
bgMusic.play().catch(() => {});

  bgMusic.play().catch(() => {});
  
  this.classList.add("open");

  for (let i = 0; i < 50; i++) {
    setTimeout(createHeartDrop, i * 100);
  }

  setTimeout(() => {
    giftScreen.classList.replace("active", "hidden");
    mainPage.classList.replace("hidden", "active");
    document.body.style.overflow = "auto";
  }, 3000);
});
bgMusic.volume = 0.3; // 30% volume


