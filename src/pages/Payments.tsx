import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import apiService from '../services/apiConfig';
import { Payment } from '../types/types';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await apiService.getPayments();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleAddPayment = () => {
    // In a real application, this would navigate to a form to add a new payment
    console.log('Add new payment clicked');
  };

  const handleViewPayment = (payment: Payment) => {
    console.log('View payment:', payment);
  };

  const handleEditPayment = (payment: Payment) => {
    console.log('Edit payment:', payment);
  };

  const columns: Column[] = [
    { id: 'id_платежа', label: 'ID платежа', minWidth: 100 },
    { id: 'id_продажи', label: 'ID продажи', minWidth: 100 },
    { id: 'дата_платежа', label: 'Дата платежа', minWidth: 120 },
    { 
      id: 'сумма_платежа', 
      label: 'Сумма', 
      minWidth: 120,
      align: 'right',
      format: (value) => `${value.toLocaleString()} ₽`
    },
    { 
      id: 'способ_оплаты', 
      label: 'Способ оплаты', 
      minWidth: 150,
      format: (value) => (
        <Chip 
          label={value} 
          color={
            value === 'Наличные' 
              ? 'success' 
              : value === 'Карта' 
                ? 'primary' 
                : 'info'
          } 
          size="small" 
        />
      )
    },
    { 
      id: 'статус_платежа', 
      label: 'Статус', 
      minWidth: 120,
      format: (value) => (
        <Chip 
          label={value} 
          color={value === 'Оплачено' ? 'success' : 'warning'} 
          size="small" 
        />
      )
    },
  ];

  if (loading) {
    return (
      <Box>
        <PageHeader title="Платежи" onAdd={handleAddPayment} />
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Платежи" onAdd={handleAddPayment} />
      <DataTable 
        columns={columns} 
        rows={payments} 
        getRowId={(row) => row.id_платежа}
        onView={handleViewPayment}
        onEdit={handleEditPayment}
      />
    </Box>
  );
};

export default Payments; 