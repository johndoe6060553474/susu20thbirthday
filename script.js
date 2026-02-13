// ✅ Keep your provided date, only change time to 11:36:00
const targetDate = new Date("February 13, 2026 11:37:00").getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

// Screen elements (for Phase 2 + 3)
const countdownScreen = document.getElementById("countdown-screen");
const giftScreen = document.getElementById("gift-screen");
const mainPage = document.getElementById("main-page");
const giftBox = document.getElementById("giftBox");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  // ⬇️ When countdown finishes
  if (distance <= 0) {
    countdownScreen?.classList.remove("active");
    countdownScreen?.classList.add("hidden");

    giftScreen?.classList.remove("hidden");
    giftScreen?.classList.add("active");

    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();


// 🎁 Gift box opening logic
giftBox?.addEventListener("click", () => {
  giftBox.classList.add("open");

  setTimeout(() => {
    giftScreen?.classList.remove("active");
    giftScreen?.classList.add("hidden");

    mainPage?.classList.remove("hidden");
    mainPage?.classList.add("active");
  }, 2000);
});
