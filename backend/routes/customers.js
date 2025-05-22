const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Покупатель"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM "Покупатель" WHERE "id_покупателя" = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET purchases by customer
router.get('/:id/sales', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        п.*,
        к."фио_покупателя",
        а."vin_номер", а."цвет", а."комплектация_описание", а."год_выпуска",
        м."название_модели", м."тип_кузова",
        пр."название_производителя"
      FROM "Продажа" п
      JOIN "Покупатель" к ON п."id_покупателя" = к."id_покупателя"
      JOIN "Автомобиль" а ON п."vin_автомобиля" = а."vin_номер"
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      JOIN "Производитель" пр ON м."id_производителя" = пр."id_производителя"
      WHERE п."id_покупателя" = $1
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customer purchases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET test drives by customer
router.get('/:id/test-drives', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        т.*,
        к."фио_покупателя",
        а."vin_номер", а."цвет", а."комплектация_описание", а."год_выпуска",
        м."название_модели", м."тип_кузова",
        пр."название_производителя"
      FROM "Тест_драйв" т
      JOIN "Покупатель" к ON т."id_покупателя" = к."id_покупателя"
      JOIN "Автомобиль" а ON т."vin_автомобиля" = а."vin_номер"
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      JOIN "Производитель" пр ON м."id_производителя" = пр."id_производителя"
      WHERE т."id_покупателя" = $1
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customer test drives:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new customer
router.post('/', async (req, res) => {
  try {
    const { 
      id_покупателя, фио_покупателя, тип_покупателя, 
      контактный_телефон, email_покупателя, адрес_покупателя 
    } = req.body;
    
    const result = await db.query(
      `INSERT INTO "Покупатель" (
        "id_покупателя", "фио_покупателя", "тип_покупателя", 
        "контактный_телефон", "email_покупателя", "адрес_покупателя"
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_покупателя, фио_покупателя, тип_покупателя, контактный_телефон, email_покупателя, адрес_покупателя]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      фио_покупателя, тип_покупателя, 
      контактный_телефон, email_покупателя, адрес_покупателя 
    } = req.body;
    
    const result = await db.query(
      `UPDATE "Покупатель" SET 
        "фио_покупателя" = $1, 
        "тип_покупателя" = $2, 
        "контактный_телефон" = $3, 
        "email_покупателя" = $4, 
        "адрес_покупателя" = $5
      WHERE "id_покупателя" = $6 RETURNING *`,
      [фио_покупателя, тип_покупателя, контактный_телефон, email_покупателя, адрес_покупателя, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM "Покупатель" WHERE "id_покупателя" = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;