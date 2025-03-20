import React from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Container,
  Alert,
  Snackbar,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  id: number;
  email: string;
  name: string;
}

const schema = yup.object().shape({
  email: yup.string().email('유효한 이메일을 입력해주세요.').required('이메일은 필수입니다.'),
  password: yup.string().required('비밀번호는 필수입니다.'),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post<LoginResponse>('http://localhost:8080/api/members/login', {
        email: data.email,
        password: data.password,
      });

      // JWT 토큰을 localStorage에 저장
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
      }));

      setSnackbar({
        open: true,
        message: '로그인 성공! 블로그 페이지로 이동합니다.',
        severity: 'success',
      });

      setTimeout(() => {
        navigate('/blog');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: '로그인 실패. 이메일과 비밀번호를 확인해주세요.',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          로그인
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              로그인
            </Button>
          </Stack>
        </form>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginForm; 