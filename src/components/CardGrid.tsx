import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

interface CardGridProps {
  items: React.ReactNode[];
  emptyMessage?: string;
}

const CardGrid: React.FC<CardGridProps> = ({ 
  items, 
  emptyMessage = 'Нет данных для отображения' 
}) => {
  return (
    <Box>
      {items.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              {item}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CardGrid; 