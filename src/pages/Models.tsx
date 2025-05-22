import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Chip, CardActions, Button } from '@mui/material';
import PageHeader from '../components/PageHeader';
import CardGrid from '../components/CardGrid';
import apiService from '../services/apiConfig';
import { Model } from '../types/types';

const ModelCard: React.FC<{ model: Model }> = ({ model }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={`https://source.unsplash.com/featured/?car,${model.название_модели}`}
        alt={model.название_модели}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {model.название_модели}
        </Typography>
        <Chip 
          label={model.тип_кузова} 
          size="small" 
          sx={{ mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          Начало выпуска: {model.год_начала_выпуска} г.
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          {model.цена_базовая.toLocaleString()} ₽
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" fullWidth>Показать автомобили</Button>
      </CardActions>
    </Card>
  );
};

const Models: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await apiService.getModels();
        setModels(data);
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleAddModel = () => {
    // In a real application, this would navigate to a form to add a new model
    console.log('Add new model clicked');
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Модели автомобилей" onAdd={handleAddModel} />
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  const modelCards = models.map(model => (
    <ModelCard key={model.id_модели} model={model} />
  ));

  return (
    <Box>
      <PageHeader title="Модели автомобилей" onAdd={handleAddModel} />
      <CardGrid items={modelCards} emptyMessage="Модели не найдены" />
    </Box>
  );
};

export default Models; 