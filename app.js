const cardContainer = document.getElementById("card-container");
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");
const summaryDiv = document.getElementById("summary");

let cats = [];         // stores URLs of cats shown
let currentIndex = 0;  // index of current cat
let likedCats = [];    // stores URLs of liked cats
const totalCats = 10;  // total cats to show

// Function to get a random cat URL (prevents caching)
function getRandomCatUrl() {
  return `https://cataas.com/cat?${new Date().getTime()}&rand=${Math.random()}`;
}

// Preload all cats URLs first
function preloadCats() {
  for (let i = 0; i < totalCats; i++) {
    cats.push(getRandomCatUrl());
  }
  showCard();
}

// Show current cat
function showCard() {
  cardContainer.innerHTML = "";
  if (currentIndex >= cats.length) {
    showSummary();
    return;
  }
  const card = document.createElement("div");
  card.className = "card";
  const img = document.createElement("img");
  img.src = cats[currentIndex];
  card.appendChild(img);
  cardContainer.appendChild(card);
}

// Handle swipe
function swipe(direction) {
  const card = cardContainer.querySelector(".card");
  if (!card) return;

  // Animate card
  const moveX = direction === "right" ? 400 : -400;
  card.style.transform = `translateX(${moveX}px) rotate(${direction === "right" ? 15 : -15}deg)`;
  card.style.opacity = "0";

  if (direction === "right") likedCats.push(cats[currentIndex]);
  currentIndex++;

  setTimeout(showCard, 300); // show next card
}

// Show liked cats summary
function showSummary() {
  cardContainer.innerHTML = "";
  summaryDiv.innerHTML = `<h2>You liked ${likedCats.length} cats 🐾</h2>`;
  likedCats.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    summaryDiv.appendChild(img);
  });
}

// Button events
likeBtn.addEventListener("click", () => swipe("right"));
dislikeBtn.addEventListener("click", () => swipe("left"));

// Start the app
preloadCats();
