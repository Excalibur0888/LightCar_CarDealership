const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all cars with details
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        а.*,
        м."название_модели", м."тип_кузова", м."год_начала_выпуска", м."цена_базовая",
        п."название_производителя", п."страна_производителя"
      FROM "Автомобиль" а
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      JOIN "Производитель" п ON м."id_производителя" = п."id_производителя"
    `);
    
    // Get options for each car
    for (const car of result.rows) {
      const optionsResult = await db.query(`
        SELECT о.*
        FROM "Автомобиль_Опция" ао
        JOIN "Опция" о ON ао."id_опции" = о."id_опции"
        WHERE ао."vin_номер" = $1
      `, [car.vin_номер]);
      
      car.опции = optionsResult.rows;
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET car by VIN
router.get('/:vin', async (req, res) => {
  try {
    const { vin } = req.params;
    const result = await db.query(`
      SELECT 
        а.*,
        м."название_модели", м."тип_кузова", м."год_начала_выпуска", м."цена_базовая",
        п."название_производителя", п."страна_производителя"
      FROM "Автомобиль" а
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      JOIN "Производитель" п ON м."id_производителя" = п."id_производителя"
      WHERE а."vin_номер" = $1
    `, [vin]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    const car = result.rows[0];
    
    // Get options for the car
    const optionsResult = await db.query(`
      SELECT о.*
      FROM "Автомобиль_Опция" ао
      JOIN "Опция" о ON ао."id_опции" = о."id_опции"
      WHERE ао."vin_номер" = $1
    `, [vin]);
    
    car.опции = optionsResult.rows;
    
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET cars by model ID
router.get('/model/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const result = await db.query('SELECT * FROM "Автомобиль" WHERE "id_модели" = $1', [modelId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cars by model:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new car
router.post('/', async (req, res) => {
  try {
    const { 
      vin_номер, id_модели, цвет, комплектация_описание, 
      год_выпуска, статус_автомобиля, опции 
    } = req.body;

    // Start a transaction
    await db.query('BEGIN');
    
    const carResult = await db.query(
      `INSERT INTO "Автомобиль" (
        "vin_номер", "id_модели", "цвет", "комплектация_описание", 
        "год_выпуска", "статус_автомобиля"
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [vin_номер, id_модели, цвет, комплектация_описание, год_выпуска, статус_автомобиля]
    );
    
    // Add options if provided
    if (опции && опции.length > 0) {
      for (const optionId of опции) {
        await db.query(
          'INSERT INTO "Автомобиль_Опция" ("vin_номер", "id_опции") VALUES ($1, $2)',
          [vin_номер, optionId]
        );
      }
    }
    
    await db.query('COMMIT');
    
    // Return the created car with its options
    const car = carResult.rows[0];
    
    if (опции && опции.length > 0) {
      const optionsResult = await db.query(
        'SELECT * FROM "Опция" WHERE "id_опции" IN (' + опции.map((_, i) => `$${i + 1}`).join(',') + ')',
        опции
      );
      car.опции = optionsResult.rows;
    } else {
      car.опции = [];
    }
    
    res.status(201).json(car);
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error creating car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update car
router.put('/:vin', async (req, res) => {
  try {
    const { vin } = req.params;
    const { цвет, комплектация_описание, год_выпуска, статус_автомобиля, опции } = req.body;
    
    // Start a transaction
    await db.query('BEGIN');
    
    const result = await db.query(
      `UPDATE "Автомобиль" SET 
        "цвет" = $1, 
        "комплектация_описание" = $2, 
        "год_выпуска" = $3, 
        "статус_автомобиля" = $4
      WHERE "vin_номер" = $5 RETURNING *`,
      [цвет, комплектация_описание, год_выпуска, статус_автомобиля, vin]
    );
    
    if (result.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Car not found' });
    }
    
    // Update options if provided
    if (опции !== undefined) {
      // Delete existing options
      await db.query('DELETE FROM "Автомобиль_Опция" WHERE "vin_номер" = $1', [vin]);
      
      // Add new options
      if (опции && опции.length > 0) {
        for (const optionId of опции) {
          await db.query(
            'INSERT INTO "Автомобиль_Опция" ("vin_номер", "id_опции") VALUES ($1, $2)',
            [vin, optionId]
          );
        }
      }
    }
    
    await db.query('COMMIT');
    
    // Return the updated car with its options
    const car = result.rows[0];
    
    const optionsResult = await db.query(`
      SELECT о.*
      FROM "Автомобиль_Опция" ао
      JOIN "Опция" о ON ао."id_опции" = о."id_опции"
      WHERE ао."vin_номер" = $1
    `, [vin]);
    
    car.опции = optionsResult.rows;
    
    res.json(car);
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE car
router.delete('/:vin', async (req, res) => {
  try {
    const { vin } = req.params;
    
    // Start a transaction
    await db.query('BEGIN');
    
    // Delete car options
    await db.query('DELETE FROM "Автомобиль_Опция" WHERE "vin_номер" = $1', [vin]);
    
    // Delete the car
    const result = await db.query('DELETE FROM "Автомобиль" WHERE "vin_номер" = $1 RETURNING *', [vin]);
    
    if (result.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Car not found' });
    }
    
    await db.query('COMMIT');
    
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 