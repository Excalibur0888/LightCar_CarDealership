import axios from 'axios';
import { 
  Manufacturer, Model, Car, Option, Customer, Employee, 
  Sale, Payment, TestDrive, CarOption, CarWithDetails,
  SaleWithDetails, TestDriveWithDetails, ModelWithDetails
} from '../types/types';

// Mock data - in a real application this would come from a backend API
const mockManufacturers: Manufacturer[] = [
  { 
    id_производителя: 'MF001', 
    название_производителя: 'BMW', 
    страна_производителя: 'Германия' 
  },
  { 
    id_производителя: 'MF002', 
    название_производителя: 'Toyota', 
    страна_производителя: 'Япония' 
  },
  { 
    id_производителя: 'MF003', 
    название_производителя: 'Mercedes-Benz', 
    страна_производителя: 'Германия' 
  },
];

const mockModels: Model[] = [
  { 
    id_модели: 'MD001', 
    id_производителя: 'MF001', 
    название_модели: 'X5', 
    тип_кузова: 'SUV', 
    год_начала_выпуска: 2018, 
    цена_базовая: 4500000 
  },
  { 
    id_модели: 'MD002', 
    id_производителя: 'MF002', 
    название_модели: 'Camry', 
    тип_кузова: 'Седан', 
    год_начала_выпуска: 2017, 
    цена_базовая: 2200000 
  },
  { 
    id_модели: 'MD003', 
    id_производителя: 'MF003', 
    название_модели: 'E-Class', 
    тип_кузова: 'Седан', 
    год_начала_выпуска: 2019, 
    цена_базовая: 4000000 
  },
];

const mockCars: Car[] = [
  { 
    vin_номер: 'VIN12345678901234A', 
    id_модели: 'MD001', 
    цвет: 'Черный', 
    комплектация_описание: 'Люкс', 
    год_выпуска: 2021, 
    статус_автомобиля: 'В наличии' 
  },
  { 
    vin_номер: 'VIN12345678901234B', 
    id_модели: 'MD002', 
    цвет: 'Белый', 
    комплектация_описание: 'Стандарт', 
    год_выпуска: 2020, 
    статус_автомобиля: 'В наличии' 
  },
  { 
    vin_номер: 'VIN12345678901234C', 
    id_модели: 'MD003', 
    цвет: 'Серебристый', 
    комплектация_описание: 'Премиум', 
    год_выпуска: 2022, 
    статус_автомобиля: 'На тест-драйве' 
  },
];

const mockOptions: Option[] = [
  { 
    id_опции: 'OP001', 
    название_опции: 'Кожаный салон', 
    описание_опции: 'Премиум кожа для сидений и элементов интерьера', 
    цена_опции: 150000 
  },
  { 
    id_опции: 'OP002', 
    название_опции: 'Панорамная крыша', 
    описание_опции: 'Стеклянная панорамная крыша с электроприводом', 
    цена_опции: 200000 
  },
  { 
    id_опции: 'OP003', 
    название_опции: 'Навигационная система', 
    описание_опции: 'Встроенная навигация с 3D-картами', 
    цена_опции: 100000 
  },
];

const mockCarOptions: CarOption[] = [
  { vin_номер: 'VIN12345678901234A', id_опции: 'OP001' },
  { vin_номер: 'VIN12345678901234A', id_опции: 'OP002' },
  { vin_номер: 'VIN12345678901234B', id_опции: 'OP003' },
  { vin_номер: 'VIN12345678901234C', id_опции: 'OP001' },
  { vin_номер: 'VIN12345678901234C', id_опции: 'OP002' },
  { vin_номер: 'VIN12345678901234C', id_опции: 'OP003' },
];

const mockCustomers: Customer[] = [
  { 
    id_покупателя: 'CU001', 
    фио_покупателя: 'Иванов Иван Иванович', 
    тип_покупателя: 'Физическое лицо', 
    контактный_телефон: '+7 (999) 123-45-67', 
    email_покупателя: 'ivanov@example.com', 
    адрес_покупателя: 'г. Москва, ул. Ленина, д. 10, кв. 5' 
  },
  { 
    id_покупателя: 'CU002', 
    фио_покупателя: 'ООО "Технологии будущего"', 
    тип_покупателя: 'Юридическое лицо', 
    контактный_телефон: '+7 (495) 987-65-43', 
    email_покупателя: 'info@techfuture.ru', 
    адрес_покупателя: 'г. Москва, проспект Мира, д. 102, офис 501' 
  },
];

const mockEmployees: Employee[] = [
  { 
    id_сотрудника: 'EM001', 
    фио_сотрудника: 'Петров Петр Петрович', 
    должность: 'Менеджер по продажам', 
    контактный_телефон: '+7 (999) 111-22-33', 
    email_сотрудника: 'petrov@autosale.ru' 
  },
  { 
    id_сотрудника: 'EM002', 
    фио_сотрудника: 'Сидорова Анна Владимировна', 
    должность: 'Администратор', 
    контактный_телефон: '+7 (999) 444-55-66', 
    email_сотрудника: 'sidorova@autosale.ru' 
  },
];

