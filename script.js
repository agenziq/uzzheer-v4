// Core game state
const playfulNoMessages = [
  "No button is allergic 😭",
  "Nice try 😌",
  "System says absolutely not 🙅‍♂️",
  "Aray aray, no is unavailable 😏",
  "Access denied: Only Yes mode on 💖"
];

const verificationStatuses = [
  "Checking vibes…",
  "Verifying loyalty…",
  "Matching heartbeat frequency…",
  "Scanning long-distance love signal…",
  "Heer certified ✅"
];

const memeLines = [
  "Long distance? Bas wifi weak hai, love full signal pe hai 😌",
  "Tum ho to har day Valentine's lagta hai 💘",
  "Heer + Uzzii = no bug, only hugs 🫶",
  "Meri timeline ka best reel: tumhari smile ✨",
  "Tumhari yaad daily notification ban chuki hai 📲💗",
  "Main coffee, tum sugar — together perfect scene ☕",
  "Duniya buffering kare, humara pyaar HD mein chale 🎬",
  "Aaj ka mood: tum, kal ka mood: tum, har mood: tum 😭",
  "Mera GPS har dafa tumhari taraf reroute karta hai 🧭",
  "Tum ho to boring day bhi soft-launch ho jata hai 🌸",
  "Heer ji, aap official heart admin ho 🔐",
  "Mera heart password: UZZHEER123 (don't leak) 🤫",
  "Tum bina din low battery jaisa lagta hai 🔋",
  "Apni jodi ka algorithm 100% match hai ✅",
  "You're my favorite tab, never closing 💻💞",
  "Teri ek text, mera pura mood upgrade 📈",
  "Tumhare hugs pending hain, interest bhi lag raha hai 🤭",
  "Meri jaan, tum meri comfort playlist ho 🎧",
  "Aaj bhi dil bolta: Heer online kab aayegi? 👀",
  "Hum dono ka vibe: cute chaos + forever peace 🫠",
  "Aankhon ka captcha solved: only Heer detected 💫",
  "Distance ko bolo chup, feelings loud hain 📢",
  "Tumhari hasi = meri favorite ringtone 🎶",
  "Phir se confirm: tum cutest ho, case closed 🧑‍⚖️💘",
  "Main meme bheju, tum smile bhejo — deal? 😭",
  "Tumhari yaad ka data unlimited hai 📡",
  "Uzzheer ship kabhi sink nahi hoti 🚢💕"
];

const landing = document.getElementById("landing");
const finalSection = document.getElementById("finalSection");
const arena = document.getElementById("arena");
const buttonLayer = document.getElementById("buttonLayer");
const arenaMessage = document.getElementById("arenaMessage");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const modal = document.getElementById("verificationModal");
const progressBar = document.getElementById("progressBar");
const verificationStatus = document.getElementById("verificationStatus");
const nextStepBtn = document.getElementById("nextStepBtn");
const missSlider = document.getElementById("missSlider");
const sliderValue = document.getElementById("sliderValue");
const heartGame = document.getElementById("heartGame");
const heartCount = document.getElementById("heartCount");
const magicInput = document.getElementById("magicInput");
const unlockBtn = document.getElementById("unlockBtn");
const memeBtn = document.getElementById("memeBtn");
const memeOutput = document.getElementById("memeOutput");
const heartLayer = document.getElementById("heartLayer");
const easterEgg = document.getElementById("easterEgg");

const steps = [...document.querySelectorAll(".step")];
let currentStep = 0;
let noAttempts = 0;
let yesAttempts = 0;
let tappedHearts = 0;
let tapTimes = [];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Places both buttons inside the arena safely on load/resize.
function placeInitialButtons() {
  const layerRect = buttonLayer.getBoundingClientRect();
  yesBtn.style.left = `${layerRect.width * 0.2}px`;
  yesBtn.style.top = `${layerRect.height * 0.58}px`;

  noBtn.style.left = `${layerRect.width * 0.62}px`;
  noBtn.style.top = `${layerRect.height * 0.2}px`;
}

// Moves a button within boundaries, keeping it fully visible.
function moveInsideLayer(button, padding = 10) {
  const layerRect = buttonLayer.getBoundingClientRect();
  const btnRect = button.getBoundingClientRect();
  const maxX = Math.max(padding, layerRect.width - btnRect.width - padding);
  const maxY = Math.max(padding, layerRect.height - btnRect.height - padding);
  button.style.left = `${randomBetween(padding, maxX)}px`;
  button.style.top = `${randomBetween(padding, maxY)}px`;
}

// Dodges the no button whenever a pointer comes near.
function handleNoDodge(event) {
  const eX = event.clientX ?? event.touches?.[0]?.clientX;
  const eY = event.clientY ?? event.touches?.[0]?.clientY;
  if (eX == null || eY == null) return;

  const noRect = noBtn.getBoundingClientRect();
  const distance = Math.hypot(eX - (noRect.left + noRect.width / 2), eY - (noRect.top + noRect.height / 2));

  if (distance < 90) {
    noAttempts += 1;
    arenaMessage.textContent = noAttempts >= 10
      ? "Nice try 😌 Uzzheer wins."
      : playfulNoMessages[noAttempts % playfulNoMessages.length];

    moveInsideLayer(noBtn, 12);

    if (noAttempts >= 10) {
      burstHearts(window.innerWidth / 2, window.innerHeight / 2, 14);
    }
  }
}

