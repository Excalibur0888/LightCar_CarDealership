const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all models
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT м.*, п."название_производителя", п."страна_производителя"
      FROM "Модель" м
      JOIN "Производитель" п ON м."id_производителя" = п."id_производителя"
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET model by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT м.*, п."название_производителя", п."страна_производителя"
      FROM "Модель" м
      JOIN "Производитель" п ON м."id_производителя" = п."id_производителя"
      WHERE м."id_модели" = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching model:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET models by manufacturer
router.get('/manufacturer/:manufacturerId', async (req, res) => {
  try {
    const { manufacturerId } = req.params;
    const result = await db.query('SELECT * FROM "Модель" WHERE "id_производителя" = $1', [manufacturerId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching models by manufacturer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new model
router.post('/', async (req, res) => {
  try {
    const { id_модели, id_производителя, название_модели, тип_кузова, год_начала_выпуска, цена_базовая } = req.body;
    const result = await db.query(
      `INSERT INTO "Модель" (
        "id_модели", "id_производителя", "название_модели", "тип_кузова", 
        "год_начала_выпуска", "цена_базовая"
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_модели, id_производителя, название_модели, тип_кузова, год_начала_выпуска, цена_базовая]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating model:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update model
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { название_модели, тип_кузова, год_начала_выпуска, цена_базовая } = req.body;
    
    const result = await db.query(
      `UPDATE "Модель" SET 
        "название_модели" = $1, 
        "тип_кузова" = $2, 
        "год_начала_выпуска" = $3, 
        "цена_базовая" = $4
      WHERE "id_модели" = $5 RETURNING *`,
      [название_модели, тип_кузова, год_начала_выпуска, цена_базовая, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating model:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE model
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM "Модель" WHERE "id_модели" = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }
    
    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    console.error('Error deleting model:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 