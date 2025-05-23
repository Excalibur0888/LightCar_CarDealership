import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Avatar, TextField } from '@mui/material';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import FormModal from '../components/FormModal';
import apiService from '../services/apiConfig';
import { Employee } from '../types/types';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_сотрудника: '',
    фио_сотрудника: '',
    должность: '',
    контактный_телефон: '',
    email_сотрудника: ''
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiService.getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = () => {
    // Generate a unique ID for the new employee
    const newId = `EMP${Date.now().toString().slice(-8)}`;
    setFormData({
      ...formData,
      id_сотрудника: newId
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({
      id_сотрудника: '',
      фио_сотрудника: '',
      должность: '',
      контактный_телефон: '',
      email_сотрудника: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newEmployee = await apiService.createEmployee(formData);
      setEmployees([...employees, newEmployee]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewEmployee = (employee: Employee) => {
    console.log('View employee:', employee);
  };

  const handleEditEmployee = (employee: Employee) => {
    console.log('Edit employee:', employee);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    console.log('Delete employee:', employee);
  };

  const getEmployeeInitials = (name: string) => {
    const nameParts = name.split(' ');
    return nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : name.substring(0, 2);
  };

  const columns: Column[] = [
    { 
      id: 'фио_сотрудника', 
      label: 'ФИО', 
      minWidth: 200,
      format: (value, row: Employee) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {getEmployeeInitials(value)}
          </Avatar>
          {value}
        </Box>
      ) 
    },
    { 
      id: 'должность', 
      label: 'Должность', 
      minWidth: 150,
      format: (value) => (
        <Chip 
          label={value} 
          color={value === 'Менеджер по продажам' ? 'primary' : 'secondary'} 
          size="small" 
        />
      )
    },
    { id: 'контактный_телефон', label: 'Телефон', minWidth: 130 },
    { id: 'email_сотрудника', label: 'Email', minWidth: 170 },
  ];

  if (loading) {
    return (
      <Box>
        <PageHeader title="Сотрудники" onAdd={handleAddEmployee} />
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Сотрудники" onAdd={handleAddEmployee} />
      <DataTable 
        columns={columns} 
        rows={employees} 
        getRowId={(row) => row.id_сотрудника}
        onView={handleViewEmployee}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
      />

      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title="Добавить сотрудника"
        isLoading={isSubmitting}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          label="ФИО"
          name="фио_сотрудника"
          value={formData.фио_сотрудника}
          onChange={handleInputChange}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Должность"
          name="должность"
          value={formData.должность}
          onChange={handleInputChange}
        />

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
          name="email_сотрудника"
          type="email"
          value={formData.email_сотрудника}
          onChange={handleInputChange}
        />
      </FormModal>
    </Box>
  );
};

export default Employees; 