import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import apiService from '../services/apiConfig';
import { Customer } from '../types/types';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

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
    // In a real application, this would navigate to a form to add a new customer
    console.log('Add new customer clicked');
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
    </Box>
  );
};

export default Customers; 