const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all test drives with details
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        т.*,
        к."фио_покупателя", к."тип_покупателя", к."контактный_телефон", 
        а."цвет", а."комплектация_описание", а."год_выпуска",
        м."название_модели", м."тип_кузова",
        пр."название_производителя",
        с."фио_сотрудника", с."должность"
      FROM "Тест_драйв" т
      JOIN "Покупатель" к ON т."id_покупателя" = к."id_покупателя"
      JOIN "Автомобиль" а ON т."vin_автомобиля" = а."vin_номер"
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      JOIN "Производитель" пр ON м."id_производителя" = пр."id_производителя"
      JOIN "Сотрудник" с ON т."id_сотрудника" = с."id_сотрудника"
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching test drives:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET test drive by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        т.*,
        к."фио_покупателя", к."тип_покупателя", к."контактный_телефон", 
        а."цвет", а."комплектация_описание", а."год_выпуска",
        м."название_модели", м."тип_кузова",
        пр."название_производителя",
        с."фио_сотрудника", с."должность"
      FROM "Тест_драйв" т
      JOIN "Покупатель" к ON т."id_покупателя" = к."id_покупателя"
      JOIN "Автомобиль" а ON т."vin_автомобиля" = а."vin_номер"
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      JOIN "Производитель" пр ON м."id_производителя" = пр."id_производителя"
      JOIN "Сотрудник" с ON т."id_сотрудника" = с."id_сотрудника"
      WHERE т."id_тест_драйва" = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test drive not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching test drive:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET test drives by car VIN
router.get('/car/:vin', async (req, res) => {
  try {
    const { vin } = req.params;
    const result = await db.query(`
      SELECT 
        т.*,
        к."фио_покупателя",
        с."фио_сотрудника"
      FROM "Тест_драйв" т
      JOIN "Покупатель" к ON т."id_покупателя" = к."id_покупателя"
      JOIN "Сотрудник" с ON т."id_сотрудника" = с."id_сотрудника"
      WHERE т."vin_автомобиля" = $1
    `, [vin]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching test drives by car:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new test drive (with transaction)
router.post('/', async (req, res) => {
  try {
    const { 
      id_тест_драйва, id_покупателя, vin_автомобиля, id_сотрудника,
      дата_время_начала_тест_драйва, дата_время_окончания_тест_драйва,
      маршрут_тест_драйва, комментарии_по_тест_драйву
    } = req.body;
    
    // Start a transaction
    await db.query('BEGIN');
    
    // Check if the car is available
    const carCheck = await db.query(
      'SELECT "статус_автомобиля" FROM "Автомобиль" WHERE "vin_номер" = $1',
      [vin_автомобиля]
    );
    
    if (carCheck.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Car not found' });
    }
    
    if (carCheck.rows[0].статус_автомобиля === 'Продан') {
      await db.query('ROLLBACK');
      return res.status(400).json({ error: 'Car is already sold and not available for test drive' });
    }
    
    // Create the test drive
    const result = await db.query(
      `INSERT INTO "Тест_драйв" (
        "id_тест_драйва", "id_покупателя", "vin_автомобиля", "id_сотрудника",
        "дата_время_начала_тест_драйва", "дата_время_окончания_тест_драйва",
        "маршрут_тест_драйва", "комментарии_по_тест_драйву"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        id_тест_драйва, id_покупателя, vin_автомобиля, id_сотрудника,
        дата_время_начала_тест_драйва, дата_время_окончания_тест_драйва,
        маршрут_тест_драйва, комментарии_по_тест_драйву
      ]
    );
    
    // Update car status to 'На тест-драйве' if the test drive is current/upcoming
    const now = new Date();
    const testDriveEnd = new Date(дата_время_окончания_тест_драйва);
    
    if (testDriveEnd > now) {
      await db.query(
        'UPDATE "Автомобиль" SET "статус_автомобиля" = $1 WHERE "vin_номер" = $2',
        ['На тест-драйве', vin_автомобиля]
      );
    }
    
    await db.query('COMMIT');
    
    // Return the created test drive with additional details
    const detailedTestDriveResult = await db.query(`
      SELECT 
        т.*,
        к."фио_покупателя",
        а."цвет", а."год_выпуска",
        м."название_модели",
        с."фио_сотрудника"
      FROM "Тест_драйв" т
      JOIN "Покупатель" к ON т."id_покупателя" = к."id_покупателя"
      JOIN "Автомобиль" а ON т."vin_автомобиля" = а."vin_номер"
      JOIN "Модель" м ON а."id_модели" = м."id_модели"
      JOIN "Сотрудник" с ON т."id_сотрудника" = с."id_сотрудника"
      WHERE т."id_тест_драйва" = $1
    `, [id_тест_драйва]);
    
    res.status(201).json(detailedTestDriveResult.rows[0]);
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error creating test drive:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update test drive
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      дата_время_начала_тест_драйва, дата_время_окончания_тест_драйва,
      маршрут_тест_драйва, комментарии_по_тест_драйву
    } = req.body;
    
    const result = await db.query(
      `UPDATE "Тест_драйв" SET 
        "дата_время_начала_тест_драйва" = $1, 
        "дата_время_окончания_тест_драйва" = $2, 
        "маршрут_тест_драйва" = $3,
        "комментарии_по_тест_драйву" = $4
      WHERE "id_тест_драйва" = $5 RETURNING *`,
      [дата_время_начала_тест_драйва, дата_время_окончания_тест_драйва, маршрут_тест_драйва, комментарии_по_тест_драйву, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test drive not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating test drive:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE test drive (with transaction)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Start a transaction
    await db.query('BEGIN');
    
    // Get the test drive info
    const testDriveResult = await db.query(
      'SELECT * FROM "Тест_драйв" WHERE "id_тест_драйва" = $1',
      [id]
    );
    
    if (testDriveResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Test drive not found' });
    }
    
    const testDrive = testDriveResult.rows[0];
    const vin = testDrive.vin_автомобиля;
    
    // Delete the test drive
    await db.query('DELETE FROM "Тест_драйв" WHERE "id_тест_драйва" = $1', [id]);
    
    // Check if there are any other active test drives for this car
    const now = new Date();
    const otherTestDrives = await db.query(
      'SELECT * FROM "Тест_драйв" WHERE "vin_автомобиля" = $1 AND "дата_время_окончания_тест_драйва" > $2',
      [vin, now]
    );
    
    // If no other active test drives, update car status to 'В наличии'
    if (otherTestDrives.rows.length === 0) {
      await db.query(
        'UPDATE "Автомобиль" SET "статус_автомобиля" = $1 WHERE "vin_номер" = $2 AND "статус_автомобиля" = $3',
        ['В наличии', vin, 'На тест-драйве']
      );
    }
    
    await db.query('COMMIT');
    
    res.json({ message: 'Test drive deleted successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error deleting test drive:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;