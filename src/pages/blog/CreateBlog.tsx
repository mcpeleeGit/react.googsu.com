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
import { useAuth } from '../../contexts/AuthContext';

interface BlogFormData {
  title: string;
  content: string;
}

const schema = yup.object().shape({
  title: yup.string().required('제목은 필수입니다.'),
  content: yup.string().required('내용은 필수입니다.'),
});

const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: yupResolver(schema),
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data: BlogFormData) => {
    if (!token) {
      setSnackbar({
        open: true,
        message: '로그인이 필요합니다.',
        severity: 'error',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    try {
      console.log('Token:', token);
      console.log('Request Headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      const response = await axios.post(
        'http://localhost:8080/api/blogs',
        {
          title: data.title,
          content: data.content,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response:', response);

      setSnackbar({
        open: true,
        message: '블로그 포스트가 성공적으로 생성되었습니다.',
        severity: 'success',
      });

      setTimeout(() => {
        navigate('/blog');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        
        setSnackbar({
          open: true,
          message: error.response?.data?.message || '블로그 포스트 생성에 실패했습니다.',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: '블로그 포스트 생성에 실패했습니다.',
          severity: 'error',
        });
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          새 블로그 포스트 작성
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="제목"
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register('title')}
            />
            <TextField
              fullWidth
              label="내용"
              multiline
              rows={10}
              error={!!errors.content}
              helperText={errors.content?.message}
              {...register('content')}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              작성하기
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

export default CreateBlog; 