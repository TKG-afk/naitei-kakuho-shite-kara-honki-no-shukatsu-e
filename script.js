const slides = Array.from(document.querySelectorAll(".slide"));
const pageNumber = document.getElementById("pageNumber");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const fullBtn = document.getElementById("fullBtn");
const stage = document.getElementById("stage");

let currentIndex = 0;

function updateSlide(nextIndex) {
  slides[currentIndex].classList.remove("active");
  currentIndex = (nextIndex + slides.length) % slides.length;
  slides[currentIndex].classList.add("active");

  const current = currentIndex + 1;
  pageNumber.textContent = `${current} / ${slides.length}`;
  progressBar.style.width = `${(current / slides.length) * 100}%`;
}

function nextSlide() {
  updateSlide(currentIndex + 1);
}

function prevSlide() {
  updateSlide(currentIndex - 1);
}

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

fullBtn.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await stage.requestFullscreen();
    return;
  }

  await document.exitFullscreen();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    nextSlide();
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    prevSlide();
  }
});

document.querySelectorAll("[data-answer-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.parentElement.querySelector("[data-answer]");
    if (!answer) return;

    answer.classList.toggle("revealed");
    button.textContent = answer.classList.contains("revealed") ? "答えを隠す" : "答えを見る";
  });
});

let touchStartX = null;

stage.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

stage.addEventListener("touchend", (event) => {
  if (touchStartX === null) return;

  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 60) {
    delta < 0 ? nextSlide() : prevSlide();
  }

  touchStartX = null;
}, { passive: true });

updateSlide(0);
