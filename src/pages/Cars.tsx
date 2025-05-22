import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, CardActions, Button, Typography, Chip, Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import CardGrid from '../components/CardGrid';
import apiService from '../services/apiConfig';
import { CarWithDetails } from '../types/types';

const CarCard: React.FC<{ car: CarWithDetails; onViewDetails: (vin: string) => void }> = ({ car, onViewDetails }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={`https://source.unsplash.com/featured/?car,${car.название_модели || car.модель?.название_модели || 'auto'}`}
        alt={`${car.название_производителя || car.производитель?.название_производителя} ${car.название_модели || car.модель?.название_модели}`}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {car.название_производителя || car.производитель?.название_производителя} {car.название_модели || car.модель?.название_модели}
        </Typography>
        <Box sx={{ mb: 1 }}>
          <Chip 
            label={car.статус_автомобиля} 
            color={car.статус_автомобиля === 'В наличии' ? 'success' : 
                  car.статус_автомобиля === 'Продан' ? 'error' : 'warning'} 
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip label={car.тип_кузова || car.модель?.тип_кузова} size="small" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {car.цвет}, {car.год_выпуска} г.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Комплектация: {car.комплектация_описание}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {(car.цена_базовая || car.модель?.цена_базовая)?.toLocaleString()} ₽
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          onClick={() => onViewDetails(car.vin_номер)}
          fullWidth
        >
          Подробнее
        </Button>
      </CardActions>
    </Card>
  );
};

const Cars: React.FC = () => {
  const [cars, setCars] = useState<CarWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await apiService.getCars();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleAddCar = () => {
    // In a real application, this would navigate to a form to add a new car
    console.log('Add new car clicked');
  };

  const handleViewCarDetails = (vin: string) => {
    navigate(`/cars/${vin}`);
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Автомобили" onAdd={handleAddCar} />
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  const carCards = cars.map(car => (
    <CarCard key={car.vin_номер} car={car} onViewDetails={handleViewCarDetails} />
  ));

  return (
    <Box>
      <PageHeader title="Автомобили" onAdd={handleAddCar} />
      <CardGrid items={carCards} emptyMessage="Автомобили не найдены" />
    </Box>
  );
};

export default Cars; 