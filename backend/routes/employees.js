const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Сотрудник"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET employee by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM "Сотрудник" WHERE "id_сотрудника" = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET sales by employee
router.get('/:id/sales', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        п.*,
        с."фио_сотрудника", с."должность",
        к."фио_покупателя",
        а."vin_номер", а."цвет", а."год_выпуска",
        м."название_модели"
      FROM "Продажа" п
      JOIN "Сотрудник" с ON п."id_сотрудника" = с."id_сотрудника"
      JOIN "Покупатель" к ON п."id_покупателя" = к."id_покупателя"
      JOIN "Автомобиль" а ON п."vin_автомобиля" = а."vin_номер"
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      WHERE п."id_сотрудника" = $1
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employee sales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET test drives by employee
router.get('/:id/test-drives', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        т.*,
        с."фио_сотрудника", с."должность",
        к."фио_покупателя",
        а."vin_номер", а."цвет", а."год_выпуска",
        м."название_модели"
      FROM "Тест_драйв" т
      JOIN "Сотрудник" с ON т."id_сотрудника" = с."id_сотрудника"
      JOIN "Покупатель" к ON т."id_покупателя" = к."id_покупателя"
      JOIN "Автомобиль" а ON т."vin_автомобиля" = а."vin_номер"
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      WHERE т."id_сотрудника" = $1
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employee test drives:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new employee
router.post('/', async (req, res) => {
  try {
    const { 
      id_сотрудника, фио_сотрудника, должность, 
      контактный_телефон, email_сотрудника 
    } = req.body;
    
    const result = await db.query(
      `INSERT INTO "Сотрудник" (
        "id_сотрудника", "фио_сотрудника", "должность", 
        "контактный_телефон", "email_сотрудника"
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_сотрудника, фио_сотрудника, должность, контактный_телефон, email_сотрудника]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { фио_сотрудника, должность, контактный_телефон, email_сотрудника } = req.body;
    
    const result = await db.query(
      `UPDATE "Сотрудник" SET 
        "фио_сотрудника" = $1, 
        "должность" = $2, 
        "контактный_телефон" = $3, 
        "email_сотрудника" = $4
      WHERE "id_сотрудника" = $5 RETURNING *`,
      [фио_сотрудника, должность, контактный_телефон, email_сотрудника, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM "Сотрудник" WHERE "id_сотрудника" = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 