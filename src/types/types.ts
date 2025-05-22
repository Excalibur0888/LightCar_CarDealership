// TypeScript interfaces for our database entities

export interface Manufacturer {
  id_производителя: string;
  название_производителя: string;
  страна_производителя: string;
}

export interface Model {
  id_модели: string;
  id_производителя: string;
  название_модели: string;
  тип_кузова: string;
  год_начала_выпуска: number;
  цена_базовая: number;
}

export interface Car {
  vin_номер: string;
  id_модели: string;
  цвет: string;
  комплектация_описание: string;
  год_выпуска: number;
  статус_автомобиля: string;
}

export interface Option {
  id_опции: string;
  название_опции: string;
  описание_опции: string;
  цена_опции: number;
}

export interface Customer {
  id_покупателя: string;
  фио_покупателя: string;
  тип_покупателя: string;
  контактный_телефон: string;
  email_покупателя: string;
  адрес_покупателя: string;
}

export interface Employee {
  id_сотрудника: string;
  фио_сотрудника: string;
  должность: string;
  контактный_телефон: string;
  email_сотрудника: string;
}

export interface Sale {
  id_продажи: string;
  id_покупателя: string;
  vin_автомобиля: string;
  id_сотрудника: string;
  дата_продажи: string; // ISO date string
  итоговая_сумма_сделки: number;
  условия_оплаты: string;
}

export interface Payment {
  id_платежа: string;
  id_продажи: string;
  дата_платежа: string; // ISO date string
  сумма_платежа: number;
  способ_оплаты: string;
  статус_платежа: string;
}

export interface TestDrive {
  id_тест_драйва: string;
  id_покупателя: string;
  vin_автомобиля: string;
  id_сотрудника: string;
  дата_время_начала_тест_драйва: string; // ISO datetime string
  дата_время_окончания_тест_драйва: string; // ISO datetime string
  маршрут_тест_драйва: string;
  комментарии_по_тест_драйву: string;
}

export interface CarOption {
  vin_номер: string;
  id_опции: string;
}

// Enhanced models with additional data from relationships

export interface CarWithDetails extends Car {
  модель?: Model;
  производитель?: Manufacturer;
  опции?: Option[];
  название_модели?: string;
  тип_кузова?: string;
  год_начала_выпуска?: number;
  цена_базовая?: number;
  название_производителя?: string;
  страна_производителя?: string;
}

export interface ModelWithDetails extends Model {
  производитель?: Manufacturer;
}

export interface SaleWithDetails extends Sale {
  покупатель?: Customer;
  автомобиль?: CarWithDetails;
  сотрудник?: Employee;
  платежи?: Payment[];
  фио_покупателя?: string;
  название_модели?: string;
  название_производителя?: string;
}

export interface TestDriveWithDetails extends TestDrive {
  покупатель?: Customer;
  автомобиль?: CarWithDetails;
  сотрудник?: Employee;
  фио_покупателя?: string;
  название_модели?: string;
  название_производителя?: string;
} 