// ── CONFIGURATION ────────────────────────────────────────────
const TARGET_DATE = new Date("February 7, 2026 00:00:00").getTime();
const CORRECT_ROLL = 51;

// ── ELEMENT REFERENCES ───────────────────────────────────────
const countdownScreen = document.getElementById("countdown-screen");
const giftScreen      = document.getElementById("gift-screen");
const mainPage        = document.getElementById("main-page");
const giftBox         = document.getElementById("giftBox");
const bgMusic         = document.getElementById("bgMusic");
const heartsContainer = document.getElementById("hearts-container");

// Force all screens hidden on init (guard against null)
if (countdownScreen) countdownScreen.classList.remove("active");
if (giftScreen)      giftScreen.classList.remove("active");
if (mainPage)        mainPage.classList.remove("active");

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
const daysEl    = document.getElementById("days");
const hoursEl   = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

let timerInterval = null;

function pad(n) { return String(n).padStart(2, "0"); }

function updateCountdown() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  const now      = Date.now();
  const distance = TARGET_DATE - now;

  if (distance <= 0) {
    clearInterval(timerInterval);
    daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
    setTimeout(showGiftScreen, 600);
    return;
  }

  const d = Math.floor(distance / 864e5);
  const h = Math.floor((distance % 864e5)  / 36e5);
  const m = Math.floor((distance % 36e5)   / 6e4);
  const s = Math.floor((distance % 6e4)    / 1e3);

  daysEl.textContent    = pad(d);
  hoursEl.textContent   = pad(h);
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
    bgMusic.play().catch(() => {});
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
const lightbox    = document.getElementById("lightbox");
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
let secretRevealed = false;

function toggleSecret() {
  const el = document.getElementById("burmese-secret");
  if (!el) return;
  el.classList.toggle("show");

  // Once opened for the first time, animate the ECG then show box 2
  if (!secretRevealed && el.classList.contains("show")) {
    secretRevealed = true;
    setTimeout(fireEcgAndBox2, 700);
  }
}

function fireEcgAndBox2() {
  const svg      = document.getElementById("ecgSvg");
  const line     = document.getElementById("ecgPolyline");
  const arrow    = document.getElementById("ecgArrow");
  const label    = document.getElementById("ecgLabel");
  const box2     = document.getElementById("spoilerBox2");

  if (!svg || !box2) return;

  // Show SVG overlay
  svg.classList.add("active");

  // Trigger ECG draw animation next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      line.classList.add("draw");
      label.classList.add("show");
    });
  });

  // Arrow tip appears when line finishes
  setTimeout(() => {
    arrow.classList.add("show");
  }, 2100);

  // Box 2 fades in
  setTimeout(() => {
    box2.classList.add("active");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        box2.classList.add("visible");
      });
    });
  }, 2400);
}

let identityRevealed = false;

function toggleIdentity() {
  const reveal = document.getElementById("identity-reveal");
  if (!reveal) return;

  if (!identityRevealed) {
    // First tap: show the name card
    reveal.classList.remove("hidden");
    identityRevealed = true;
  } else {
    // Second tap: hide ECG and box 2 together
    const svg = document.getElementById("ecgSvg");
    if (svg) {
      svg.style.transition = "opacity 0.6s ease";
      svg.style.opacity = "0";
      setTimeout(() => svg.classList.remove("active"), 650);
    }
    const box2 = document.getElementById("spoilerBox2");
    if (box2) {
      box2.style.transition = "opacity 0.6s ease";
      box2.style.opacity = "0";
      setTimeout(() => {
        box2.classList.remove("active", "visible");
        box2.style.opacity = "";
        document.getElementById("identity-reveal").classList.add("hidden");
      }, 650);
    }
    identityRevealed = false;
  }
}

