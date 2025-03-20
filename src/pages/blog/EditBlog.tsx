import React, { useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface BlogFormData {
  title: string;
  content: string;
}

const schema = yup.object().shape({
  title: yup.string().required('제목은 필수입니다.'),
  content: yup.string().required('내용은 필수입니다.'),
});

const EditBlog: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        reset({
          title: response.data.title,
          content: response.data.content,
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: '블로그 포스트를 불러오는데 실패했습니다.',
          severity: 'error',
        });
      }
    };

    fetchBlog();
  }, [id, token, reset]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      await axios.put(
        `http://localhost:8080/api/blogs/${id}`,
        {
          title: data.title,
          content: data.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbar({
        open: true,
        message: '블로그 포스트가 성공적으로 수정되었습니다.',
        severity: 'success',
      });

      setTimeout(() => {
        navigate('/blog');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: '블로그 포스트 수정에 실패했습니다.',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          블로그 포스트 수정
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
              수정하기
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

export default EditBlog; 