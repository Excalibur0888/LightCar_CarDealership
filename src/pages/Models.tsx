import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Chip, CardActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import CardGrid from '../components/CardGrid';
import FormModal from '../components/FormModal';
import apiService from '../services/apiConfig';
import { Model, Manufacturer } from '../types/types';

const ModelCard: React.FC<{ model: Model; onShowCars: (modelId: string) => void }> = ({ model, onShowCars }) => {
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
        <Button 
          size="small" 
          fullWidth 
          onClick={() => onShowCars(model.id_модели)}
        >
          Показать автомобили
        </Button>
      </CardActions>
    </Card>
  );
};

const Models: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_модели: '',
    id_производителя: '',
    название_модели: '',
    тип_кузова: '',
    год_начала_выпуска: new Date().getFullYear(),
    цена_базовая: 0
  });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const manufacturerIdFilter = queryParams.get('manufacturerId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let modelsData: Model[];
        
        if (manufacturerIdFilter) {
          modelsData = await apiService.getModelsByManufacturer(manufacturerIdFilter);
        } else {
          modelsData = await apiService.getModels();
        }
        
        const manufacturersData = await apiService.getManufacturers();
        
        setModels(modelsData);
        setManufacturers(manufacturersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [manufacturerIdFilter]);

  const handleAddModel = () => {
    // Generate a unique ID for the new model
    const newId = `MDL${Date.now().toString().slice(-8)}`;
    setFormData({
      ...formData,
      id_модели: newId,
      id_производителя: manufacturerIdFilter || ''
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Reset form data
    setFormData({
      id_модели: '',
      id_производителя: '',
      название_модели: '',
      тип_кузова: '',
      год_начала_выпуска: new Date().getFullYear(),
      цена_базовая: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newModel = await apiService.createModel(formData);
      setModels([...models, newModel]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating model:', error);
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
    
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleShowCars = (modelId: string) => {
    // Navigate to Cars page with model filter
    navigate(`/cars?modelId=${modelId}`);
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
    <ModelCard key={model.id_модели} model={model} onShowCars={handleShowCars} />
  ));

  // Get manufacturer name for the title if we're filtering by manufacturer
  let pageTitle = "Модели автомобилей";
  if (manufacturerIdFilter) {
    const manufacturer = manufacturers.find(m => m.id_производителя === manufacturerIdFilter);
    if (manufacturer) {
      pageTitle = `Модели ${manufacturer.название_производителя}`;
    }
  }

  return (
    <Box>
      <PageHeader title={pageTitle} onAdd={handleAddModel} />
      <CardGrid items={modelCards} emptyMessage="Модели не найдены" />

      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title="Добавить модель"
        isLoading={isSubmitting}
      >
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="manufacturer-label">Производитель</InputLabel>
          <Select
            labelId="manufacturer-label"
            name="id_производителя"
            value={formData.id_производителя}
            onChange={handleInputChange}
            label="Производитель"
            required
          >
            {manufacturers.map(manufacturer => (
              <MenuItem key={manufacturer.id_производителя} value={manufacturer.id_производителя}>
                {manufacturer.название_производителя}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          label="Название модели"
          name="название_модели"
          value={formData.название_модели}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Тип кузова"
          name="тип_кузова"
          value={formData.тип_кузова}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          type="number"
          label="Год начала выпуска"
          name="год_начала_выпуска"
          value={formData.год_начала_выпуска}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          type="number"
          label="Базовая цена (₽)"
          name="цена_базовая"
          value={formData.цена_базовая}
          onChange={handleInputChange}
        />
      </FormModal>
    </Box>
  );
};

export default Models; 