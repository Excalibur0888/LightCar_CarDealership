import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, CardActions, Button, Typography, Chip, 
  TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import CardGrid from '../components/CardGrid';
import FormModal from '../components/FormModal';
import apiService from '../services/apiConfig';
import { CarWithDetails, Model, Option } from '../types/types';

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
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vin_номер: '',
    id_модели: '',
    цвет: '',
    комплектация_описание: '',
    год_выпуска: new Date().getFullYear(),
    статус_автомобиля: 'В наличии',
    опции: [] as string[]
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modelIdFilter = queryParams.get('modelId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let carsData: CarWithDetails[];
        
        if (modelIdFilter) {
          carsData = await apiService.getCarsByModel(modelIdFilter);
        } else {
          carsData = await apiService.getCars();
        }
        
        const modelsData = await apiService.getModels();
        
        setCars(carsData);
        setModels(modelsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [modelIdFilter]);

  const handleAddCar = () => {
    // Generate a unique VIN for the new car
    const newVin = `VIN${Date.now().toString().slice(-12)}`;
    setFormData({
      ...formData,
      vin_номер: newVin
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Reset form data
    setFormData({
      vin_номер: '',
      id_модели: '',
      цвет: '',
      комплектация_описание: '',
      год_выпуска: new Date().getFullYear(),
      статус_автомобиля: 'В наличии',
      опции: []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newCar = await apiService.createCar(formData);
      setCars([...cars, newCar]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating car:', error);
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

  const handleViewCarDetails = (vin: string) => {
    navigate(`/cars/${vin}`);
  };

  if (loading) {
    return (
      <Box>
        <PageHeader 
          title={modelIdFilter ? "Автомобили данной модели" : "Все автомобили"} 
          onAdd={handleAddCar} 
        />
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  const carCards = cars.map(car => (
    <CarCard key={car.vin_номер} car={car} onViewDetails={handleViewCarDetails} />
  ));

  // Get model name for the title if we're filtering by model
  let pageTitle = "Автомобили";
  if (modelIdFilter) {
    const model = models.find(m => m.id_модели === modelIdFilter);
    if (model) {
      pageTitle = `Автомобили модели ${model.название_модели}`;
    }
  }

  return (
    <Box>
      <PageHeader title={pageTitle} onAdd={handleAddCar} />
      <CardGrid items={carCards} emptyMessage="Автомобили не найдены" />

      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title="Добавить автомобиль"
        isLoading={isSubmitting}
      >
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="model-label">Модель</InputLabel>
          <Select
            labelId="model-label"
            name="id_модели"
            value={formData.id_модели}
            onChange={handleInputChange}
            label="Модель"
            required
          >
            {models.map(model => (
              <MenuItem key={model.id_модели} value={model.id_модели}>
                {model.название_модели}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          label="VIN номер"
          name="vin_номер"
          value={formData.vin_номер}
          disabled
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Цвет"
          name="цвет"
          value={formData.цвет}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Описание комплектации"
          name="комплектация_описание"
          multiline
          rows={2}
          value={formData.комплектация_описание}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          type="number"
          label="Год выпуска"
          name="год_выпуска"
          value={formData.год_выпуска}
          onChange={handleInputChange}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="status-label">Статус</InputLabel>
          <Select
            labelId="status-label"
            name="статус_автомобиля"
            value={formData.статус_автомобиля}
            onChange={handleInputChange}
            label="Статус"
            required
          >
            <MenuItem value="В наличии">В наличии</MenuItem>
            <MenuItem value="Заказан">Заказан</MenuItem>
            <MenuItem value="В пути">В пути</MenuItem>
            <MenuItem value="Продан">Продан</MenuItem>
          </Select>
        </FormControl>
      </FormModal>
    </Box>
  );
};

export default Cars; 