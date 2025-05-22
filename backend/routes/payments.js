const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all payments
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        пл.*,
        пр."id_покупателя", пр."vin_автомобиля", пр."дата_продажи", пр."итоговая_сумма_сделки",
        к."фио_покупателя"
      FROM "Платеж" пл
      JOIN "Продажа" пр ON пл."id_продажи" = пр."id_продажи"
      JOIN "Покупатель" к ON пр."id_покупателя" = к."id_покупателя"
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET payment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        пл.*,
        пр."id_покупателя", пр."vin_автомобиля", пр."дата_продажи", пр."итоговая_сумма_сделки",
        к."фио_покупателя"
      FROM "Платеж" пл
      JOIN "Продажа" пр ON пл."id_продажи" = пр."id_продажи"
      JOIN "Покупатель" к ON пр."id_покупателя" = к."id_покупателя"
      WHERE пл."id_платежа" = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new payment
router.post('/', async (req, res) => {
  try {
    const { id_платежа, id_продажи, дата_платежа, сумма_платежа, способ_оплаты, статус_платежа } = req.body;
    
    // Check if the sale exists
    const saleCheck = await db.query('SELECT * FROM "Продажа" WHERE "id_продажи" = $1', [id_продажи]);
    if (saleCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    const result = await db.query(
      `INSERT INTO "Платеж" (
        "id_платежа", "id_продажи", "дата_платежа", 
        "сумма_платежа", "способ_оплаты", "статус_платежа"
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_платежа, id_продажи, дата_платежа, сумма_платежа, способ_оплаты, статус_платежа]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update payment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { дата_платежа, сумма_платежа, способ_оплаты, статус_платежа } = req.body;
    
    const result = await db.query(
      `UPDATE "Платеж" SET 
        "дата_платежа" = $1, 
        "сумма_платежа" = $2, 
        "способ_оплаты" = $3,
        "статус_платежа" = $4
      WHERE "id_платежа" = $5 RETURNING *`,
      [дата_платежа, сумма_платежа, способ_оплаты, статус_платежа, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM "Платеж" WHERE "id_платежа" = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 