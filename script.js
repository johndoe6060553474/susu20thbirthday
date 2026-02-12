diff --git a/script.js b/script.js
new file mode 100644
index 0000000000000000000000000000000000000000..0dd0953b27be0e02f5205d35772ceb9d78c9146e
--- /dev/null
+++ b/script.js
@@ -0,0 +1,158 @@
+const heartGrid = document.getElementById("heart-grid");
+const surpriseBtn = document.getElementById("surprise-btn");
+const surpriseLine = document.getElementById("surprise-line");
+
+// 20 image placeholders expected by the user.
+const photoSources = Array.from({ length: 20 }, (_, i) => `photos/her-${String(i + 1).padStart(2, "0")}.jpg`);
+
+// Romantic short labels are attached via JS captions.
+const romanticCaptions = [
+  "Your smile",
+  "First hello",
+  "Golden hour",
+  "Sweet chaos",
+  "My calm place",
+  "Stolen glance",
+  "Coffee date",
+  "That laugh",
+  "Rainy walk",
+  "Festival night",
+  "You glowing",
+  "Little moments",
+  "My favorite trip",
+  "Soft eyes",
+  "Sunset us",
+  "Pure magic",
+  "Your kindness",
+  "My safe heart",
+  "Our memory",
+  "Forever crush",
+];
+
+// Hand-tuned coordinates to create a smooth 20-slot heart silhouette.
+const heartPoints = [
+  [50, 8], [39, 12], [61, 12], [30, 19], [70, 19],
+  [23, 29], [77, 29], [17, 41], [83, 41], [23, 52],
+  [77, 52], [30, 63], [70, 63], [38, 74], [62, 74],
+  [44, 84], [56, 84], [48, 91], [52, 91], [50, 97],
+];
+
+function makeFallback(index) {
+  return `data:image/svg+xml,${encodeURIComponent(
+    `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#ffe0ee'/><stop offset='100%' stop-color='#e4ddff'/></linearGradient></defs><rect width='260' height='260' rx='34' fill='url(#g)'/><text x='50%' y='47%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Arial' font-size='34' fill='#834779'>Photo ${index + 1}</text><text x='50%' y='64%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Arial' font-size='16' fill='#834779'>Add image</text></svg>`
+  )}`;
+}
+
+function buildHeartGallery() {
+  // Center message card required by brief.
+  const center = document.createElement("article");
+  center.className = "center-message";
+  center.textContent = "20 years of you. 20 reasons I adore you.";
+  heartGrid.appendChild(center);
+
+  photoSources.forEach((src, index) => {
+    const slot = document.createElement("article");
+    slot.className = "photo-slot";
+
+    const [x, y] = heartPoints[index];
+    slot.style.setProperty("--x", `${x}%`);
+    slot.style.setProperty("--y", `${y}%`);
+    slot.style.setProperty("--r", `${-10 + Math.random() * 20}deg`);
+
+    const inner = document.createElement("div");
+    inner.className = "photo-inner";
+
+    const img = document.createElement("img");
+    img.src = src;
+    img.alt = romanticCaptions[index];
+    img.loading = "lazy";
+    img.onerror = () => {
+      img.src = makeFallback(index);
+    };
+
+    const caption = document.createElement("p");
+    caption.className = "photo-caption";
+    caption.textContent = romanticCaptions[index];
+
+    inner.append(img, caption);
+    slot.appendChild(inner);
+    heartGrid.appendChild(slot);
+
+    slot.style.transform = `${slot.style.transform} scale(0.8)`;
+    setTimeout(() => {
+      slot.style.transition = "opacity 0.6s ease, transform 0.6s ease";
+      slot.classList.add("show");
+      slot.style.transform = slot.style.transform.replace(" scale(0.8)", "");
+    }, index * 80);
+  });
+}
+
+const romanticLines = [
+  "You are my favorite notification.",
+  "If I could relive one memory forever, it would be us.",
+  "You don’t just light up rooms — you light up my life.",
+  "Loving you is my favorite habit.",
+  "Every version of my future has you in it.",
+  "You make ordinary days feel magical.",
+  "I didn’t find love. I found you.",
+  "20 years of the world being lucky to have you.",
+  "You are my safest place.",
+  "Forever starts with you.",
+];
+
+surpriseBtn.addEventListener("click", () => {
+  surpriseLine.textContent = romanticLines[Math.floor(Math.random() * romanticLines.length)];
+  surpriseLine.classList.remove("show");
+  requestAnimationFrame(() => surpriseLine.classList.add("show"));
+  burstConfetti(180);
+});
+
+const canvas = document.getElementById("confetti-canvas");
+const ctx = canvas.getContext("2d");
+let confetti = [];
+
+function resizeCanvas() {
+  canvas.width = window.innerWidth;
+  canvas.height = window.innerHeight;
+}
+
+function burstConfetti(count) {
+  for (let i = 0; i < count; i += 1) {
+    confetti.push({
+      x: Math.random() * canvas.width,
+      y: -10 - Math.random() * canvas.height * 0.25,
+      size: 4 + Math.random() * 6,
+      vx: -1.4 + Math.random() * 2.8,
+      vy: 1.8 + Math.random() * 3.5,
+      angle: Math.random() * Math.PI,
+      spin: -0.1 + Math.random() * 0.2,
+      color: `hsl(${Math.random() * 360}, 88%, 66%)`,
+    });
+  }
+}
+
+function animate() {
+  ctx.clearRect(0, 0, canvas.width, canvas.height);
+  confetti = confetti.filter((piece) => piece.y < canvas.height + 18);
+
+  confetti.forEach((piece) => {
+    piece.x += piece.vx;
+    piece.y += piece.vy;
+    piece.angle += piece.spin;
+
+    ctx.save();
+    ctx.translate(piece.x, piece.y);
+    ctx.rotate(piece.angle);
+    ctx.fillStyle = piece.color;
+    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.64);
+    ctx.restore();
+  });
+
+  requestAnimationFrame(animate);
+}
+
+window.addEventListener("resize", resizeCanvas);
+resizeCanvas();
+buildHeartGallery();
+burstConfetti(180);
+animate();
