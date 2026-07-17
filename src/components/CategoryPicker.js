import React from "react";
import { categories, categoryEmojis } from "../data/words";
import "./CategoryPicker.css";

function CategoryPicker({ onSelect }) {
  return (
    <div className="category-picker">
      <h2 className="category-title">Pick a Category</h2>
      <p className="category-sub">The actor will guess this in 60 seconds!</p>
      <div className="category-grid">
        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            className="category-card"
            onClick={() => onSelect(cat)}
          >
            <span className="cat-emoji">{categoryEmojis[cat]}</span>
            <span className="cat-name">{cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryPicker;
