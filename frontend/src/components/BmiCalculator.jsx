// frontend/src/components/BmiCalculator.jsx
import React, { useState } from "react";

function bmiCategory(bmi) {
  if (bmi === null || isNaN(bmi)) return "";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal range";
  if (bmi < 30) return "Overweight";
  return "Obesity";
}

export default function BmiCalculator({ initialKg = "", initialCm = "" }) {
  const [weight, setWeight] = useState(initialKg);
  const [heightCm, setHeightCm] = useState(initialCm);
  const [bmi, setBmi] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(heightCm);
    if (!w || !h) {
      setBmi(null);
      return;
    }
    const bmiVal = (w * 10000) / (h * h);
    const rounded = Math.round(bmiVal * 10) / 10;
    setBmi(rounded);
  };

  return (
    <div style={{ padding: 16, background: "#071226", color: "white", borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>BMI Calculator</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Weight (kg)</label>
          <input type="number" value={weight} onChange={(e)=>setWeight(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Height (cm)</label>
          <input type="number" value={heightCm} onChange={(e)=>setHeightCm(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={calculate} style={{ padding: "8px 12px" }}>Calculate</button>
        {bmi !== null && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{bmi}</div>
            <div style={{ color: "#9aa4b2" }}>{bmiCategory(bmi)}</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: "#9aa4b2" }}>
        BMI = weight (kg) / (height (m))². Height in cm is converted automatically.
      </div>
    </div>
  );
}
