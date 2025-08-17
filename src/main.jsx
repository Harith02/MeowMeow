import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import TinderCard from "react-tinder-card";
import "../public/app.css";

const App = () => {
  const [cats, setCats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const childRefs = useRef([]);

  useEffect(() => {
    const fetchCats = async () => {
      const urls = [];
      for (let i = 0; i < 10; i++) {
        const res = await fetch("https://cataas.com/cat?json=true");
        const data = await res.json();
        urls.push(`https://cataas.com/cat/${data._id}`);
      }
      setCats(urls);
      setCurrentIndex(urls.length - 1);
    };
    fetchCats();
  }, []);

  const handleSwipe = (direction, cat) => {
    if (direction === "right") setLikes((prev) => [...prev, cat]);
    setCurrentIndex((prev) => prev - 1);
  };

  const swipe = async (dir) => {
    if (currentIndex >= 0 && childRefs.current[currentIndex]) {
      await childRefs.current[currentIndex].swipe(dir);
    }
  };

  if (!cats.length) return <div>Loading cats 🐱...</div>;

  if (currentIndex < 0) {
    return (
      <div className="summary">
        <h2>You liked {likes.length} cats 🐾</h2>
        <div>
          {likes.map((cat, i) => (
            <img key={i} src={cat} alt="liked cat" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ position: "relative", width: "320px", height: "400px" }}>
        {cats.map((cat, index) =>
          index <= currentIndex ? (
            <TinderCard
              ref={(el) => (childRefs.current[index] = el)}
              className="card"
              key={cat}
              onSwipe={(dir) => handleSwipe(dir, cat)}
              preventSwipe={["up", "down"]}
            >
              <img src={cat} alt="cat" />
            </TinderCard>
          ) : null
        )}
      </div>

      <div className="button-row">
        <button className="button-dislike" onClick={() => swipe("left")}>
          ❌ Dislike
        </button>
        <button className="button-like" onClick={() => swipe("right")}>
          ❤️ Like
        </button>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
