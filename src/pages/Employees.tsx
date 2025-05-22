import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import apiService from '../services/apiConfig';
import { Employee } from '../types/types';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

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
    // In a real application, this would navigate to a form to add a new employee
    console.log('Add new employee clicked');
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
    </Box>
  );
};

export default Employees; 