import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, CardActions, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import CardGrid from '../components/CardGrid';
import FormModal from '../components/FormModal';
import apiService from '../services/apiConfig';
import { Manufacturer } from '../types/types';

const ManufacturerCard: React.FC<{ 
  manufacturer: Manufacturer; 
  onViewModels: (manufacturerId: string) => void 
}> = ({ manufacturer, onViewModels }) => {
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
        <Button 
          size="small" 
          fullWidth 
          onClick={() => onViewModels(manufacturer.id_производителя)}
        >
          Смотреть модели
        </Button>
      </CardActions>
    </Card>
  );
};

const Manufacturers: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_производителя: '',
    название_производителя: '',
    страна_производителя: '',
  });
  const navigate = useNavigate();

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
    // Generate a unique ID for the new manufacturer
    const newId = `MFR${Date.now().toString().slice(-8)}`;
    setFormData({
      ...formData,
      id_производителя: newId
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Reset form data
    setFormData({
      id_производителя: '',
      название_производителя: '',
      страна_производителя: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newManufacturer = await apiService.createManufacturer(formData);
      setManufacturers([...manufacturers, newManufacturer]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating manufacturer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleViewModels = (manufacturerId: string) => {
    // Navigate to models page filtered by manufacturer
    navigate(`/models?manufacturerId=${manufacturerId}`);
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
    <ManufacturerCard 
      key={manufacturer.id_производителя} 
      manufacturer={manufacturer} 
      onViewModels={handleViewModels}
    />
  ));

  return (
    <Box>
      <PageHeader title="Производители" onAdd={handleAddManufacturer} />
      <CardGrid items={manufacturerCards} emptyMessage="Производители не найдены" />

      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title="Добавить производителя"
        isLoading={isSubmitting}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          label="Название производителя"
          name="название_производителя"
          value={formData.название_производителя}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Страна производителя"
          name="страна_производителя"
          value={formData.страна_производителя}
          onChange={handleInputChange}
        />
      </FormModal>
    </Box>
  );
};

export default Manufacturers; 