const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all manufacturers
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Производитель"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET manufacturer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM "Производитель" WHERE "id_производителя" = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Manufacturer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching manufacturer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new manufacturer
router.post('/', async (req, res) => {
  try {
    const { id_производителя, название_производителя, страна_производителя } = req.body;
    const result = await db.query(
      'INSERT INTO "Производитель" ("id_производителя", "название_производителя", "страна_производителя") VALUES ($1, $2, $3) RETURNING *',
      [id_производителя, название_производителя, страна_производителя]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating manufacturer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update manufacturer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { название_производителя, страна_производителя } = req.body;
    
    const result = await db.query(
      'UPDATE "Производитель" SET "название_производителя" = $1, "страна_производителя" = $2 WHERE "id_производителя" = $3 RETURNING *',
      [название_производителя, страна_производителя, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Manufacturer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating manufacturer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE manufacturer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM "Производитель" WHERE "id_производителя" = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Manufacturer not found' });
    }
    
    res.json({ message: 'Manufacturer deleted successfully' });
  } catch (error) {
    console.error('Error deleting manufacturer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 