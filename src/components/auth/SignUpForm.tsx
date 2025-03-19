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

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

const schema = yup.object().shape({
  email: yup.string().email('유효한 이메일을 입력해주세요.').required('이메일은 필수입니다.'),
  password: yup
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .required('비밀번호는 필수입니다.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호 확인은 필수입니다.'),
  username: yup
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다.')
    .required('이름은 필수입니다.'),
});

const SignUpForm: React.FC = () => {
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
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // API 엔드포인트는 백엔드 설정에 맞게 수정해야 합니다
      const response = await axios.post('/api/auth/signup', {
        email: data.email,
        password: data.password,
        username: data.username,
      });

      setSnackbar({
        open: true,
        message: '회원가입 성공! 로그인 페이지로 이동합니다.',
        severity: 'success',
      });

      // 회원가입 성공 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: '회원가입 실패. 다시 시도해주세요.',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          회원가입
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
            <TextField
              fullWidth
              label="비밀번호 확인"
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <TextField
              fullWidth
              label="이름"
              error={!!errors.username}
              helperText={errors.username?.message}
              {...register('username')}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              회원가입
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

export default SignUpForm; 