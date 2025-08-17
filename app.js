import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import "./app.css";

export default function App() {
  const [cats, setCats] = useState([]);
  const [liked, setLiked] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate 12 random cat image URLs from Cataas
    const urls = Array.from({ length: 12 }, (_, i) =>
      `https://cataas.com/cat?random=${i}&width=400&height=400`
    );
    setCats(urls);
    setLoading(false);
  }, []);

  const swiped = (dir, cat) => {
    if (dir === "right") setLiked((prev) => [...prev, cat]);
    setIndex((prev) => prev + 1);
  };

  const restart = () => {
    setLiked([]);
    setIndex(0);
  };

  if (loading) return <h2 className="loading">Loading cats... 🐾</h2>;

  if (index >= cats.length) {
    return (
      <div className="summary">
        <h2>You liked {liked.length} cats! 🐾</h2>
        <div className="grid">
          {liked.map((cat, i) => (
            <img key={i} src={cat} alt="liked cat" className="liked-img" />
          ))}
        </div>
        <button onClick={restart} className="restart-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="title">Paws & Preferences 🐱</h1>
      <div className="card-container">
        {cats.slice(index, index + 1).map((cat, i) => (
          <TinderCard
            key={i}
            className="swipe"
            preventSwipe={["up", "down"]}
            onSwipe={(dir) => swiped(dir, cat)}
          >
            <div className="card">
              <img src={cat} alt="cat" className="cat-img" />
            </div>
          </TinderCard>
        ))}
      </div>
      <p className="instructions">Swipe right to like ❤️ | Swipe left to skip ❌</p>
    </div>
  );
}
