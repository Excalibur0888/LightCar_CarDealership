const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all sales with details
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        п.*,
        к."фио_покупателя", к."тип_покупателя", 
        а."цвет", а."комплектация_описание", а."год_выпуска",
        м."название_модели", м."тип_кузова",
        пр."название_производителя",
        с."фио_сотрудника", с."должность"
      FROM "Продажа" п
      JOIN "Покупатель" к ON п."id_покупателя" = к."id_покупателя"
      JOIN "Автомобиль" а ON п."vin_автомобиля" = а."vin_номер"
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      JOIN "Производитель" пр ON м."id_производителя" = пр."id_производителя"
      JOIN "Сотрудник" с ON п."id_сотрудника" = с."id_сотрудника"
    `);
    
    // Get payments for each sale
    for (const sale of result.rows) {
      const paymentsResult = await db.query(
        'SELECT * FROM "Платеж" WHERE "id_продажи" = $1',
        [sale.id_продажи]
      );
      sale.платежи = paymentsResult.rows;
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET sale by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        п.*,
        к."фио_покупателя", к."тип_покупателя", 
        а."цвет", а."комплектация_описание", а."год_выпуска",
        м."название_модели", м."тип_кузова",
        пр."название_производителя",
        с."фио_сотрудника", с."должность"
      FROM "Продажа" п
      JOIN "Покупатель" к ON п."id_покупателя" = к."id_покупателя"
      JOIN "Автомобиль" а ON п."vin_автомобиля" = а."vin_номер"
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      JOIN "Производитель" пр ON м."id_производителя" = пр."id_производителя"
      JOIN "Сотрудник" с ON п."id_сотрудника" = с."id_сотрудника"
      WHERE п."id_продажи" = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    const sale = result.rows[0];
    
    // Get payments for the sale
    const paymentsResult = await db.query(
      'SELECT * FROM "Платеж" WHERE "id_продажи" = $1',
      [id]
    );
    sale.платежи = paymentsResult.rows;
    
    res.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET payments for a specific sale
router.get('/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM "Платеж" WHERE "id_продажи" = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sale payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new sale (with transaction)
router.post('/', async (req, res) => {
  try {
    const { 
      id_продажи, id_покупателя, vin_автомобиля, id_сотрудника,
      дата_продажи, итоговая_сумма_сделки, условия_оплаты, платежи
    } = req.body;
    
    // Start a transaction
    await db.query('BEGIN');
    
    // Create the sale
    const saleResult = await db.query(
      `INSERT INTO "Продажа" (
        "id_продажи", "id_покупателя", "vin_автомобиля", "id_сотрудника",
        "дата_продажи", "итоговая_сумма_сделки", "условия_оплаты"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id_продажи, id_покупателя, vin_автомобиля, id_сотрудника, дата_продажи, итоговая_сумма_сделки, условия_оплаты]
    );
    
    // Update car status to 'Продан'
    await db.query(
      'UPDATE "Автомобиль" SET "статус_автомобиля" = $1 WHERE "vin_номер" = $2',
      ['Продан', vin_автомобиля]
    );
    
    // Create payments if provided
    if (платежи && платежи.length > 0) {
      for (const payment of платежи) {
        await db.query(
          `INSERT INTO "Платеж" (
            "id_платежа", "id_продажи", "дата_платежа", 
            "сумма_платежа", "способ_оплаты", "статус_платежа"
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            payment.id_платежа,
            id_продажи,
            payment.дата_платежа,
            payment.сумма_платежа,
            payment.способ_оплаты,
            payment.статус_платежа
          ]
        );
      }
    }
    
    await db.query('COMMIT');
    
    // Return the created sale with additional details
    const createdSale = saleResult.rows[0];
    const detailedSaleResult = await db.query(`
      SELECT 
        п.*,
        к."фио_покупателя", к."тип_покупателя",
        а."цвет", а."год_выпуска",
        м."название_модели",
        с."фио_сотрудника"
      FROM "Продажа" п
      JOIN "Покупатель" к ON п."id_покупателя" = к."id_покупателя"
      JOIN "Автомобиль" а ON п."vin_автомобиля" = а."vin_номер"
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      JOIN "Сотрудник" с ON п."id_сотрудника" = с."id_сотрудника"
      WHERE п."id_продажи" = $1
    `, [id_продажи]);
    
    const detailedSale = detailedSaleResult.rows[0];
    
    if (платежи && платежи.length > 0) {
      const paymentsResult = await db.query(
        'SELECT * FROM "Платеж" WHERE "id_продажи" = $1',
        [id_продажи]
      );
      detailedSale.платежи = paymentsResult.rows;
    } else {
      detailedSale.платежи = [];
    }
    
    res.status(201).json(detailedSale);
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update sale
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { дата_продажи, итоговая_сумма_сделки, условия_оплаты } = req.body;
    
    const result = await db.query(
      `UPDATE "Продажа" SET 
        "дата_продажи" = $1, 
        "итоговая_сумма_сделки" = $2, 
        "условия_оплаты" = $3
      WHERE "id_продажи" = $4 RETURNING *`,
      [дата_продажи, итоговая_сумма_сделки, условия_оплаты, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE sale (with transaction)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Start a transaction
    await db.query('BEGIN');
    
    // Get the car VIN
    const saleResult = await db.query('SELECT "vin_автомобиля" FROM "Продажа" WHERE "id_продажи" = $1', [id]);
    if (saleResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    const vinНомер = saleResult.rows[0].vin_автомобиля;
    
    // Delete all payments associated with the sale
    await db.query('DELETE FROM "Платеж" WHERE "id_продажи" = $1', [id]);
    
    // Delete the sale
    await db.query('DELETE FROM "Продажа" WHERE "id_продажи" = $1', [id]);
    
    // Update car status back to 'В наличии'
    await db.query(
      'UPDATE "Автомобиль" SET "статус_автомобиля" = $1 WHERE "vin_номер" = $2',
      ['В наличии', vinНомер]
    );
    
    await db.query('COMMIT');
    
    res.json({ message: 'Sale and related payments deleted successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 