const mockSales: Sale[] = [
  { 
    id_продажи: 'SL001', 
    id_покупателя: 'CU001', 
    vin_автомобиля: 'VIN12345678901234B', 
    id_сотрудника: 'EM001', 
    дата_продажи: '2023-10-15', 
    итоговая_сумма_сделки: 2300000, 
    условия_оплаты: 'Кредит' 
  },
];

const mockPayments: Payment[] = [
  { 
    id_платежа: 'PY001', 
    id_продажи: 'SL001', 
    дата_платежа: '2023-10-15', 
    сумма_платежа: 500000, 
    способ_оплаты: 'Наличные', 
    статус_платежа: 'Оплачено' 
  },
  { 
    id_платежа: 'PY002', 
    id_продажи: 'SL001', 
    дата_платежа: '2023-11-15', 
    сумма_платежа: 150000, 
    способ_оплаты: 'Банковский перевод', 
    статус_платежа: 'Оплачено' 
  },
];

const mockTestDrives: TestDrive[] = [
  { 
    id_тест_драйва: 'TD001', 
    id_покупателя: 'CU002', 
    vin_автомобиля: 'VIN12345678901234C', 
    id_сотрудника: 'EM001', 
    дата_время_начала_тест_драйва: '2023-11-20T10:00:00', 
    дата_время_окончания_тест_драйва: '2023-11-20T11:00:00', 
    маршрут_тест_драйва: 'Городской цикл + шоссе', 
    комментарии_по_тест_драйву: 'Клиент заинтересован в покупке' 
  },
];

// Helper function to get car with all details
const getCarWithDetails = (car: Car): CarWithDetails => {
  const model = mockModels.find(m => m.id_модели === car.id_модели);
  const manufacturer = model ? mockManufacturers.find(mf => mf.id_производителя === model.id_производителя) : undefined;
  const carOptions = mockCarOptions.filter(co => co.vin_номер === car.vin_номер);
  const options = carOptions.map(co => mockOptions.find(o => o.id_опции === co.id_опции)).filter(Boolean) as Option[];
  
  return {
    ...car,
    модель: model,
    производитель: manufacturer,
    опции: options
  };
};

// API service class
class ApiService {
  // Manufacturers
  getManufacturers = async (): Promise<Manufacturer[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockManufacturers];
  }

  getManufacturerById = async (id: string): Promise<Manufacturer> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const manufacturer = mockManufacturers.find(m => m.id_производителя === id);
    if (!manufacturer) throw new Error('Производитель не найден');
    return {...manufacturer};
  }

  // Models
  getModels = async (): Promise<Model[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockModels];
  }

  getModelById = async (id: string): Promise<ModelWithDetails> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const model = mockModels.find(m => m.id_модели === id);
    if (!model) throw new Error('Модель не найдена');
    
    const manufacturer = mockManufacturers.find(mf => mf.id_производителя === model.id_производителя);
    
    return {
      ...model,
      производитель: manufacturer
    };
  }

  // Cars
  getCars = async (): Promise<CarWithDetails[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCars.map(car => getCarWithDetails(car));
  }

  getCarByVin = async (vin: string): Promise<CarWithDetails> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const car = mockCars.find(c => c.vin_номер === vin);
    if (!car) throw new Error('Автомобиль не найден');
    
    return getCarWithDetails(car);
  }

  // Customers
  getCustomers = async (): Promise<Customer[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockCustomers];
  }

  // Employees
  getEmployees = async (): Promise<Employee[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockEmployees];
  }

  // Sales
  getSales = async (): Promise<SaleWithDetails[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSales.map(sale => {
      const customer = mockCustomers.find(c => c.id_покупателя === sale.id_покупателя);
      const car = mockCars.find(c => c.vin_номер === sale.vin_автомобиля);
      const employee = mockEmployees.find(e => e.id_сотрудника === sale.id_сотрудника);
      const payments = mockPayments.filter(p => p.id_продажи === sale.id_продажи);
      
      return {
        ...sale,
        покупатель: customer,
        автомобиль: car ? getCarWithDetails(car) : undefined,
        сотрудник: employee,
        платежи: payments
      };
    });
  }

  // Payments
  getPayments = async (): Promise<Payment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockPayments];
  }

  // Test Drives
  getTestDrives = async (): Promise<TestDriveWithDetails[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTestDrives.map(testDrive => {
      const customer = mockCustomers.find(c => c.id_покупателя === testDrive.id_покупателя);
      const car = mockCars.find(c => c.vin_номер === testDrive.vin_автомобиля);
      const employee = mockEmployees.find(e => e.id_сотрудника === testDrive.id_сотрудника);
      
      return {
        ...testDrive,
        покупатель: customer,
        автомобиль: car ? getCarWithDetails(car) : undefined,
        сотрудник: employee
      };
    });
  }
}

export default new ApiService(); 