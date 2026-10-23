const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Check whether the backend is working
app.get("/", (req, res) => {
  res.json({
    message: "StoreOrSell backend is running!"
  });
});

// Crop calculation API
app.post("/api/calculate", (req, res) => {
  const {
    quantity,
    currentPrice,
    futurePrice,
    storageDays,
    storageCostPerDay,
    spoilagePercent
  } = req.body;

  const values = [
    quantity,
    currentPrice,
    futurePrice,
    storageDays,
    storageCostPerDay,
    spoilagePercent
  ];

  if (
    values.some(
      value => typeof value !== "number" || !Number.isFinite(value)
    ) ||
    quantity <= 0 ||
    currentPrice < 0 ||
    futurePrice < 0 ||
    storageDays < 0 ||
    storageCostPerDay < 0 ||
    spoilagePercent < 0 ||
    spoilagePercent > 100
  ) {
    return res.status(400).json({
      error: "Please enter valid calculation values."
    });
  }

  const sellNow = quantity * currentPrice;
  const holdValue =
    quantity * (1 - spoilagePercent / 100) * futurePrice -
    storageCostPerDay * storageDays;

  const difference = holdValue - sellNow;

  res.json({
    sellNow: Number(sellNow.toFixed(2)),
    holdValue: Number(holdValue.toFixed(2)),
    difference: Number(difference.toFixed(2)),
    recommendation: difference > 0 ? "HOLD" : "SELL NOW"
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});