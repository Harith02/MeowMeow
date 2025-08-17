const cardContainer = document.getElementById("card-container");
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");
const summaryDiv = document.getElementById("summary");

let cats = [];
let currentIndex = 0;
let likedCats = [];

// possible types and filters
const types = ["xsmall", "small", "medium", "square"];
const filters = ["mono", "blur", "negate", ""];

// Fetch 10 random cat images with random type and filter
async function fetchCats() {
  for (let i = 0; i < 10; i++) {
    const res = await fetch("https://cataas.com/cat?json=true");
    const data = await res.json();

    // Random type
    const types = ["xsmall", "small", "medium", "square"];
    const type = types[Math.floor(Math.random() * types.length)];

    // Random filter
    const filters = ["mono", "blur", "negate", ""];
    const filter = filters[Math.floor(Math.random() * filters.length)];

    // Base URL from API
    let url = `https://cataas.com${data.url}?type=${type}`;
    if (filter) url += `&filter=${filter}`;
    else if (Math.random() < 0.3) { // optional custom color tint
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      url += `&filter=custom&r=${r}&g=${g}&b=${b}`;
    }

    cats.push(url);
  }
  showCard();
}

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

function swipe(direction) {
  const card = cardContainer.querySelector(".card");
  if (!card) return;

  // animate card
  const moveX = direction === "right" ? 400 : -400;
  card.style.transform = `translateX(${moveX}px) rotate(${direction === "right" ? 15 : -15}deg)`;
  card.style.opacity = "0";

  if (direction === "right") likedCats.push(cats[currentIndex]);
  currentIndex++;

  setTimeout(showCard, 300); // show next card
}

function showSummary() {
  cardContainer.innerHTML = "";
  summaryDiv.innerHTML = `<h2>You liked ${likedCats.length} cats 🐾</h2>`;
  likedCats.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    summaryDiv.appendChild(img);
  });
}

likeBtn.addEventListener("click", () => swipe("right"));
dislikeBtn.addEventListener("click", () => swipe("left"));

fetchCats();
