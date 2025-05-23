import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import FormModal from '../components/FormModal';
import apiService from '../services/apiConfig';
import { Customer } from '../types/types';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_покупателя: '',
    фио_покупателя: '',
    тип_покупателя: 'Физическое лицо',
    контактный_телефон: '',
    email_покупателя: '',
    адрес_покупателя: ''
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiService.getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    // Generate a unique ID for the new customer
    const newId = `CUST${Date.now().toString().slice(-8)}`;
    setFormData({
      ...formData,
      id_покупателя: newId
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({
      id_покупателя: '',
      фио_покупателя: '',
      тип_покупателя: 'Физическое лицо',
      контактный_телефон: '',
      email_покупателя: '',
      адрес_покупателя: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newCustomer = await apiService.createCustomer(formData);
      setCustomers([...customers, newCustomer]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    console.log('View customer:', customer);
  };

  const handleEditCustomer = (customer: Customer) => {
    console.log('Edit customer:', customer);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    console.log('Delete customer:', customer);
  };

  const columns: Column[] = [
    { id: 'фио_покупателя', label: 'ФИО / Наименование', minWidth: 170 },
    { 
      id: 'тип_покупателя', 
      label: 'Тип', 
      minWidth: 120,
      format: (value) => (
        <Chip 
          label={value} 
          color={value === 'Физическое лицо' ? 'primary' : 'secondary'} 
          size="small" 
        />
      )
    },
    { id: 'контактный_телефон', label: 'Телефон', minWidth: 120 },
    { id: 'email_покупателя', label: 'Email', minWidth: 170 },
    { id: 'адрес_покупателя', label: 'Адрес', minWidth: 200 },
  ];

  if (loading) {
    return (
      <Box>
        <PageHeader title="Клиенты" onAdd={handleAddCustomer} />
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Клиенты" onAdd={handleAddCustomer} />
      <DataTable 
        columns={columns} 
        rows={customers} 
        getRowId={(row) => row.id_покупателя}
        onView={handleViewCustomer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      />

      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title="Добавить клиента"
        isLoading={isSubmitting}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          label="ФИО / Наименование"
          name="фио_покупателя"
          value={formData.фио_покупателя}
          onChange={handleInputChange}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="customer-type-label">Тип покупателя</InputLabel>
          <Select
            labelId="customer-type-label"
            name="тип_покупателя"
            value={formData.тип_покупателя}
            onChange={handleInputChange}
            label="Тип покупателя"
          >
            <MenuItem value="Физическое лицо">Физическое лицо</MenuItem>
            <MenuItem value="Юридическое лицо">Юридическое лицо</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          label="Контактный телефон"
          name="контактный_телефон"
          value={formData.контактный_телефон}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Email"
          name="email_покупателя"
          type="email"
          value={formData.email_покупателя}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Адрес"
          name="адрес_покупателя"
          multiline
          rows={2}
          value={formData.адрес_покупателя}
          onChange={handleInputChange}
        />
      </FormModal>
    </Box>
  );
};

export default Customers; 