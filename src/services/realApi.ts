import axios from 'axios';
import { 
  Manufacturer, Model, Car, Option, Customer, Employee, 
  Sale, Payment, TestDrive, CarWithDetails,
  SaleWithDetails, TestDriveWithDetails, ModelWithDetails
} from '../types/types';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// API service class for real backend
class RealApiService {
  // Manufacturers
  getManufacturers = async (): Promise<Manufacturer[]> => {
    const response = await axios.get(`${API_BASE_URL}/manufacturers`);
    return response.data;
  }

  getManufacturerById = async (id: string): Promise<Manufacturer> => {
    const response = await axios.get(`${API_BASE_URL}/manufacturers/${id}`);
    return response.data;
  }

  createManufacturer = async (manufacturer: Manufacturer): Promise<Manufacturer> => {
    const response = await axios.post(`${API_BASE_URL}/manufacturers`, manufacturer);
    return response.data;
  }

  updateManufacturer = async (id: string, manufacturer: Partial<Manufacturer>): Promise<Manufacturer> => {
    const response = await axios.put(`${API_BASE_URL}/manufacturers/${id}`, manufacturer);
    return response.data;
  }

  deleteManufacturer = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/manufacturers/${id}`);
  }

  // Models
  getModels = async (): Promise<Model[]> => {
    const response = await axios.get(`${API_BASE_URL}/models`);
    return response.data;
  }

  getModelById = async (id: string): Promise<ModelWithDetails> => {
    const response = await axios.get(`${API_BASE_URL}/models/${id}`);
    return response.data;
  }

  getModelsByManufacturer = async (manufacturerId: string): Promise<Model[]> => {
    const response = await axios.get(`${API_BASE_URL}/models/manufacturer/${manufacturerId}`);
    return response.data;
  }

  createModel = async (model: Model): Promise<Model> => {
    const response = await axios.post(`${API_BASE_URL}/models`, model);
    return response.data;
  }

  updateModel = async (id: string, model: Partial<Model>): Promise<Model> => {
    const response = await axios.put(`${API_BASE_URL}/models/${id}`, model);
    return response.data;
  }

  deleteModel = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/models/${id}`);
  }

  // Cars
  getCars = async (): Promise<CarWithDetails[]> => {
    const response = await axios.get(`${API_BASE_URL}/cars`);
    return response.data;
  }

  getCarByVin = async (vin: string): Promise<CarWithDetails> => {
    const response = await axios.get(`${API_BASE_URL}/cars/${vin}`);
    return response.data;
  }

  getCarsByModel = async (modelId: string): Promise<Car[]> => {
    const response = await axios.get(`${API_BASE_URL}/cars/model/${modelId}`);
    return response.data;
  }

  createCar = async (car: Car & { опции?: string[] }): Promise<CarWithDetails> => {
    const response = await axios.post(`${API_BASE_URL}/cars`, car);
    return response.data;
  }

  updateCar = async (vin: string, car: Partial<Car> & { опции?: string[] }): Promise<CarWithDetails> => {
    const response = await axios.put(`${API_BASE_URL}/cars/${vin}`, car);
    return response.data;
  }

  deleteCar = async (vin: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/cars/${vin}`);
  }

  // Options
  getOptions = async (): Promise<Option[]> => {
    const response = await axios.get(`${API_BASE_URL}/options`);
    return response.data;
  }

  getOptionById = async (id: string): Promise<Option> => {
    const response = await axios.get(`${API_BASE_URL}/options/${id}`);
    return response.data;
  }

  getCarOptions = async (vin: string): Promise<Option[]> => {
    const response = await axios.get(`${API_BASE_URL}/options/car/${vin}`);
    return response.data;
  }

  addOptionToCar = async (vin: string, optionId: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/options/car/${vin}`, { id_опции: optionId });
  }

  removeOptionFromCar = async (vin: string, optionId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/options/car/${vin}/${optionId}`);
  }

  // Customers
  getCustomers = async (): Promise<Customer[]> => {
    const response = await axios.get(`${API_BASE_URL}/customers`);
    return response.data;
  }

  getCustomerById = async (id: string): Promise<Customer> => {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
    return response.data;
  }

  getCustomerSales = async (id: string): Promise<SaleWithDetails[]> => {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}/sales`);
    return response.data;
  }

  getCustomerTestDrives = async (id: string): Promise<TestDriveWithDetails[]> => {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}/test-drives`);
    return response.data;
  }

  // Employees
  getEmployees = async (): Promise<Employee[]> => {
    const response = await axios.get(`${API_BASE_URL}/employees`);
    return response.data;
  }

  getEmployeeById = async (id: string): Promise<Employee> => {
    const response = await axios.get(`${API_BASE_URL}/employees/${id}`);
    return response.data;
  }

  getEmployeeSales = async (id: string): Promise<SaleWithDetails[]> => {
    const response = await axios.get(`${API_BASE_URL}/employees/${id}/sales`);
    return response.data;
  }

  getEmployeeTestDrives = async (id: string): Promise<TestDriveWithDetails[]> => {
    const response = await axios.get(`${API_BASE_URL}/employees/${id}/test-drives`);
    return response.data;
  }

  // Sales
  getSales = async (): Promise<SaleWithDetails[]> => {
    const response = await axios.get(`${API_BASE_URL}/sales`);
    return response.data;
  }

  getSaleById = async (id: string): Promise<SaleWithDetails> => {
    const response = await axios.get(`${API_BASE_URL}/sales/${id}`);
    return response.data;
  }

  getSalePayments = async (id: string): Promise<Payment[]> => {
    const response = await axios.get(`${API_BASE_URL}/sales/${id}/payments`);
    return response.data;
  }

  createSale = async (sale: Sale & { платежи?: Payment[] }): Promise<SaleWithDetails> => {
    const response = await axios.post(`${API_BASE_URL}/sales`, sale);
    return response.data;
  }

  // Payments
  getPayments = async (): Promise<Payment[]> => {
    const response = await axios.get(`${API_BASE_URL}/payments`);
    return response.data;
  }

  getPaymentById = async (id: string): Promise<Payment> => {
    const response = await axios.get(`${API_BASE_URL}/payments/${id}`);
    return response.data;
  }

  createPayment = async (payment: Payment): Promise<Payment> => {
    const response = await axios.post(`${API_BASE_URL}/payments`, payment);
    return response.data;
  }

  // Test Drives
  getTestDrives = async (): Promise<TestDriveWithDetails[]> => {
    const response = await axios.get(`${API_BASE_URL}/test-drives`);
    return response.data;
  }

  getTestDriveById = async (id: string): Promise<TestDriveWithDetails> => {
    const response = await axios.get(`${API_BASE_URL}/test-drives/${id}`);
    return response.data;
  }

  getCarTestDrives = async (vin: string): Promise<TestDriveWithDetails[]> => {
    const response = await axios.get(`${API_BASE_URL}/test-drives/car/${vin}`);
    return response.data;
  }

  createTestDrive = async (testDrive: TestDrive): Promise<TestDriveWithDetails> => {
    const response = await axios.post(`${API_BASE_URL}/test-drives`, testDrive);
    return response.data;
  }
}

export default new RealApiService(); 