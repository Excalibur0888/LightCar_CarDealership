import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, CardActions, Button } from '@mui/material';
import PageHeader from '../components/PageHeader';
import CardGrid from '../components/CardGrid';
import apiService from '../services/apiConfig';
import { Manufacturer } from '../types/types';

const ManufacturerCard: React.FC<{ manufacturer: Manufacturer }> = ({ manufacturer }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {manufacturer.название_производителя.charAt(0)}
          </Avatar>
          <Typography variant="h6" component="div">
            {manufacturer.название_производителя}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          <strong>Страна:</strong> {manufacturer.страна_производителя}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>ID:</strong> {manufacturer.id_производителя}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" fullWidth>Смотреть модели</Button>
      </CardActions>
    </Card>
  );
};

const Manufacturers: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const data = await apiService.getManufacturers();
        setManufacturers(data);
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturers();
  }, []);

  const handleAddManufacturer = () => {
    // In a real application, this would navigate to a form to add a new manufacturer
    console.log('Add new manufacturer clicked');
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Производители" onAdd={handleAddManufacturer} />
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  const manufacturerCards = manufacturers.map(manufacturer => (
    <ManufacturerCard key={manufacturer.id_производителя} manufacturer={manufacturer} />
  ));

  return (
    <Box>
      <PageHeader title="Производители" onAdd={handleAddManufacturer} />
      <CardGrid items={manufacturerCards} emptyMessage="Производители не найдены" />
    </Box>
  );
};

export default Manufacturers; 