// Yes button slips away first two attempts, then opens verification modal.
yesBtn.addEventListener("click", () => {
  yesAttempts += 1;

  if (yesAttempts <= 2) {
    arenaMessage.textContent = yesAttempts === 1
      ? "Easy easy 😜 prove your love first"
      : "One more tiny chase and then promise 💘";
    moveInsideLayer(yesBtn, 12);
    return;
  }

  openModal();
});

noBtn.addEventListener("click", () => {
  noAttempts += 1;
  arenaMessage.textContent = noAttempts >= 10
    ? "Nice try 😌 Uzzheer wins."
    : playfulNoMessages[noAttempts % playfulNoMessages.length];
  moveInsideLayer(noBtn, 12);

  if (noAttempts >= 10) {
    burstHearts(window.innerWidth / 2, window.innerHeight / 2, 14);
  }
});

arena.addEventListener("pointermove", handleNoDodge);
arena.addEventListener("touchstart", handleNoDodge, { passive: true });

function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  currentStep = 0;
  showStep();
}

function showStep() {
  steps.forEach((step, i) => step.classList.toggle("active-step", i === currentStep));
  progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  verificationStatus.textContent = verificationStatuses[currentStep];
  nextStepBtn.style.display = currentStep === steps.length - 1 ? "none" : "inline-block";

  if (currentStep === 2) {
    spawnHeartGame();
  }
}

function validateStep() {
  if (currentStep === 0) {
    const selected = document.querySelector('input[name="cutest"]:checked');
    return Boolean(selected);
  }

  if (currentStep === 1) {
    return Number(missSlider.value) >= 1;
  }

  if (currentStep === 2) {
    return tappedHearts >= 7;
  }

  if (currentStep === 3) {
    return magicInput.value.trim().toLowerCase().replace(/\s+/g, " ") === "i love you uzzii";
  }

  return true;
}

nextStepBtn.addEventListener("click", () => {
  if (!validateStep()) {
    arenaMessage.textContent = "Awww, thora sa aur pyaar verify karo 💗";
    return;
  }

  if (currentStep < steps.length - 1) {
    currentStep += 1;
    showStep();
  }
});

unlockBtn.addEventListener("click", () => {
  if (currentStep !== 4) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  landing.classList.remove("active");
  finalSection.classList.add("active");

  burstHearts(window.innerWidth / 2, window.innerHeight / 2, 22);
  driftHeartsForTenSeconds();
});

missSlider.addEventListener("input", () => {
  sliderValue.textContent = missSlider.value;
});

// Generates floating hearts for step 3 mini-game.
function spawnHeartGame() {
  heartGame.innerHTML = "";
  tappedHearts = 0;
  heartCount.textContent = "0";

  for (let i = 0; i < 10; i += 1) {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = "💖";
    h.style.left = `${randomBetween(5, 88)}%`;
    h.style.top = `${randomBetween(8, 78)}%`;
    h.style.animationDelay = `${randomBetween(0, 1.5)}s`;

    h.addEventListener("click", () => {
      if (h.dataset.hit) return;
      h.dataset.hit = "1";
      h.style.opacity = "0.3";
      tappedHearts += 1;
      heartCount.textContent = String(tappedHearts);
    });

    heartGame.appendChild(h);
  }
}

// One-time burst hearts for celebration events.
function burstHearts(x, y, count = 12) {
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = "💗";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty("--x", `${randomBetween(-140, 140)}px`);
    heart.style.setProperty("--y", `${randomBetween(-200, -40)}px`);
    heartLayer.appendChild(heart);

    setTimeout(() => heart.remove(), 1400);
  }
}

// Gentle drifting hearts for ~10 seconds after final reveal.
function driftHeartsForTenSeconds() {
  const start = Date.now();
  const interval = setInterval(() => {
    const heart = document.createElement("span");
    heart.className = "drift-heart";
    heart.textContent = ["💗", "💞", "💖"][Math.floor(Math.random() * 3)];
    heart.style.left = `${randomBetween(2, 96)}vw`;
    heart.style.bottom = "-20px";
    heart.style.animationDuration = `${randomBetween(3.5, 5.5)}s`;
    heartLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 5600);

    if (Date.now() - start > 10000) {
      clearInterval(interval);
    }
  }, 220);
}

memeBtn.addEventListener("click", () => {
  const line = memeLines[Math.floor(Math.random() * memeLines.length)];
  memeOutput.textContent = line;
});

// Hidden easter egg: triple click/tap anywhere to flash text.
function registerTap() {
  const now = Date.now();
  tapTimes = tapTimes.filter((t) => now - t < 650);
  tapTimes.push(now);

  if (tapTimes.length >= 3) {
    easterEgg.classList.remove("show");
    void easterEgg.offsetWidth;
    easterEgg.classList.add("show");
    tapTimes = [];
  }
}

document.addEventListener("click", registerTap);
document.addEventListener("touchend", registerTap, { passive: true });
window.addEventListener("resize", placeInitialButtons);

placeInitialButtons();
