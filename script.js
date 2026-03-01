/* ============================================================
   script.js — Counting Down To You
   ============================================================ */

// ── CONFIGURATION ────────────────────────────────────────────
const TARGET_DATE = new Date("February 7, 2026 00:00:00").getTime();
const CORRECT_ROLL = 51;

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
    const roll = parseInt(input.value, 10);

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
            // Relationship version — DIRECTLY to wish page, skip countdown and gift box
            document.body.innerHTML = `
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Padauk:wght@400;700&family=Quicksand:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
          body { background:#0d0608; font-family:'Padauk',serif; color:#c8a8b0; overflow-x:hidden; min-height:100vh; }

          /* Particles (confetti/petals/stars) */
          #hbParticles { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
          .hb-particle { position:absolute; top:-30px; border-radius:50%; animation:hbFall linear infinite; opacity:0; }
          @keyframes hbFall {
            0%   { transform:translateY(0) rotate(0deg); opacity:0; }
            5%   { opacity:1; }
            95%  { opacity:0.7; }
            100% { transform:translateY(110vh) rotate(720deg); opacity:0; }
          }

          /* ── WISH PAGE ── */
          #hbWish { position:fixed; inset:0; display:flex; overflow-y:auto; flex-direction:column; background:linear-gradient(180deg,#fdf0f4 0%,#fff8fa 100%); z-index:20; }
          .hb-wish-wrap { max-width:700px; margin:0 auto; padding:70px 28px 120px; text-align:center; position:relative; z-index:1; }
          .hb-wish-eyebrow { font-family:'Cormorant Garamond',serif; font-size:0.65rem; letter-spacing:5px; text-transform:uppercase; color:#c8687e; margin-bottom:18px; animation:hbFadeUp 0.8s 0.2s ease both; opacity:0; }
          .hb-wish-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2rem,6vw,3.2rem); font-weight:300; color:#2d1a20; line-height:1.2; margin-bottom:50px; animation:hbFadeUp 0.8s 0.4s ease both; opacity:0; }
          .hb-wish-title em { font-style:italic; color:#e8426e; }
          .hb-card { background:rgba(255,255,255,0.7); border:1px solid rgba(232,66,110,0.15); border-radius:20px; padding:50px 40px; position:relative; box-shadow:0 8px 60px rgba(232,66,110,0.1); backdrop-filter:blur(8px); animation:hbFadeUp 1s 0.7s ease both; opacity:0; }
          .hb-corner { position:absolute; width:24px; height:24px; border-color:rgba(232,66,110,0.25); border-style:solid; }
          .hb-corner.tl { top:14px; left:14px; border-width:1px 0 0 1px; }
          .hb-corner.tr { top:14px; right:14px; border-width:1px 1px 0 0; }
          .hb-corner.bl { bottom:14px; left:14px; border-width:0 0 1px 1px; }
          .hb-corner.br { bottom:14px; right:14px; border-width:0 1px 1px 0; }
          .hb-card-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:300; font-style:italic; color:#e8426e; margin-bottom:32px; }
          .hb-body { font-family:'Padauk',serif; font-size:clamp(0.95rem,2.2vw,1.08rem); line-height:2.2; color:#5a3040; text-align:center; }
          .hb-body p { margin-bottom:20px; }
          .hb-signature { font-family:'Cormorant Garamond',serif; font-size:1rem; font-style:italic; color:#a06070; margin-top:36px; line-height:1.9; }
          .hb-close-btn { display:inline-block; margin-top:50px; padding:14px 38px; border:1px solid rgba(232,66,110,0.3); border-radius:50px; font-family:'Quicksand',sans-serif; font-size:0.85rem; letter-spacing:2px; text-transform:uppercase; color:#e8426e; background:rgba(255,255,255,0.6); cursor:pointer; transition:all 0.3s; animation:hbFadeUp 1s 1.2s ease both; opacity:0; }
          .hb-close-btn:hover { background:rgba(232,66,110,0.08); transform:translateY(-2px); }
          @keyframes hbFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        </style>

        <div id="hbParticles"></div>
        <audio id="hbMusic" loop preload="auto" style="display:none">
          <source src="happy-birthday.mp3" type="audio/mpeg">
        </audio>

        <!-- WISH PAGE -->
        <div id="hbWish">
          <div class="hb-wish-wrap">
            <p class="hb-wish-eyebrow">✦ March 7, 2026 ✦</p>
            <h1 class="hb-wish-title">Happy 20th Birthday,<br><em>Su Su</em> 🎂</h1>
            <div class="hb-card">
              <div class="hb-corner tl"></div><div class="hb-corner tr"></div>
              <div class="hb-corner bl"></div><div class="hb-corner br"></div>
              <p class="hb-card-title">🎂 Happy 20th Birthday, Su Su 🤍</p>
              <div class="hb-body">
                <p>အသက် ၂၀ ပြည့် မွေးနေ့မှာ ပျော်ရွှင်ပါစေနော် စုစု — မွေးနေ့ကစလို့နေ့တိုင်းမှာ ပျော်ရွှင်မှုတွေ၊ လှပတဲ့ အစပြုခြင်း မျှော်လင့်ချက် တွေနဲ့ ပြည့်နေပါစေ။</p>
                <p>အမြဲတမ်း အေးချမ်းပြီး ကျန်းမာတဲ့ စိတ်နှလုံးကို ပိုင်ဆိုင်နိုင်ပါစေ။<br>
                စုစုရဲ့ အိပ်မက်တွေကို အကောင်အထည်ဖော်ဖို့အတွက် ခန္ဓာကိုယ် ကျန်းမာကြံ့ခိုင်ပြီး အားအင် အပြည့် ရှိပါစေ။<br>
                မိဘနှစ်ပါးအတွက် အမြဲတမ်း ချစ်စရာကောင်းတဲ့ အဖိုးတန်တဲ့ ကောင်းချီးမင်္ဂလာသမီးရတနာလေး ဖြစ်ပါစေ။<br>
                စုစုအပေါ် စစ်မှန်တဲ့ စေတနာနဲ့ ဂရုစိုက်မယ့် သစ္စာရှိတဲ့ သူငယ်ချင်းကောင်းတွေနဲ့ပဲ ဆုံတွေ့ရပါစေ။<br>
                ဟန်ဆောင်မှုရှိတဲ့ သူငယ်ချင်းတွေနဲ့ အဆိပ်အတောက်ဖြစ်စေတဲ့ relationship တွေ စုစုရဲ့ဘဝထဲကနေ ဝေးဝေးမှာပဲ ရှိပါစေ။<br>
                လူအများအပြားကို ကြင်နာမှုနဲ့ ကူညီပေးနိုင်မယ့် မွန်မြတ်တဲ့ ဆရာဝန်မလေးတစ်ယောက် ဖြစ်လာပါစေ။<br>
                နောင်တစ်ချိန်မှာ ကျွမ်းကျင်တဲ့ သားဖွားမီးယပ်အထူးကု ဆရာဝန်ကြီး (OG) တစ်ယောက် ဖြစ်ပါစေ။<br>
                လာမယ့် စာမေးပွဲတိုင်းမှာ စိတ်အေးအေးထားပြီး ယုံကြည်မှုအပြည့်နဲ့ ဖြေဆိုနိုင်ပါစေ။<br>
                လာမယ့် MET တွေမှာ ကောင်းမွန်စွာဖြေဆိုနိုင်ပြီး အမှတ် 600 ပါစေ။<br>
                ဆေးပညာနယ်ပယ်မှာဖြစ်စေ၊ စုစု ဝါသနာပါတဲ့ ဘယ်နယ်ပယ်မှာပဲဖြစ်ဖြစ် စုစုရဲ့ ရည်မှန်းချက်တွေအားလုံး အောင်မြင်ပါစေ။<br>
                စုစုလိုအပ်တဲ့ အချိန်တိုင်းမှာ ကံကောင်းခြင်းတွေက စုစုဆီကို ညင်သာစွာ ရောက်ရှိလာပါစေ။<br>
                ကံမကောင်းမှုတွေနဲ့ ဝမ်းနည်းမှုတွေက စုစုရဲ့ ဘဝခရီးကနေ ဝေးဝေးမှာပဲ ရှိပါစေ။<br>
                ဘဝရဲ့ စိန်ခေါ်မှုတိုင်းကိုလည်း တည်ငြိမ်တဲ့ ခွန်အားတွေနဲ့ ကျော်ဖြတ်နိုင်ပါစေ။<br>
                ကမ္ဘာပတ်ပြီး စုစုသွားချင်တဲ့ နေရာတွေကို အရောက်သွားနိုင်ပါစေ။<br>
                စုစုကြိုက်တဲ့ အရသာရှိတဲ့ အစားအသောက်တွေကို စားသောက်ရင်း လွတ်လပ်ပေါ့ပါးစွာ ပြုံးပျော်နိုင်ပါစေ။<br>
                အတွင်းစိတ်ရော အပြင်ပန်းပါ အခုလိုပဲ အမြဲတမ်း သဘာဝအတိုင်း လှပနေပါစေ။<br>
                စုစုလုပ်သမျှ အရာတိုင်းမှာ ကိုယ်ပိုင်ပျော်ရွှင်မှုကို လွတ်လပ်စွာ ရွေးချယ်နိုင်ပါစေ။<br>
                စုစုချစ်ရတဲ့ မိသားစုနဲ့အတူတူ ပျော်ရွှင်စရာကောင်းတဲ့ နှစ်ပေါင်းများစွာကို အတူဖြတ်သန်းနိုင်ပါစေ။</p>
                <p>နောက်ဆုံးအနေနဲ့ စုစုရှေ့လျှောက်ဘဝမှာကြုံလာတဲ့ဆင်းရဲခြင်းချမ်းသာခြင်းပျော်ရွှင်ခြင်းဝမ်းနည်းခြင်းတွေအားလုံးကို ချစ်ရတဲ့သူရဲ့လက်ကိုတွဲပြီး အကောင်းဆုံးရင်ဆိုင်နိုင်ပြီး သာယာပျော်ရွှင်ချမ်းမြေ့တဲ့မိသားစု ဘဝလေးတစ်ခုကိုပိုင်ဆိုင်ရပါစေ လို့ ဆုတောင်းပေးလိုက်ပါတယ်နော်။</p>
              </div>
              <p class="hb-signature">မေတ္တာဖြင့်၊<br><em>— စုစုကို အမြဲတမ်းအဆင်ပြေ ပျော်ရွှင်နေစေချင်သူ 🤍</em></p>
            </div>
            <button class="hb-close-btn" onclick="window.close()">Close the Tab</button>
          </div>
        </div>

        <script>
          // ── PARTICLES ──
          const COLORS = ['#f472b6','#fb7185','#fbbf24','#a78bfa','#34d399','#60a5fa','#f9a8d4'];
          const SHAPES = ['🌸','⭐','✨','🌺','💫'];
          function spawnParticles(containerId, count) {
            const wrap = document.getElementById(containerId);
            if (!wrap) return;
            for (let i = 0; i < count; i++) {
              const p = document.createElement('div');
              p.classList.add('hb-particle');
              const useEmoji = Math.random() > 0.5;
              if (useEmoji) {
                p.textContent = SHAPES[Math.floor(Math.random()*SHAPES.length)];
                p.style.fontSize = Math.random()*16+10 + 'px';
                p.style.background = 'transparent';
              } else {
                const size = Math.random()*10+5;
                p.style.width = size+'px';
                p.style.height = size+'px';
                p.style.background = COLORS[Math.floor(Math.random()*COLORS.length)];
                p.style.borderRadius = Math.random()>0.5 ? '50%' : '2px';
              }
              p.style.left = Math.random()*100 + 'vw';
              p.style.animationDuration = Math.random()*4+3 + 's';
              p.style.animationDelay = Math.random()*4 + 's';
              wrap.appendChild(p);
            }
          }
          spawnParticles('hbParticles', 80);

          // Music fade-in
          setTimeout(() => {
              const music = document.getElementById('hbMusic');
              if (music) { music.volume = 0.5; music.play().catch(()=>{}); }
          }, 300);
        <\/script>
      `;
        }
    }, 500);
}
