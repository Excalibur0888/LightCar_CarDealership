import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Chip, Button, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Card, CardMedia, List, ListItem, ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpeedIcon from '@mui/icons-material/Speed';
import SellIcon from '@mui/icons-material/Sell';
import apiService from '../services/apiConfig';
import { CarWithDetails } from '../types/types';

const CarDetails: React.FC = () => {
  const { vin } = useParams<{ vin: string }>();
  const [car, setCar] = useState<CarWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!vin) return;
      
      try {
        const data = await apiService.getCarByVin(vin);
        setCar(data);
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Не удалось загрузить информацию об автомобиле');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [vin]);

  const handleTestDriveClick = () => {
    // In a real app, this would navigate to test drive form
    console.log('Schedule test drive for:', vin);
  };

  const handleSellClick = () => {
    // In a real app, this would navigate to sales form
    console.log('Sell car:', vin);
  };

  if (loading) {
    return (
      <Box>
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  if (error || !car) {
    return (
      <Box>
        <Typography color="error">{error || 'Автомобиль не найден'}</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cars')}
          sx={{ mt: 2 }}
        >
          Назад к списку
        </Button>
      </Box>
    );
  }

  const isAvailable = car.статус_автомобиля === 'В наличии';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cars')}
        >
          Назад к списку
        </Button>
        <Box>
          {isAvailable && (
            <>
              <Button
                variant="outlined"
                startIcon={<SpeedIcon />}
                onClick={handleTestDriveClick}
                sx={{ mr: 1 }}
              >
                Тест-драйв
              </Button>
              <Button
                variant="contained"
                startIcon={<SellIcon />}
                onClick={handleSellClick}
                color="primary"
              >
                Оформить продажу
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={`https://source.unsplash.com/featured/?car,${car.название_модели || car.модель?.название_модели || 'auto'}`}
              alt={`${car.название_производителя || car.производитель?.название_производителя} ${car.название_модели || car.модель?.название_модели}`}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              {car.название_производителя || car.производитель?.название_производителя} {car.название_модели || car.модель?.название_модели}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={car.статус_автомобиля} 
                color={car.статус_автомобиля === 'В наличии' ? 'success' : 
                      car.статус_автомобиля === 'Продан' ? 'error' : 'warning'} 
                sx={{ mr: 1 }}
              />
              <Chip label={car.тип_кузова || car.модель?.тип_кузова} />
            </Box>
            <Typography variant="h5" color="primary" gutterBottom>
              {(car.цена_базовая || car.модель?.цена_базовая)?.toLocaleString()} ₽
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body1">
                  <strong>VIN:</strong> {car.vin_номер}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body1">
                  <strong>Цвет:</strong> {car.цвет}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body1">
                  <strong>Год выпуска:</strong> {car.год_выпуска}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body1">
                  <strong>Страна производителя:</strong> {car.производитель?.страна_производителя}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1">
                  <strong>Комплектация:</strong> {car.комплектация_описание}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Опции и дополнительное оборудование
            </Typography>
            {car.опции && car.опции.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Наименование</TableCell>
                      <TableCell>Описание</TableCell>
                      <TableCell align="right">Стоимость</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {car.опции.map((option) => (
                      <TableRow key={option.id_опции}>
                        <TableCell>{option.название_опции}</TableCell>
                        <TableCell>{option.описание_опции}</TableCell>
                        <TableCell align="right">{option.цена_опции.toLocaleString()} ₽</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle1">
                          <strong>Итого с опциями:</strong>
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1">
                          <strong>
                            {(
                              (car.цена_базовая || car.модель?.цена_базовая || 0) + 
                              car.опции.reduce((sum, opt) => sum + opt.цена_опции, 0)
                            ).toLocaleString()} ₽
                          </strong>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Дополнительные опции отсутствуют</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarDetails; 