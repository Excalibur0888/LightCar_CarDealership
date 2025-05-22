import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Layout from './components/Layout';
import Home from './pages/Home';
import Manufacturers from './pages/Manufacturers';
import Models from './pages/Models';
import Cars from './pages/Cars';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import Sales from './pages/Sales';
import Payments from './pages/Payments';
import TestDrives from './pages/TestDrives';
import CarDetails from './pages/CarDetails';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manufacturers" element={<Manufacturers />} />
            <Route path="/models" element={<Models />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:vin" element={<CarDetails />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/test-drives" element={<TestDrives />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 