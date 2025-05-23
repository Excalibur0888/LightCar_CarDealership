import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Card, CardContent, Grid, Chip, Button, 
  TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PageHeader from '../components/PageHeader';
import FormModal from '../components/FormModal';
import apiService from '../services/apiConfig';
import { TestDriveWithDetails, Car, Customer, Employee, CarWithDetails } from '../types/types';

// Helper functions to format dates
const formatDateTime = (dateTimeStr: string) => {
  try {
    const date = new Date(dateTimeStr);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
  } catch (e) {
    return dateTimeStr;
  }
};

const formatTimeOnly = (dateTimeStr: string) => {
  try {
    const date = new Date(dateTimeStr);
    return format(date, 'HH:mm', { locale: ru });
  } catch (e) {
    return dateTimeStr;
  }
};

const formatDuration = (startDateTime: string, endDateTime: string) => {
  try {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    return `${durationMinutes} мин.`;
  } catch (e) {
    return 'Н/Д';
  }
};

const TestDriveCard: React.FC<{ testDrive: TestDriveWithDetails }> = ({ testDrive }) => {
  const isUpcoming = new Date(testDrive.дата_время_начала_тест_драйва) > new Date();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Тест-драйв {testDrive.id_тест_драйва}
          </Typography>
          <Chip 
            label={isUpcoming ? 'Предстоящий' : 'Завершенный'} 
            color={isUpcoming ? 'primary' : 'success'} 
          />
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarMonthIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {formatDateTime(testDrive.дата_время_начала_тест_драйва)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {formatTimeOnly(testDrive.дата_время_начала_тест_драйва)} - {formatTimeOnly(testDrive.дата_время_окончания_тест_драйва)}
                {' '}({formatDuration(testDrive.дата_время_начала_тест_драйва, testDrive.дата_время_окончания_тест_драйва)})
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {testDrive.фио_покупателя || testDrive.покупатель?.фио_покупателя || 'Нет данных'}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {testDrive.название_производителя || testDrive.автомобиль?.название_производителя || testDrive.автомобиль?.производитель?.название_производителя || ''} {testDrive.название_модели || testDrive.автомобиль?.название_модели || testDrive.автомобиль?.модель?.название_модели || 'Нет данных'}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Маршрут:</strong> {testDrive.маршрут_тест_драйва}
            </Typography>
          </Grid>

          {testDrive.комментарии_по_тест_драйву && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Комментарии:</strong> {testDrive.комментарии_по_тест_драйву}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button variant="outlined" fullWidth>
          {isUpcoming ? 'Изменить запись' : 'Просмотреть детали'}
        </Button>
      </Box>
    </Card>
  );
};

const TestDrives: React.FC = () => {
  const [testDrives, setTestDrives] = useState<TestDriveWithDetails[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default test drive duration in minutes
  const DEFAULT_DURATION = 30;
  
  const [formData, setFormData] = useState({
    id_тест_драйва: '',
    id_покупателя: '',
    vin_автомобиля: '',
    id_сотрудника: '',
    дата_время_начала_тест_драйва: '',
    дата_время_окончания_тест_драйва: '',
    маршрут_тест_драйва: 'Стандартный городской маршрут',
    комментарии_по_тест_драйву: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testDrivesData, carsData, customersData, employeesData] = await Promise.all([
          apiService.getTestDrives(),
          apiService.getCars(),
          apiService.getCustomers(),
          apiService.getEmployees()
        ]);
        
        setTestDrives(testDrivesData);
        setCars(carsData.filter(car => car.статус_автомобиля === 'В наличии'));
        setCustomers(customersData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTestDrive = () => {
    // Generate a unique ID for the new test drive
    const newId = `TD${Date.now().toString().slice(-8)}`;
    
    // Set default date to tomorrow at 12:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    
    // Calculate end time (start time + DEFAULT_DURATION minutes)
    const endTime = new Date(tomorrow);
    endTime.setMinutes(endTime.getMinutes() + DEFAULT_DURATION);
    
    setFormData({
      id_тест_драйва: newId,
      id_покупателя: '',
      vin_автомобиля: '',
      id_сотрудника: '',
      дата_время_начала_тест_драйва: tomorrow.toISOString().slice(0, 16),
      дата_время_окончания_тест_драйва: endTime.toISOString().slice(0, 16),
      маршрут_тест_драйва: 'Стандартный городской маршрут',
      комментарии_по_тест_драйву: ''
    });
    
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTestDrive = await apiService.createTestDrive(formData);
      setTestDrives([...testDrives, newTestDrive]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating test drive:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{
    name?: string;
    value: unknown;
  }> | any) => {
    const name = e.target.name;
    const value = e.target.value;
    
    if (!name) return;

    if (name === 'дата_время_начала_тест_драйва') {
      // When start time changes, automatically update end time
      const startDate = new Date(value as string);
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + DEFAULT_DURATION);
      
      setFormData({
        ...formData,
        [name]: value as string,
        дата_время_окончания_тест_драйва: endDate.toISOString().slice(0, 16)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value as string
      });
    }
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Тест-драйвы" onAdd={handleAddTestDrive} addButtonLabel="Записать на тест-драйв" />
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Тест-драйвы" onAdd={handleAddTestDrive} addButtonLabel="Записать на тест-драйв" />
      
      {testDrives.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Нет данных о тест-драйвах</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {testDrives.map((testDrive) => (
            <Grid size={{ xs: 12, md: 6 }} key={testDrive.id_тест_драйва}>
              <TestDriveCard testDrive={testDrive} />
            </Grid>
          ))}
        </Grid>
      )}
      
      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title="Запись на тест-драйв"
        isLoading={isSubmitting}
      >
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="customer-label">Покупатель</InputLabel>
          <Select
            labelId="customer-label"
            name="id_покупателя"
            value={formData.id_покупателя}
            onChange={handleInputChange}
            label="Покупатель"
            required
          >
            {customers.map(customer => (
              <MenuItem key={customer.id_покупателя} value={customer.id_покупателя}>
                {customer.фио_покупателя}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="car-label">Автомобиль</InputLabel>
          <Select
            labelId="car-label"
            name="vin_автомобиля"
            value={formData.vin_автомобиля}
            onChange={handleInputChange}
            label="Автомобиль"
            required
          >
            {cars.map(car => {
              const carWithDetails = car as unknown as CarWithDetails;
              return (
                <MenuItem key={car.vin_номер} value={car.vin_номер}>
                  {carWithDetails.название_производителя || carWithDetails.производитель?.название_производителя} {carWithDetails.название_модели || carWithDetails.модель?.название_модели} ({car.цвет})
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="employee-label">Сотрудник</InputLabel>
          <Select
            labelId="employee-label"
            name="id_сотрудника"
            value={formData.id_сотрудника}
            onChange={handleInputChange}
            label="Сотрудник"
            required
          >
            {employees.map(employee => (
              <MenuItem key={employee.id_сотрудника} value={employee.id_сотрудника}>
                {employee.фио_сотрудника} ({employee.должность})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          type="datetime-local"
          label="Дата и время начала"
          name="дата_время_начала_тест_драйва"
          value={formData.дата_время_начала_тест_драйва}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          type="datetime-local"
          label="Дата и время окончания"
          name="дата_время_окончания_тест_драйва"
          value={formData.дата_время_окончания_тест_драйва}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Маршрут"
          name="маршрут_тест_драйва"
          value={formData.маршрут_тест_драйва}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Комментарии"
          name="комментарии_по_тест_драйву"
          multiline
          rows={2}
          value={formData.комментарии_по_тест_драйву}
          onChange={handleInputChange}
        />
      </FormModal>
    </Box>
  );
};

export default TestDrives; 