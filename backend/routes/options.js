const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all options
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Опция"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET option by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM "Опция" WHERE "id_опции" = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Option not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching option:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET options for a specific car
router.get('/car/:vin', async (req, res) => {
  try {
    const { vin } = req.params;
    const result = await db.query(`
      SELECT о.*
      FROM "Опция" о
      JOIN "Автомобиль_Опция" ао ON о."id_опции" = ао."id_опции"
      WHERE ао."vin_номер" = $1
    `, [vin]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching car options:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new option
router.post('/', async (req, res) => {
  try {
    const { id_опции, название_опции, описание_опции, цена_опции } = req.body;
    const result = await db.query(
      'INSERT INTO "Опция" ("id_опции", "название_опции", "описание_опции", "цена_опции") VALUES ($1, $2, $3, $4) RETURNING *',
      [id_опции, название_опции, описание_опции, цена_опции]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating option:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update option
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { название_опции, описание_опции, цена_опции } = req.body;
    
    const result = await db.query(
      'UPDATE "Опция" SET "название_опции" = $1, "описание_опции" = $2, "цена_опции" = $3 WHERE "id_опции" = $4 RETURNING *',
      [название_опции, описание_опции, цена_опции, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Option not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating option:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE option
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM "Опция" WHERE "id_опции" = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Option not found' });
    }
    
    res.json({ message: 'Option deleted successfully' });
  } catch (error) {
    console.error('Error deleting option:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST add option to car
router.post('/car/:vin', async (req, res) => {
  try {
    const { vin } = req.params;
    const { id_опции } = req.body;
    
    // Check if car exists
    const carCheck = await db.query('SELECT * FROM "Автомобиль" WHERE "vin_номер" = $1', [vin]);
    if (carCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    // Check if option exists
    const optionCheck = await db.query('SELECT * FROM "Опция" WHERE "id_опции" = $1', [id_опции]);
    if (optionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Option not found' });
    }
    
    // Check if relationship already exists
    const relationCheck = await db.query(
      'SELECT * FROM "Автомобиль_Опция" WHERE "vin_номер" = $1 AND "id_опции" = $2',
      [vin, id_опции]
    );
    if (relationCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Option is already added to this car' });
    }
    
    // Add option to car
    await db.query(
      'INSERT INTO "Автомобиль_Опция" ("vin_номер", "id_опции") VALUES ($1, $2)',
      [vin, id_опции]
    );
    
    res.status(201).json({ message: 'Option added to car successfully' });
  } catch (error) {
    console.error('Error adding option to car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE remove option from car
router.delete('/car/:vin/:optionId', async (req, res) => {
  try {
    const { vin, optionId } = req.params;
    
    const result = await db.query(
      'DELETE FROM "Автомобиль_Опция" WHERE "vin_номер" = $1 AND "id_опции" = $2 RETURNING *',
      [vin, optionId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Option not found for this car' });
    }
    
    res.json({ message: 'Option removed from car successfully' });
  } catch (error) {
    console.error('Error removing option from car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 