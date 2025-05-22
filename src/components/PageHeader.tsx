import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  addButtonLabel?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onAdd, addButtonLabel }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {onAdd && (
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          {addButtonLabel || 'Добавить'}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader; 