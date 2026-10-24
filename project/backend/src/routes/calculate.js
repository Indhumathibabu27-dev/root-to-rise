import { Router } from 'express';

export const calculateRoute = Router();

calculateRoute.post('/', (req, res) => {
  const {
    crop,
    quantity,
    storageDays,
    currentPrice,
    expectedPrice,
    storageCostPerDay,
    spoilagePercent,
  } = req.body;

  if (typeof crop !== 'string' || !crop.trim()) {
    return res.status(400).json({ error: 'crop is required' });
  }
  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ error: 'quantity must be a positive number' });
  }
  if (typeof storageDays !== 'number' || storageDays <= 0) {
    return res.status(400).json({ error: 'storageDays must be a positive number' });
  }
  if (typeof currentPrice !== 'number' || currentPrice <= 0) {
    return res.status(400).json({ error: 'currentPrice must be a positive number' });
  }
  if (typeof expectedPrice !== 'number' || expectedPrice <= 0) {
    return res.status(400).json({ error: 'expectedPrice must be a positive number' });
  }
  if (typeof storageCostPerDay !== 'number' || storageCostPerDay < 0) {
    return res.status(400).json({ error: 'storageCostPerDay must be a non-negative number' });
  }
  if (typeof spoilagePercent !== 'number' || spoilagePercent < 0 || spoilagePercent > 100) {
    return res.status(400).json({ error: 'spoilagePercent must be between 0 and 100' });
  }

  const sellNowValue = quantity * currentPrice;
  const remainingQuantity = quantity * (1 - spoilagePercent / 100);
  const grossHoldRevenue = remainingQuantity * expectedPrice;
  const storageCost = storageCostPerDay * storageDays * quantity;
  const holdValue = grossHoldRevenue - storageCost;
  const spoilageLoss = quantity * currentPrice * (spoilagePercent / 100);
  const netDifference = holdValue - sellNowValue;
  const recommendation = netDifference > 0 ? 'hold' : 'sell';

  const reasonText = recommendation === 'hold'
    ? `Holding for ${storageDays} days is estimated to earn more than selling now, after accounting for ${spoilagePercent.toFixed(1)}% spoilage and storage costs.`
    : `Selling now is estimated to earn more than holding for ${storageDays} days, as storage costs and spoilage outweigh the expected price increase.`;

  return res.json({
    sellNowValue,
    holdValue,
    storageCost,
    spoilageLoss,
    netDifference,
    recommendation,
    reasonText,
  });
});
