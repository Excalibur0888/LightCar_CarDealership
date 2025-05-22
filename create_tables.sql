-- PostgreSQL Database creation script for Car Dealership
-- Drop tables if they exist (in reverse order due to foreign key constraints)
DROP TABLE IF EXISTS "Автомобиль_Опция";
DROP TABLE IF EXISTS "Тест_драйв";
DROP TABLE IF EXISTS "Платеж";
DROP TABLE IF EXISTS "Продажа";
DROP TABLE IF EXISTS "Сотрудник";
DROP TABLE IF EXISTS "Покупатель";
DROP TABLE IF EXISTS "Опция";
DROP TABLE IF EXISTS "Автомобиль";
DROP TABLE IF EXISTS "Модель";
DROP TABLE IF EXISTS "Производитель";

-- Create Tables
CREATE TABLE "Производитель" (
    "id_производителя" VARCHAR(50) PRIMARY KEY,
    "название_производителя" VARCHAR(100) NOT NULL,
    "страна_производителя" VARCHAR(50) NOT NULL
);

CREATE TABLE "Модель" (
    "id_модели" VARCHAR(50) PRIMARY KEY,
    "id_производителя" VARCHAR(50) NOT NULL,
    "название_модели" VARCHAR(100) NOT NULL,
    "тип_кузова" VARCHAR(50) NOT NULL,
    "год_начала_выпуска" INTEGER NOT NULL,
    "цена_базовая" DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY ("id_производителя") REFERENCES "Производитель"("id_производителя")
);

CREATE TABLE "Автомобиль" (
    "vin_номер" VARCHAR(17) PRIMARY KEY,
    "id_модели" VARCHAR(50) NOT NULL,
    "цвет" VARCHAR(50) NOT NULL,
    "комплектация_описание" TEXT NOT NULL,
    "год_выпуска" INTEGER NOT NULL,
    "статус_автомобиля" VARCHAR(50) NOT NULL,
    FOREIGN KEY ("id_модели") REFERENCES "Модель"("id_модели")
);

CREATE TABLE "Опция" (
    "id_опции" VARCHAR(50) PRIMARY KEY,
    "название_опции" VARCHAR(100) NOT NULL,
    "описание_опции" TEXT NOT NULL,
    "цена_опции" DECIMAL(10, 2) NOT NULL
);

CREATE TABLE "Покупатель" (
    "id_покупателя" VARCHAR(50) PRIMARY KEY,
    "фио_покупателя" VARCHAR(200) NOT NULL,
    "тип_покупателя" VARCHAR(50) NOT NULL,
    "контактный_телефон" VARCHAR(20) NOT NULL,
    "email_покупателя" VARCHAR(100) NOT NULL,
    "адрес_покупателя" TEXT NOT NULL
);

CREATE TABLE "Сотрудник" (
    "id_сотрудника" VARCHAR(50) PRIMARY KEY,
    "фио_сотрудника" VARCHAR(200) NOT NULL,
    "должность" VARCHAR(100) NOT NULL,
    "контактный_телефон" VARCHAR(20) NOT NULL,
    "email_сотрудника" VARCHAR(100) NOT NULL
);

CREATE TABLE "Продажа" (
    "id_продажи" VARCHAR(50) PRIMARY KEY,
    "id_покупателя" VARCHAR(50) NOT NULL,
    "vin_автомобиля" VARCHAR(17) NOT NULL,
    "id_сотрудника" VARCHAR(50) NOT NULL,
    "дата_продажи" DATE NOT NULL,
    "итоговая_сумма_сделки" DECIMAL(15, 2) NOT NULL,
    "условия_оплаты" VARCHAR(100) NOT NULL,
    FOREIGN KEY ("id_покупателя") REFERENCES "Покупатель"("id_покупателя"),
    FOREIGN KEY ("vin_автомобиля") REFERENCES "Автомобиль"("vin_номер"),
    FOREIGN KEY ("id_сотрудника") REFERENCES "Сотрудник"("id_сотрудника")
);

CREATE TABLE "Платеж" (
    "id_платежа" VARCHAR(50) PRIMARY KEY,
    "id_продажи" VARCHAR(50) NOT NULL,
    "дата_платежа" DATE NOT NULL,
    "сумма_платежа" DECIMAL(15, 2) NOT NULL,
    "способ_оплаты" VARCHAR(50) NOT NULL,
    "статус_платежа" VARCHAR(50) NOT NULL,
    FOREIGN KEY ("id_продажи") REFERENCES "Продажа"("id_продажи")
);

CREATE TABLE "Тест_драйв" (
    "id_тест_драйва" VARCHAR(50) PRIMARY KEY,
    "id_покупателя" VARCHAR(50) NOT NULL,
    "vin_автомобиля" VARCHAR(17) NOT NULL,
    "id_сотрудника" VARCHAR(50) NOT NULL,
    "дата_время_начала_тест_драйва" TIMESTAMP NOT NULL,
    "дата_время_окончания_тест_драйва" TIMESTAMP NOT NULL,
    "маршрут_тест_драйва" TEXT,
    "комментарии_по_тест_драйву" TEXT,
    FOREIGN KEY ("id_покупателя") REFERENCES "Покупатель"("id_покупателя"),
    FOREIGN KEY ("vin_автомобиля") REFERENCES "Автомобиль"("vin_номер"),
    FOREIGN KEY ("id_сотрудника") REFERENCES "Сотрудник"("id_сотрудника")
);

CREATE TABLE "Автомобиль_Опция" (
    "vin_номер" VARCHAR(17),
    "id_опции" VARCHAR(50),
    PRIMARY KEY ("vin_номер", "id_опции"),
    FOREIGN KEY ("vin_номер") REFERENCES "Автомобиль"("vin_номер"),
    FOREIGN KEY ("id_опции") REFERENCES "Опция"("id_опции")
); 