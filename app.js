const cardContainer = document.getElementById("card-container");
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");
const summaryDiv = document.getElementById("summary");
const progressDiv = document.getElementById("progress");
const playAgainBtn = document.getElementById("play-again");
const totalCatsInput = document.getElementById("total-cats");
const startBtn = document.getElementById("start-btn");

let cats = [];
let currentIndex = 0;
let likedCats = [];
let totalCats = parseInt(totalCatsInput.value) || 10;

// Random cat URL
function getRandomCatUrl() {
  return `https://cataas.com/cat?${new Date().getTime()}&rand=${Math.random()}`;
}

// Preload cats
function preloadCats(totalCats) {
  cats = [];
  currentIndex = 0;
  likedCats = [];
  summaryDiv.innerHTML = "";
  progressDiv.textContent = "";
  playAgainBtn.style.display = "none";

  for (let i = 0; i < totalCats; i++) {
    cats.push(getRandomCatUrl());
  }
  showCard();
}

// Add swipe gestures
let startX = 0;
let currentCard = null;

function addSwipeListeners(card) {
  let offsetX = 0;

  card.addEventListener("pointerdown", e => {
    startX = e.clientX || e.touches?.[0]?.clientX;
    currentCard = card;
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", e => {
    if (!currentCard) return;
    const currentX = e.clientX || e.touches?.[0]?.clientX;
    offsetX = currentX - startX;
    card.style.transform = `translateX(${offsetX}px) rotate(${offsetX / 15}deg)`;
  });

  card.addEventListener("pointerup", e => {
    if (!currentCard) return;

    if (offsetX > 100) swipe("right");
    else if (offsetX < -100) swipe("left");
    else card.style.transform = "translateX(0px) rotate(0deg)";

    currentCard = null;
    offsetX = 0;
  });

  card.addEventListener("pointercancel", () => {
    if (currentCard) {
      currentCard.style.transform = "translateX(0px) rotate(0deg)";
      currentCard = null;
      offsetX = 0;
    }
  });
}

// Show current cat
function showCard() {
  cardContainer.innerHTML = "";
  if (currentIndex >= cats.length) {
    showSummary();
    return;
  }

  progressDiv.textContent = `Cat ${currentIndex + 1} of ${cats.length}`;

  const card = document.createElement("div");
  card.className = "card";
  const img = document.createElement("img");
  img.src = cats[currentIndex];
  card.appendChild(img);
  cardContainer.appendChild(card);

  // Attach swipe listeners
  addSwipeListeners(card);
}

// Swipe animation
function swipe(direction) {
  const card = cardContainer.querySelector(".card");
  if (!card) return;

  const moveX = direction === "right" ? 400 : -400;
  card.style.transform = `translateX(${moveX}px) rotate(${direction === "right" ? 15 : -15}deg)`;
  card.style.opacity = "0";

  if (direction === "right") likedCats.push(cats[currentIndex]);
  currentIndex++;

  setTimeout(showCard, 300);
}

// Show summary with Play Again
function showSummary() {
  cardContainer.innerHTML = "";
  progressDiv.textContent = "";
  summaryDiv.innerHTML = `<h2>You liked ${likedCats.length} cats 🐾</h2>`;
  likedCats.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    summaryDiv.appendChild(img);
  });
  playAgainBtn.style.display = "inline-block";
}

// Button events
likeBtn.addEventListener("click", () => swipe("right"));
dislikeBtn.addEventListener("click", () => swipe("left"));
playAgainBtn.addEventListener("click", () => preloadCats(totalCats));
startBtn.addEventListener("click", () => {
  totalCats = parseInt(totalCatsInput.value) || 10;
  preloadCats(totalCats);
});

// Start the app with default
preloadCats(totalCats);