// ── ENTRY GATE ───────────────────────────────────────────────
function confirmIdentity(answer) {
  if (!answer) {
    // Nice animation before alert
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
  const roll  = parseInt(input.value, 10);

  if (roll === CORRECT_ROLL) {
    error.textContent = "";
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    step2.style.opacity = "0";
    step2.style.transition = "opacity 0.3s";
    setTimeout(() => {
      step2.classList.add("hidden");
      step3.classList.remove("hidden");
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

function selectVersion(choice) {
  const entryGate = document.getElementById("entry-gate");
  entryGate.style.opacity = "0";
  entryGate.style.transition = "opacity 0.5s";

  setTimeout(() => {
    entryGate.classList.remove("active");

    if (choice === "single") {
      countdownScreen.classList.add("active");
      // Delay so countdown screen is visible before auto-advancing
      setTimeout(startCountdown, 800);
    } else {
      // Relationship version — same flow as single but dark theme
      document.body.innerHTML = `
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Padauk:wght@400;700&display=swap" rel="stylesheet">
        <style>
          *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
          body { background:#0d0608; font-family:'Padauk',serif; color:#c8a8b0; overflow-x:hidden; min-height:100vh; }

          /* Rain */
          .rain { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
          .raindrop { position:absolute; top:-20px; width:1px; background:linear-gradient(to bottom,transparent,rgba(180,100,120,0.35)); animation:rainFall linear infinite; }
          @keyframes rainFall { to { transform:translateY(110vh); opacity:0; } }

          /* Screens */
          .hb-screen { position:fixed; inset:0; display:none; align-items:center; justify-content:center; flex-direction:column; z-index:10; }
          .hb-screen.active { display:flex; }

          /* ── COUNTDOWN SCREEN ── */
          #hbCountdown { background:radial-gradient(ellipse at top,rgba(120,20,40,0.25) 0%,transparent 70%), #0d0608; text-align:center; padding:40px 20px; }
          .hb-cd-eyebrow { font-family:'Cormorant Garamond',serif; font-size:0.65rem; letter-spacing:5px; text-transform:uppercase; color:#6b3040; margin-bottom:20px; }
          .hb-cd-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2.4rem,7vw,4.5rem); font-weight:300; color:#e8c0c8; line-height:1.1; margin-bottom:14px; text-shadow:0 0 40px rgba(180,60,80,0.3); }
          .hb-cd-title em { font-style:italic; color:#c0505e; }
          .hb-cd-sub { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-style:italic; color:#6b4050; margin-bottom:50px; }
          .hb-timer { display:flex; gap:8px; justify-content:center; align-items:center; flex-wrap:wrap; margin-bottom:50px; }
          .hb-time-box { background:rgba(180,40,60,0.08); border:1px solid rgba(180,60,80,0.2); border-radius:14px; padding:18px 14px 12px; min-width:80px; text-align:center; box-shadow:0 4px 20px rgba(100,10,30,0.3); }
          .hb-time-box span { display:block; font-family:'Cormorant Garamond',serif; font-size:2.6rem; font-weight:300; color:#c06070; line-height:1; text-shadow:0 0 20px rgba(200,60,80,0.4); }
          .hb-time-box small { display:block; font-family:'Cormorant Garamond',serif; font-size:0.6rem; letter-spacing:3px; text-transform:uppercase; color:#5a2535; margin-top:6px; }
          .hb-time-sep { font-family:'Cormorant Garamond',serif; font-size:2.2rem; color:#6b2535; opacity:0.4; margin-top:-8px; }
          .hb-cd-note { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-style:italic; color:#5a2535; }

          /* ── BROKEN HEART SCREEN ── */
          #hbHeart { background:#0d0608; text-align:center; padding:40px 20px; flex-direction:column; gap:0; }
          .hb-heart-hint { font-family:'Cormorant Garamond',serif; font-size:1rem; font-style:italic; color:#5a2535; margin-bottom:50px; opacity:0.8; }
          .heart-scene { position:relative; width:160px; height:160px; margin:0 auto 40px; cursor:pointer; filter:drop-shadow(0 0 20px rgba(180,40,60,0.5)); transition:transform 0.3s; }
          .heart-scene:hover { transform:scale(1.05); }
          .heart-svg { width:160px; height:160px; }
          .heart-path { fill:#6b1a2a; transition:opacity 0.3s; }
          /* crack */
          .crack { stroke:#0d0608; stroke-width:3; fill:none; stroke-dasharray:200; stroke-dashoffset:200; transition:stroke-dashoffset 0.5s ease; }
          /* halves for breaking */
          .heart-left-half  { transform-origin:80px 80px; transition:transform 1s cubic-bezier(0.34,1,0.64,1), opacity 0.8s ease; }
          .heart-right-half { transform-origin:80px 80px; transition:transform 1s cubic-bezier(0.34,1,0.64,1), opacity 0.8s ease; }
          .breaking .crack { stroke-dashoffset:0; }
          .breaking .heart-left-half  { transform:rotate(-20deg) translate(-18px,15px); opacity:0.5; }
          .breaking .heart-right-half { transform:rotate(20deg) translate(18px,15px); opacity:0.5; }
          .tap-hint-heart { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-style:italic; color:#6b3040; animation:floatHint 2.5s ease-in-out infinite; }
          @keyframes floatHint { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

          /* ── WISH PAGE ── */
          #hbWish { position:relative; display:none; overflow-y:auto; align-items:flex-start; justify-content:center; background:#0d0608; z-index:10; }
          #hbWish.active { display:flex; }
          .hb-wish-wrap { max-width:680px; margin:0 auto; padding:60px 28px 100px; text-align:center; position:relative; z-index:1; }
          .hb-wish-eyebrow { font-family:'Cormorant Garamond',serif; font-size:0.65rem; letter-spacing:5px; text-transform:uppercase; color:#6b3040; margin-bottom:18px; animation:fadeUp 0.8s 0.2s ease both; opacity:0; }
          .hb-wish-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2rem,6vw,3.2rem); font-weight:300; color:#e8c0c8; line-height:1.2; margin-bottom:50px; text-shadow:0 0 40px rgba(180,60,80,0.3); animation:fadeUp 0.8s 0.4s ease both; opacity:0; }
          .hb-wish-title em { font-style:italic; color:#c0505e; }
          .hb-card { background:rgba(255,255,255,0.03); border:1px solid rgba(180,80,100,0.15); border-radius:20px; padding:50px 40px; position:relative; box-shadow:0 0 60px rgba(120,20,40,0.2),inset 0 0 40px rgba(0,0,0,0.3); animation:fadeUp 1s 0.7s ease both; opacity:0; }
          .hb-card::before { content:''; position:absolute; inset:-1px; border-radius:20px; background:linear-gradient(145deg,rgba(180,60,80,0.1),transparent,rgba(180,60,80,0.05)); pointer-events:none; }
          .hb-corner { position:absolute; width:24px; height:24px; border-color:rgba(180,60,80,0.2); border-style:solid; }
          .hb-corner.tl { top:14px; left:14px; border-width:1px 0 0 1px; }
          .hb-corner.tr { top:14px; right:14px; border-width:1px 1px 0 0; }
          .hb-corner.bl { bottom:14px; left:14px; border-width:0 0 1px 1px; }
          .hb-corner.br { bottom:14px; right:14px; border-width:0 1px 1px 0; }
          .hb-card-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:300; font-style:italic; color:#c06070; margin-bottom:32px; }
          .hb-body { font-family:'Padauk',serif; font-size:clamp(0.95rem,2.2vw,1.1rem); line-height:2.1; color:#a08090; text-align:center; }
          .hb-body p { margin-bottom:16px; }
          .hb-signature { font-family:'Cormorant Garamond',serif; font-size:1rem; font-style:italic; color:#6b4050; margin-top:36px; line-height:1.8; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        </style>

        <div class="rain" id="hbRain"></div>

        <!-- SCREEN 1: COUNTDOWN -->
        <div class="hb-screen active" id="hbCountdown">
          <p class="hb-cd-eyebrow">counting down to</p>
          <h1 class="hb-cd-title">March 7, 2026</h1>
          <p class="hb-cd-sub">Something bittersweet is on its way…</p>
          <div class="hb-timer">
            <div class="hb-time-box"><span id="hbDays">00</span><small>Days</small></div>
            <div class="hb-time-sep">:</div>
            <div class="hb-time-box"><span id="hbHours">00</span><small>Hours</small></div>
            <div class="hb-time-sep">:</div>
            <div class="hb-time-box"><span id="hbMinutes">00</span><small>Minutes</small></div>
            <div class="hb-time-sep">:</div>
            <div class="hb-time-box"><span id="hbSeconds">00</span><small>Seconds</small></div>
          </div>
          <p class="hb-cd-note">Until she turns 20 — wherever she is 💔</p>
        </div>

        <!-- SCREEN 2: BREAKING HEART -->
        <div class="hb-screen" id="hbHeartScreen">
          <p class="hb-heart-hint">A bittersweet surprise is waiting for you…</p>
          <div class="heart-scene" id="heartScene" onclick="breakHeart()">
            <svg class="heart-svg" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
              <!-- left half -->
              <g class="heart-left-half">
                <clipPath id="leftClip"><rect x="0" y="0" width="80" height="160"/></clipPath>
                <path class="heart-path" clip-path="url(#leftClip)"
                  d="M80,130 C80,130 20,90 20,52 C20,32 35,18 52,18 C64,18 74,26 80,34 C86,26 96,18 108,18 C125,18 140,32 140,52 C140,90 80,130 80,130Z"
                  fill="#6b1a2a" opacity="0.85"/>
              </g>
              <!-- right half -->
              <g class="heart-right-half">
                <clipPath id="rightClip"><rect x="80" y="0" width="80" height="160"/></clipPath>
                <path class="heart-path" clip-path="url(#rightClip)"
                  d="M80,130 C80,130 20,90 20,52 C20,32 35,18 52,18 C64,18 74,26 80,34 C86,26 96,18 108,18 C125,18 140,32 140,52 C140,90 80,130 80,130Z"
                  fill="#6b1a2a" opacity="0.85"/>
              </g>
              <!-- crack line down the center -->
              <path class="crack" d="M80,18 L76,40 L83,60 L77,85 L80,130"/>
            </svg>
          </div>
          <p class="tap-hint-heart">Tap to open 💔</p>
        </div>

        <!-- SCREEN 3: WISH PAGE -->
        <div id="hbWish">
          <div class="rain" id="hbRain2"></div>
          <div class="hb-wish-wrap">
            <p class="hb-wish-eyebrow">✦ March 7, 2026 ✦</p>
            <h1 class="hb-wish-title">Happy 20th Birthday,<br><em>Su Su</em> 🎂</h1>
            <div class="hb-card">
              <div class="hb-corner tl"></div><div class="hb-corner tr"></div>
              <div class="hb-corner bl"></div><div class="hb-corner br"></div>
              <p class="hb-card-title">🎂 Happy 20th Birthday, Su Su 🤍</p>
              <div class="hb-body">
                <p>အသက် ၂၀ ပြည့် မွေးနေ့မှာ ပျော်ရွှင်ပါစေ စုစု — မွေးနေ့ကစလို့ နေ့ရက်တိုင်းမှာ လင်းလက်တောက်ပမှုတွေ၊ လှပတဲ့ အစပြုခြင်းတွေနဲ့ ပြည့်နှက်ပါစေ။</p>
                <p>အမြဲတမ်း အေးချမ်းပြီး ကျန်းမာတဲ့ စိတ်နှလုံးကို ပိုင်ဆိုင်နိုင်ပါစေ။<br>
                စုစုရဲ့ အိပ်မက်တွေကို အကောင်အထည်ဖော်ဖို့အတွက် ခန္ဓာကိုယ် ကျန်းမာကြံ့ခိုင်ပြီး အားအင်အပြည့် ရှိပါစေ။<br>
                မိဘနှစ်ပါးအတွက် အမြဲတမ်း ချစ်စရာကောင်းတဲ့၊ အဖိုးတန်တဲ့ ကောင်းချီးမင်္ဂလာ သမီးရတနာလေး ဖြစ်ပါစေ။<br>
                စုစုအပေါ် စစ်မှန်တဲ့စေတနာနဲ့ ဂရုစိုက်မယ့် သစ္စာရှိတဲ့ သူငယ်ချင်းကောင်းတွေနဲ့ပဲ ဆုံတွေ့ရပါစေ။<br>
                ဟန်ဆောင်မှုရှိတဲ့ သူငယ်ချင်းတွေနဲ့ အဆိပ်အတောက်ဖြစ်စေတဲ့ Relationship တွေ စုစုရဲ့ဘဝထဲကနေ ဝေးဝေးမှာပဲ ရှိပါစေ။<br>
                လူအများအပြားကို ကြင်နာမှုနဲ့ ကူညီပေးနိုင်မယ့် မွန်မြတ်တဲ့ ဆရာဝန်မလေးတစ်ယောက် ဖြစ်လာပါစေ။<br>
                နောင်တစ်ချိန်မှာ ကျွမ်းကျင်တဲ့ သားဖွားမီးယပ်အထူးကု ဆရာဝန်ကြီး (OG) တစ်ယောက် ဖြစ်ပါစေ။<br>
                လာမယ့် စာမေးပွဲတိုင်းမှာ စိတ်အေးအေးထားပြီး ယုံကြည်မှုအပြည့်နဲ့ ဖြေဆိုနိုင်ပါစေ။<br>
                လာမယ့် MET တွေမှာ အမှတ် ၆၀၀ ရရှိပြီး ကိုယ့်ကိုယ်ကိုယ် တကယ်ကို ဂုဏ်ယူနိုင်ပါစေ။<br>
                ဆေးပညာနယ်ပယ်မှာဖြစ်စေ၊ စုစုသွားချင်တဲ့ ဘယ်နယ်ပယ်မှာမဆို စုစုရဲ့ ရည်မှန်းချက်တွေအားလုံး အောင်မြင်ပါစေ။<br>
                စုစုလိုအပ်တဲ့ အချိန်တိုင်းမှာ ကံကောင်းခြင်းတွေက စုစုဆီကို ညင်သာစွာ ရောက်ရှိလာပါစေ။<br>
                ကံမကောင်းမှုတွေနဲ့ ဝမ်းနည်းမှုတွေက စုစုရဲ့ ဘဝခရီးကနေ ဝေးဝေးမှာပဲ ရှိပါစေ။<br>
                ဘဝရဲ့ စိန်ခေါ်မှုတိုင်းကိုလည်း တည်ငြိမ်တဲ့ ခွန်အားတွေနဲ့ ကျော်ဖြတ်နိုင်ပါစေ။<br>
                ကမ္ဘာပတ်ပြီး စုစုသွားချင်တဲ့ နေရာတွေကို အရောက်သွားနိုင်ပါစေ။<br>
                စုစုနှစ်သက်တဲ့ အရသာရှိတဲ့ အစားအသောက်တွေကို စားသောက်ရင်း လွတ်လပ်ပေါ့ပါးစွာ ပြုံးပျော်နိုင်ပါစေ။<br>
                အတွင်းစိတ်ရော အပြင်ပန်းပါ အခုလိုပဲ အမြဲတမ်း သဘာဝအတိုင်း လှပနေပါစေ။<br>
                စုစုလုပ်သမျှ အရာတိုင်းမှာ ကိုယ်ပိုင်ပျော်ရွှင်မှုကို လွတ်လပ်စွာ ရွေးချယ်နိုင်ပါစေ။<br>
                စုစုချစ်ရတဲ့ မိသားစုနဲ့အတူတူ ပျော်ရွှင်စရာကောင်းတဲ့ နှစ်ပေါင်းများစွာကို အတူဖြတ်သန်းနိုင်ပါစေ။</p>
                <p>နောက်ဆုံးအနေနဲ့ စုစုရဲ့ ရှေ့ဆက်လျှောက်ရမယ့် ဘဝခရီးတစ်ခုလုံးမှာ စုစုချစ်ရတဲ့သူရဲ့ လက်ကိုတွဲလို့ အခက်အခဲအားလုံးကို အတူတူရင်ဆိုင်ဖြတ်သန်းနိုင်ပြီး၊ သာယာပျော်ရွှင်ဖွယ်ရာ မိသားစုဘဝလေးတစ်ခုကို ပိုင်ဆိုင်နိုင်ပါစေလို့ ကျွန်တော် ဆုတောင်းပေးလိုက်ပါတယ်နော်။</p>
              </div>
              <p class="hb-signature">မေတ္တာဖြင့်၊<br><em>— စုစုကို အမြဲတမ်း အဆင်ပြေ ပျော်ရွှင်နေစေချင်သူ 🤍</em></p>
            </div>
          </div>
        </div>

        <script>
          // Rain
          function spawnRain(id) {
            const c = document.getElementById(id);
            if (!c) return;
            for (let i = 0; i < 55; i++) {
              const d = document.createElement('div');
              d.classList.add('raindrop');
              d.style.left = Math.random() * 100 + 'vw';
              d.style.height = Math.random() * 60 + 40 + 'px';
              d.style.animationDuration = Math.random() * 2 + 1.5 + 's';
              d.style.animationDelay = Math.random() * 3 + 's';
              d.style.opacity = Math.random() * 0.4 + 0.1;
              c.appendChild(d);
            }
          }
          spawnRain('hbRain');

          // Countdown
          const TARGET = new Date("February 7, 2026 00:00:00").getTime();
          function pad(n) { return String(n).padStart(2,'0'); }

          function showHeart() {
            document.getElementById('hbCountdown').classList.remove('active');
            document.getElementById('hbHeartScreen').classList.add('active');
          }

          const dist0 = TARGET - Date.now();
          if (dist0 <= 0) {
            // Date already passed — skip straight to heart
            showHeart();
          } else {
            let timer;
            function tick() {
              const dist = TARGET - Date.now();
              if (dist <= 0) {
                clearInterval(timer);
                showHeart();
                return;
              }
              document.getElementById('hbDays').textContent    = pad(Math.floor(dist/864e5));
              document.getElementById('hbHours').textContent   = pad(Math.floor((dist%864e5)/36e5));
              document.getElementById('hbMinutes').textContent = pad(Math.floor((dist%36e5)/6e4));
              document.getElementById('hbSeconds').textContent = pad(Math.floor((dist%6e4)/1e3));
            }
            timer = setInterval(tick, 1000);
            tick();
          }

          function breakHeart() {
            const scene = document.getElementById('heartScene');
            if (scene.classList.contains('breaking')) return;
            scene.classList.add('breaking');
            setTimeout(() => {
              document.getElementById('hbHeartScreen').classList.remove('active');
              const wish = document.getElementById('hbWish');
              wish.style.display = 'flex';
              document.body.style.overflow = 'auto';
              spawnRain('hbRain2');
            }, 1200);
          }
        </script>
      `;
    }
  }, 500);
}
