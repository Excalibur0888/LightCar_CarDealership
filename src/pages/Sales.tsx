import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Paper, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import apiService from '../services/apiConfig';
import { SaleWithDetails, Payment } from '../types/types';

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

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await apiService.getSales();
        setSales(data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const handleAddSale = () => {
    // In a real application, this would navigate to a form to add a new sale
    console.log('Add new sale clicked');
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
    </Box>
  );
};

export default Sales; 