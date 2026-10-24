import { Router } from 'express';
import { supabase } from '../supabaseClient.js';

export const historyRouter = Router();

historyRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('calculation_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const entries = (data ?? []).map((row) => ({
    id: row.id,
    date: row.created_at,
    crop: row.crop,
    quantity: Number(row.quantity),
    storageDays: Number(row.storage_days),
    recommendation: row.recommendation,
    netDifference: Number(row.net_difference),
  }));

  return res.json({ entries });
});

historyRouter.post('/', async (req, res) => {
  const {
    crop,
    quantity,
    storageDays,
    currentPrice,
    expectedPrice,
    storageCostPerDay,
    moisture,
    spoilagePercent,
    sellNowValue,
    holdValue,
    storageCostTotal,
    spoilageLoss,
    netDifference,
    recommendation,
    dataSource,
  } = req.body;

  if (typeof crop !== 'string' || !crop.trim()) {
    return res.status(400).json({ error: 'crop is required' });
  }
  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ error: 'quantity must be a positive number' });
  }

  const row = {
    crop,
    quantity,
    storage_days: storageDays,
    current_price: currentPrice,
    expected_price: expectedPrice,
    storage_cost_per_day: storageCostPerDay,
    moisture: moisture,
    spoilage_percent: spoilagePercent,
    sell_now_value: sellNowValue,
    hold_value: holdValue,
    storage_cost_total: storageCostTotal,
    spoilage_loss: spoilageLoss,
    net_difference: netDifference,
    recommendation: recommendation,
    data_source: dataSource || 'sample',
  };

  const { data, error } = await supabase
    .from('calculation_history')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const entry = {
    id: data.id,
    date: data.created_at,
    crop: data.crop,
    quantity: Number(data.quantity),
    storageDays: Number(data.storage_days),
    recommendation: data.recommendation,
    netDifference: Number(data.net_difference),
  };

  return res.status(201).json({ entry });
});

historyRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('calculation_history')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ success: true });
});

historyRouter.delete('/', async (_req, res) => {
  const { error } = await supabase
    .from('calculation_history')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ success: true });
});
