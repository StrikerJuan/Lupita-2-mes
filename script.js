// ===== Museo de Lupita — carrusel de 12 fotografías =====

// Pequeñas leyendas para cada pieza del "museo".
// Puedes editar libremente estos textos.
const CAPTIONS = [
  "Pieza I · Tu sonrisa",
  "Pieza II · Esa mirada",
  "Pieza III · Un instante",
  "Pieza IV · Tú y el mundo",
  "Pieza V · Luz de mi vida",
  "Pieza VI · Sin palabras",
  "Pieza VII · Contigo",
  "Pieza VIII · Un buen día",
  "Pieza IX · Tu esencia",
  "Pieza X · Como te imagino",
  "Pieza XI · Mi favorita",
  "Pieza XII · Y las que faltan",
];

const TOTAL = 12;
const track = document.getElementById("track");
const dotsWrap = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let current = 0;

// --- Construir slides ---
// Se esperan fotos en:  fotos/foto1.jpg ... fotos/foto12.jpg
// Si una foto no existe, se muestra un marco elegante con un corazón.
for (let i = 1; i <= TOTAL; i++) {
  const slide = document.createElement("div");
  slide.className = "slide";

  // Extensiones a probar en orden (HEIC no lo muestran los navegadores)
  const EXTS = ["jpg", "jpeg", "png", "JPG", "JPEG"];
  const img = new Image();
  img.alt = CAPTIONS[i - 1];
  img.loading = "lazy";

  let extIndex = 0;
  const tryNextExt = () => {
    if (extIndex < EXTS.length) {
      img.src = `fotos/foto${i}.${EXTS[extIndex++]}`;
    } else {
      // No se encontró ninguna imagen: marco elegante de reemplazo
      slide.classList.add("slide--empty");
      slide.innerHTML = `
        <div class="slide__ph">
          <span>❦</span>
          Aquí irá la foto ${i}
          <br /><small>fotos/foto${i}</small>
        </div>`;
      const ph = document.createElement("div");
      ph.className = "slide__frame";
      ph.textContent = CAPTIONS[i - 1];
      slide.appendChild(ph);
    }
  };
  img.onerror = tryNextExt;
  tryNextExt();

  slide.appendChild(img);

  const cap = document.createElement("div");
  cap.className = "slide__frame";
  cap.textContent = CAPTIONS[i - 1];
  slide.appendChild(cap);

  track.appendChild(slide);

  // dot
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 1 ? " is-active" : "");
  dot.setAttribute("aria-label", `Ir a la foto ${i}`);
  dot.addEventListener("click", () => goTo(i - 1));
  dotsWrap.appendChild(dot);
}

// --- Navegación ---
function goTo(index) {
  current = (index + TOTAL) % TOTAL;
  track.style.transform = `translateX(-${current * 100}%)`;
  document.querySelectorAll(".dot").forEach((d, i) =>
    d.classList.toggle("is-active", i === current)
  );
}

prevBtn.addEventListener("click", () => goTo(current - 1));
nextBtn.addEventListener("click", () => goTo(current + 1));

// Teclado
document.addEventListener("keydown", (e) => {
  if (document.getElementById("museum").hidden) return;
  if (e.key === "ArrowLeft") goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
});

// Gestos táctiles (swipe)
let startX = 0;
const viewport = document.querySelector(".carousel__viewport");
viewport.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
viewport.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 45) goTo(current + (dx < 0 ? 1 : -1));
});

// --- Transición bienvenida -> museo ---
const btnVer = document.getElementById("btnVer");
const welcome = document.getElementById("welcome");
const museum = document.getElementById("museum");

btnVer.addEventListener("click", () => {
  welcome.style.transition = "opacity .6s ease, transform .6s ease";
  welcome.style.opacity = "0";
  welcome.style.transform = "translateY(-20px)";
  setTimeout(() => {
    welcome.hidden = true;
    museum.hidden = false;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 550);
});

// --- Reproductor de audio minimalista ---
const audio = document.getElementById("audio");
const player = document.getElementById("player");
const playerIcon = document.getElementById("playerIcon");
const playerProgress = document.getElementById("playerProgress");
const CIRC = 125.6; // circunferencia del anillo (2·π·20)

const ICON_PLAY = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
const ICON_PAUSE = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>';

player.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  player.classList.add("is-playing");
  playerIcon.innerHTML = ICON_PAUSE;
  player.setAttribute("aria-label", "Pausar canción");
});
audio.addEventListener("pause", () => {
  player.classList.remove("is-playing");
  playerIcon.innerHTML = ICON_PLAY;
  player.setAttribute("aria-label", "Reproducir canción");
});
audio.addEventListener("timeupdate", () => {
  const pct = audio.duration ? audio.currentTime / audio.duration : 0;
  playerProgress.style.strokeDashoffset = CIRC * (1 - pct);
});

// Al entrar al museo, intenta iniciar la canción suavemente
btnVer.addEventListener("click", () => {
  audio.volume = 0.4;
  audio.play().catch(() => {}); // si el navegador lo bloquea, queda el botón
});

// --- Pétalos flotantes ---
const petalsWrap = document.querySelector(".petals");
const PETAL_CHARS = ["🐧", "❁", "✿", "❤", "♥"];
for (let i = 0; i < 14; i++) {
  const p = document.createElement("span");
  p.className = "petal";
  p.textContent = PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)];
  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = 0.8 + Math.random() * 1.4 + "rem";
  p.style.color = `hsl(${340 + Math.random() * 20}, 55%, ${70 + Math.random() * 15}%)`;
  p.style.animationDuration = 9 + Math.random() * 10 + "s";
  p.style.animationDelay = -Math.random() * 12 + "s";
  petalsWrap.appendChild(p);
}
