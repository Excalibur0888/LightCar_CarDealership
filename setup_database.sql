-- Create database with UTF-8 encoding
DROP DATABASE IF EXISTS car_dealership;
CREATE DATABASE car_dealership
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'ru_RU.UTF-8'
    LC_CTYPE = 'ru_RU.UTF-8'
    TEMPLATE = template0;

\c car_dealership

-- Set client encoding to UTF-8
SET client_encoding = 'UTF8';

-- Now include the table creation and data population scripts
\i create_tables.sql
\i populate_data.sql

-- Verify data was inserted correctly
SELECT COUNT(*) AS "Производителей" FROM "Производитель";
SELECT COUNT(*) AS "Моделей" FROM "Модель";
SELECT COUNT(*) AS "Автомобилей" FROM "Автомобиль";
SELECT COUNT(*) AS "Опций" FROM "Опция";
SELECT COUNT(*) AS "Покупателей" FROM "Покупатель";
SELECT COUNT(*) AS "Сотрудников" FROM "Сотрудник";
SELECT COUNT(*) AS "Продаж" FROM "Продажа";
SELECT COUNT(*) AS "Платежей" FROM "Платеж";
SELECT COUNT(*) AS "Тест-драйвов" FROM "Тест_драйв";
SELECT COUNT(*) AS "Автомобиль-Опция связей" FROM "Автомобиль_Опция";

-- Show a sample join query that demonstrates relationships
SELECT 
    п."название_производителя" AS "Производитель",
    м."название_модели" AS "Модель",
    а."vin_номер" AS "VIN",
    а."цвет" AS "Цвет",
    а."год_выпуска" AS "Год выпуска",
    а."статус_автомобиля" AS "Статус"
FROM "Автомобиль" а
JOIN "Модель" м ON а."id_модели" = м."id_модели"
JOIN "Производитель" п ON м."id_производителя" = п."id_производителя"
LIMIT 10; 