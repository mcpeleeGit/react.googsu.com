import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            블로그 서비스를 이용하기 위해 로그인하거나 회원가입을 해주세요.
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ height: 48 }}
            >
              로그인
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ height: 48 }}
            >
              회원가입
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home; 