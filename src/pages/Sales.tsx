import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Paper, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import FormModal from '../components/FormModal';
import apiService from '../services/apiConfig';
import { SaleWithDetails, Payment, Customer, CarWithDetails, Employee } from '../types/types';

interface ExpandableSaleRowProps {
  sale: SaleWithDetails;
}

const ExpandableSaleRow: React.FC<ExpandableSaleRowProps> = ({ sale }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{sale.id_продажи}</TableCell>
        <TableCell>{sale.фио_покупателя || sale.покупатель?.фио_покупателя}</TableCell>
        <TableCell>
          {sale.название_производителя || sale.автомобиль?.название_производителя || sale.автомобиль?.производитель?.название_производителя} {sale.название_модели || sale.автомобиль?.название_модели || sale.автомобиль?.модель?.название_модели}
        </TableCell>
        <TableCell>{sale.дата_продажи}</TableCell>
        <TableCell>{sale.итоговая_сумма_сделки.toLocaleString()} ₽</TableCell>
        <TableCell>
          <Chip 
            label={sale.условия_оплаты} 
            color={sale.условия_оплаты === 'Кредит' ? 'warning' : 'success'} 
            size="small" 
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Платежи
              </Typography>
              <Table size="small" aria-label="payments">
                <TableHead>
                  <TableRow>
                    <TableCell>Дата платежа</TableCell>
                    <TableCell>Сумма</TableCell>
                    <TableCell>Способ оплаты</TableCell>
                    <TableCell>Статус</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sale.платежи?.map((payment) => (
                    <TableRow key={payment.id_платежа}>
                      <TableCell>{payment.дата_платежа}</TableCell>
                      <TableCell>{payment.сумма_платежа.toLocaleString()} ₽</TableCell>
                      <TableCell>{payment.способ_оплаты}</TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.статус_платежа} 
                          color={payment.статус_платежа === 'Оплачено' ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Sales: React.FC = () => {
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cars, setCars] = useState<CarWithDetails[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    id_продажи: '',
    id_покупателя: '',
    vin_автомобиля: '',
    id_сотрудника: '',
    дата_продажи: new Date().toISOString().split('T')[0],
    итоговая_сумма_сделки: 0,
    условия_оплаты: 'Наличные',
    платежи: [] as Payment[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesData, customersData, carsData, employeesData] = await Promise.all([
          apiService.getSales(),
          apiService.getCustomers(),
          apiService.getCars(),
          apiService.getEmployees()
        ]);
        setSales(salesData);
        setCustomers(customersData);
        setCars(carsData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSale = () => {
    // Generate a unique ID for the new sale
    const newId = `SALE${Date.now().toString().slice(-8)}`;
    setFormData({
      ...formData,
      id_продажи: newId,
      дата_продажи: new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({
      id_продажи: '',
      id_покупателя: '',
      vin_автомобиля: '',
      id_сотрудника: '',
      дата_продажи: new Date().toISOString().split('T')[0],
      итоговая_сумма_сделки: 0,
      условия_оплаты: 'Наличные',
      платежи: []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newSale = await apiService.createSale(formData);
      setSales([...sales, newSale]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating sale:', error);
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

  if (loading) {
    return (
      <Box>
        <PageHeader title="Продажи" onAdd={handleAddSale} />
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Продажи" onAdd={handleAddSale} />
      {sales.length === 0 ? (
        <Typography>Нет данных о продажах</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>ID продажи</TableCell>
                <TableCell>Покупатель</TableCell>
                <TableCell>Автомобиль</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell>Условия оплаты</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <ExpandableSaleRow key={sale.id_продажи} sale={sale} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title="Добавить продажу"
        isLoading={isSubmitting}
      >
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="customer-label">Покупатель</InputLabel>
          <Select
            labelId="customer-label"
            name="id_покупателя"
            value={formData.id_покупателя}
            onChange={handleInputChange}
            label="Покупатель"
          >
            {customers.map(customer => (
              <MenuItem key={customer.id_покупателя} value={customer.id_покупателя}>
                {customer.фио_покупателя}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="car-label">Автомобиль</InputLabel>
          <Select
            labelId="car-label"
            name="vin_автомобиля"
            value={formData.vin_автомобиля}
            onChange={handleInputChange}
            label="Автомобиль"
          >
            {cars.map(car => (
              <MenuItem key={car.vin_номер} value={car.vin_номер}>
                {car.производитель?.название_производителя} {car.модель?.название_модели} - {car.vin_номер}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="employee-label">Сотрудник</InputLabel>
          <Select
            labelId="employee-label"
            name="id_сотрудника"
            value={formData.id_сотрудника}
            onChange={handleInputChange}
            label="Сотрудник"
          >
            {employees.map(employee => (
              <MenuItem key={employee.id_сотрудника} value={employee.id_сотрудника}>
                {employee.фио_сотрудника}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          type="date"
          label="Дата продажи"
          name="дата_продажи"
          value={formData.дата_продажи}
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
          label="Итоговая сумма сделки"
          name="итоговая_сумма_сделки"
          value={formData.итоговая_сумма_сделки}
          onChange={handleInputChange}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="payment-type-label">Условия оплаты</InputLabel>
          <Select
            labelId="payment-type-label"
            name="условия_оплаты"
            value={formData.условия_оплаты}
            onChange={handleInputChange}
            label="Условия оплаты"
          >
            <MenuItem value="Наличные">Наличные</MenuItem>
            <MenuItem value="Кредит">Кредит</MenuItem>
            <MenuItem value="Рассрочка">Рассрочка</MenuItem>
          </Select>
        </FormControl>
      </FormModal>
    </Box>
  );
};

export default Sales; 