import React from 'react';
import { Box } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import Header from './components/navigation/Header';

const App = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <AppRoutes />
      </Box>
    </Box>
  );
};

export default App;
