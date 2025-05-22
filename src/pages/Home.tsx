import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, Paper, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SpeedIcon from '@mui/icons-material/Speed';
import apiService from '../services/apiConfig';
import { CarWithDetails } from '../types/types';

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number | string;
  link: string;
  linkText: string;
}> = ({ icon, title, value, link, linkText }) => (
  <Card sx={{ minWidth: 275, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
      </Box>
      <Typography variant="h3" align="center" sx={{ my: 2 }}>
        {value}
      </Typography>
    </CardContent>
    <CardActions>
      <Button 
        size="small" 
        component={RouterLink} 
        to={link} 
        fullWidth
      >
        {linkText}
      </Button>
    </CardActions>
  </Card>
);

const FeaturedCar: React.FC<{ car: CarWithDetails }> = ({ car }) => (
  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom>
        {car.название_производителя || car.производитель?.название_производителя} {car.название_модели || car.модель?.название_модели}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Год выпуска: {car.год_выпуска}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Цвет: {car.цвет}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Комплектация: {car.комплектация_описание}
      </Typography>
      <Typography variant="body1" color="primary" gutterBottom>
        Статус: {car.статус_автомобиля}
      </Typography>
      <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
        Цена: {(car.цена_базовая || car.модель?.цена_базовая)?.toLocaleString()} ₽
      </Typography>
    </CardContent>
    <CardActions>
      <Button 
        size="small" 
        component={RouterLink} 
        to={`/cars/${car.vin_номер}`}
        fullWidth
      >
        Подробнее
      </Button>
    </CardActions>
  </Card>
);

const Home: React.FC = () => {
  const [cars, setCars] = useState<CarWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [customersCount, setCustomersCount] = useState<number>(0);
  const [salesCount, setSalesCount] = useState<number>(0);
  const [testDrivesCount, setTestDrivesCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCars = await apiService.getCars();
        setCars(fetchedCars);
        
        // Get customers count
        const customers = await apiService.getCustomers();
        setCustomersCount(customers.length);
        
        // Get sales count
        const sales = await apiService.getSales();
        setSalesCount(sales.length);
        
        // Get test drives count
        const testDrives = await apiService.getTestDrives();
        setTestDrivesCount(testDrives.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter cars that are in stock (В наличии)
  const availableCars = cars.filter(car => car.статус_автомобиля === 'В наличии');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Панель управления автосалоном
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            icon={<DirectionsCarIcon fontSize="large" color="primary" />}
            title="Автомобили"
            value={availableCars.length}
            link="/cars"
            linkText="Все автомобили"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            icon={<PeopleIcon fontSize="large" color="primary" />}
            title="Клиенты"
            value={customersCount}
            link="/customers"
            linkText="Список клиентов"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            icon={<ReceiptIcon fontSize="large" color="primary" />}
            title="Продажи"
            value={salesCount}
            link="/sales"
            linkText="История продаж"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            icon={<SpeedIcon fontSize="large" color="primary" />}
            title="Тест-драйвы"
            value={testDrivesCount}
            link="/test-drives"
            linkText="Записи на тест-драйв"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
        Автомобили в наличии
      </Typography>
      
      <Grid container spacing={3}>
        {availableCars.map((car) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={car.vin_номер}>
            <FeaturedCar car={car} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home; 