import React, { useEffect, useMemo, useState } from "react";

export default function UpdateForm({ onPreview, initialGold = 0 }) {
  const [goldPrice, setGoldPrice] = useState(initialGold);

  useEffect(() => {
    setGoldPrice(initialGold || 0);
  }, [initialGold]);

  const nisabValue = useMemo(() => Number(goldPrice || 0) * 85, [goldPrice]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onPreview({ goldPrice: Number(goldPrice), nisabValue: Number(nisabValue) });
  };

  return (
    <form className="update-form" onSubmit={handleSubmit}>
      <div className="update-form-row">
        <label htmlFor="goldPrice">Gold Price (RM/g)</label>
        <input
          id="goldPrice"
          type="number"
          value={goldPrice}
          onChange={(e) => setGoldPrice(e.target.value)}
          min="0"
          step="0.01"
        />
      </div>

      <div className="update-form-row">
        <label>Nisab Value (RM)</label>
        <div className="readonly-field">RM {nisabValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>

      <button type="submit" className="btn btn-dark">
        Preview Update
      </button>
    </form>
  );
}
