import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import FormModal from '../components/FormModal';
import apiService from '../services/apiConfig';
import { Payment, SaleWithDetails } from '../types/types';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_платежа: '',
    id_продажи: '',
    дата_платежа: new Date().toISOString().split('T')[0],
    сумма_платежа: 0,
    способ_оплаты: 'Наличные',
    статус_платежа: 'Оплачено'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, salesData] = await Promise.all([
          apiService.getPayments(),
          apiService.getSales()
        ]);
        setPayments(paymentsData);
        setSales(salesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddPayment = () => {
    // Generate a unique ID for the new payment
    const newId = `PAY${Date.now().toString().slice(-8)}`;
    setFormData({
      ...formData,
      id_платежа: newId,
      дата_платежа: new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({
      id_платежа: '',
      id_продажи: '',
      дата_платежа: new Date().toISOString().split('T')[0],
      сумма_платежа: 0,
      способ_оплаты: 'Наличные',
      статус_платежа: 'Оплачено'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newPayment = await apiService.createPayment(formData);
      setPayments([...payments, newPayment]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating payment:', error);
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

      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title="Добавить платеж"
        isLoading={isSubmitting}
      >
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="sale-label">Продажа</InputLabel>
          <Select
            labelId="sale-label"
            name="id_продажи"
            value={formData.id_продажи}
            onChange={handleInputChange}
            label="Продажа"
          >
            {sales.map(sale => (
              <MenuItem key={sale.id_продажи} value={sale.id_продажи}>
                {sale.id_продажи} - {sale.покупатель?.фио_покупателя} - {sale.автомобиль?.модель?.название_модели}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          type="date"
          label="Дата платежа"
          name="дата_платежа"
          value={formData.дата_платежа}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          type="number"
          label="Сумма платежа"
          name="сумма_платежа"
          value={formData.сумма_платежа}
          onChange={handleInputChange}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="payment-method-label">Способ оплаты</InputLabel>
          <Select
            labelId="payment-method-label"
            name="способ_оплаты"
            value={formData.способ_оплаты}
            onChange={handleInputChange}
            label="Способ оплаты"
          >
            <MenuItem value="Наличные">Наличные</MenuItem>
            <MenuItem value="Карта">Карта</MenuItem>
            <MenuItem value="Банковский перевод">Банковский перевод</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="payment-status-label">Статус платежа</InputLabel>
          <Select
            labelId="payment-status-label"
            name="статус_платежа"
            value={formData.статус_платежа}
            onChange={handleInputChange}
            label="Статус платежа"
          >
            <MenuItem value="Оплачено">Оплачено</MenuItem>
            <MenuItem value="В обработке">В обработке</MenuItem>
            <MenuItem value="Отклонено">Отклонено</MenuItem>
          </Select>
        </FormControl>
      </FormModal>
    </Box>
  );
};

export default Payments; 