# Бэкенд приложения автосалона

RESTful API для приложения автосалона, написанное на Node.js/Express с использованием PostgreSQL в качестве базы данных.

## Предварительные требования

- Node.js (версия 14 или выше)
- PostgreSQL (версия 12 или выше)

## Установка

1. Клонируйте репозиторий и перейдите в директорию проекта:

```bash
git clone <url_репозитория>
cd frontend/backend
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл .env с настройками подключения к базе данных (или измените существующий файл):

```
# Настройки сервера
PORT=5000

# Настройки подключения к базе данных PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=car_dealership
DB_USER=postgres
DB_PASSWORD=postgres

# Настройки CORS
CORS_ORIGIN=http://localhost:3000
```

4. Убедитесь, что база данных PostgreSQL настроена корректно с поддержкой UTF-8:

```sql
CREATE DATABASE car_dealership
WITH 
ENCODING = 'UTF8'
LC_COLLATE = 'ru_RU.UTF-8'
LC_CTYPE = 'ru_RU.UTF-8';
```

5. Запустите скрипты для создания и заполнения базы данных:

```bash
psql -U postgres -f setup_database.sql
```

## Запуск

### Режим разработки

```bash
npm run dev
```

### Режим production

```bash
npm start
```

## API Endpoints

### Производители (Manufacturers)
- `GET /api/manufacturers` - получить список всех производителей
- `GET /api/manufacturers/:id` - получить производителя по ID
- `POST /api/manufacturers` - создать нового производителя
- `PUT /api/manufacturers/:id` - обновить информацию о производителе
- `DELETE /api/manufacturers/:id` - удалить производителя

### Модели (Models)
- `GET /api/models` - получить список всех моделей
- `GET /api/models/:id` - получить модель по ID
- `GET /api/models/manufacturer/:manufacturerId` - получить модели определенного производителя
- `POST /api/models` - создать новую модель
- `PUT /api/models/:id` - обновить информацию о модели
- `DELETE /api/models/:id` - удалить модель

### Автомобили (Cars)
- `GET /api/cars` - получить список всех автомобилей
- `GET /api/cars/:vin` - получить автомобиль по VIN
- `GET /api/cars/model/:modelId` - получить автомобили определенной модели
- `POST /api/cars` - создать новый автомобиль
- `PUT /api/cars/:vin` - обновить информацию об автомобиле
- `DELETE /api/cars/:vin` - удалить автомобиль

### Опции (Options)
- `GET /api/options` - получить список всех опций
- `GET /api/options/:id` - получить опцию по ID
- `GET /api/options/car/:vin` - получить опции определенного автомобиля
- `POST /api/options` - создать новую опцию
- `POST /api/options/car/:vin` - добавить опцию к автомобилю
- `PUT /api/options/:id` - обновить информацию об опции
- `DELETE /api/options/:id` - удалить опцию
- `DELETE /api/options/car/:vin/:optionId` - удалить опцию у автомобиля

### Покупатели (Customers)
- `GET /api/customers` - получить список всех покупателей
- `GET /api/customers/:id` - получить покупателя по ID
- `GET /api/customers/:id/sales` - получить продажи определенного покупателя
- `GET /api/customers/:id/test-drives` - получить тест-драйвы определенного покупателя
- `POST /api/customers` - создать нового покупателя
- `PUT /api/customers/:id` - обновить информацию о покупателе
- `DELETE /api/customers/:id` - удалить покупателя

### Сотрудники (Employees)
- `GET /api/employees` - получить список всех сотрудников
- `GET /api/employees/:id` - получить сотрудника по ID
- `GET /api/employees/:id/sales` - получить продажи определенного сотрудника
- `GET /api/employees/:id/test-drives` - получить тест-драйвы определенного сотрудника
- `POST /api/employees` - создать нового сотрудника
- `PUT /api/employees/:id` - обновить информацию о сотруднике
- `DELETE /api/employees/:id` - удалить сотрудника

### Продажи (Sales)
- `GET /api/sales` - получить список всех продаж
- `GET /api/sales/:id` - получить продажу по ID
- `GET /api/sales/:id/payments` - получить платежи по определенной продаже
- `POST /api/sales` - создать новую продажу
- `PUT /api/sales/:id` - обновить информацию о продаже
- `DELETE /api/sales/:id` - удалить продажу

### Платежи (Payments)
- `GET /api/payments` - получить список всех платежей
- `GET /api/payments/:id` - получить платеж по ID
- `POST /api/payments` - создать новый платеж
- `PUT /api/payments/:id` - обновить информацию о платеже
- `DELETE /api/payments/:id` - удалить платеж

### Тест-драйвы (Test Drives)
- `GET /api/test-drives` - получить список всех тест-драйвов
- `GET /api/test-drives/:id` - получить тест-драйв по ID
- `GET /api/test-drives/car/:vin` - получить тест-драйвы определенного автомобиля
- `POST /api/test-drives` - создать новый тест-драйв
- `PUT /api/test-drives/:id` - обновить информацию о тест-драйве
- `DELETE /api/test-drives/:id` - удалить тест-драйв 