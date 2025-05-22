import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Card, CardContent, Grid, Chip, Button } from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PageHeader from '../components/PageHeader';
import apiService from '../services/apiConfig';
import { TestDriveWithDetails } from '../types/types';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestDrives = async () => {
      try {
        const data = await apiService.getTestDrives();
        setTestDrives(data);
      } catch (error) {
        console.error('Error fetching test drives:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDrives();
  }, []);

  const handleAddTestDrive = () => {
    // In a real application, this would navigate to a form to add a new test drive
    console.log('Add new test drive clicked');
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
    </Box>
  );
};

export default TestDrives; 